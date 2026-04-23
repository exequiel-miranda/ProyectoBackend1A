import JsonWebToken from "jsonwebtoken";
import { config } from "../config.js";
import bcryptjs from "bcryptjs";
import customerModel from "../models/customers.js";
import HTMLRecoveryEmail from "../utils/sendMailRecovery.js";

const recoveryPasswordController = {};

recoveryPasswordController.recoverPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const userFound = await customerModel.findOne({ email });

    if (!userFound) {
      return res.json({ message: "User not found" });
    }

    const code = crypto.randomBytes(3).toString("hex");

    const token = JsonWebToken.sign(
      {
        email,
        code,
        userType: "customer",
        verified: false,
      },
      config.JWT.secret,
      { expiresIn: "15m" },
    );
    res.cookie("recoveryCookie", token, { maxAge: 15 * 60 * 1000 });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user_email,
        pass: config.email.user_password,
      },
    });

    const mailOptions = {
      from: config.email.user_email,
      to: email,
      subject: "Correo de recuperación",
      body: `use this code to recover ur account`,
      html: HTMLRecoveryEmail(code),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Error sending mail" });
      }
      res.json({ message: "email sent" });
    });
  } catch (error) {
    console.log("error found" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



recoveryPasswordController.verifyCode = async (req, res) => {
  try {
    const { codeRequest } = req.body;
    const token = req.cookies.recoveryCookie;   
    const decoded = JsonWebToken.verify(token, config.JWT.secret);

    if (decoded.code !== codeRequest) {
      return res.status(400).json({ message: "Invalid code" });
    }

    const newToken = JsonWebToken.sign(
      {
        email: decoded.email, userType: "customer", verified: true,
      },
      config.JWT.secret,
      { expiresIn: "15m" },
    );
    res.cookie("recoveryCookie", newToken, { maxAge: 15 * 60 * 1000 });

    return res.status(200).json({ message: "Code verified successfully" });

} catch (error) {
    console.log("error found" + error);
    return res.status(500).json({ message: "Internal server error" });
  } 
};

recoveryPasswordController.newPassword = async (req, res) => { 
    try {
        const { newPassword, confirmNewPassword } = req.body;

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: "Passwords doesnt match" });
        }

        const token = req.cookies.recoveryCookie;
        const decoded = JsonWebToken.verify(token, config.JWT.secret);

        if (!decoded.verified) {
            return res.status(400).json({ message: "Code not verified" });
        }

        const passwordHash = await bcryptjs.hash(newPassword, 10);
        await customerModel.findOneAndUpdate(
            { email: decoded.email },
            { password: passwordHash },
            { new: true }
        );

        res.clearCookie("recoveryCookie");
        return res.status(200).json({ message: "Password updated" });



       
    } catch (error) {
        console.log("error found" + error);
        return res.status(500).json({ message: "Internal server error" });
    }   
};

export default recoveryPasswordController;