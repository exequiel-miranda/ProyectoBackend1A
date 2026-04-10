import nodemailer from "nodemailer"; //enviar correos
import crypto from "crypto"; //Generar códigos aleatorios
import jsonwebtoken from "jsonwebtoken"; //Generar token
import bcryptjs from "bcryptjs"; //Encriptar contraseña

import customerModel from "../models/customers.js";

import { config } from "../../config.js";

//creo un array de funciones
const registerCustomerController = {};

registerCustomerController.register = async (req, res) => {
  //#1- Solicitar los datos a registrar
  const {
    name,
    lastName,
    birthdate,
    email,
    password,
    isVerified,
    loginAttempts,
    timeOut,
  } = req.body;

  try {
    //Verificar si el cliente ya existe
    const existCustomer = await customerModel.findOne({ email });
    if (existCustomer) {
      return res.status(400).json({ message: "Customer already exist" });
    }

    //Encriptar la contraseña
    const passwordHash = await bcryptjs.hash(password, 10);

    //Guardamos todo en la base de datos
    const newCustomer = new customerModel({
      name,
      lastName,
      birthdate,
      email,
      password: passwordHash,
      isVerified,
      loginAttempts,
      timeOut,
    });

    //Guardamos todo en la base de datos
    await newCustomer.save();

    ////////////////////////////////////////////////////////////////////
    //Generamos un código aleatorio
    const verificationCode = crypto.randomBytes(3).toString("hex");

    //Generamos un token para guardar el cógigo aleatorio
    const tokenCode = jsonwebtoken.sign(
      //#1- ¿Qué vamos a guardar?
      { email, verificationCode },
      //#2- Secret key
      config.JWT.secret,
      //#3- ¿Cúando expira?
      { expiresIn: "15m" },
    );

    res.cookie("verificationToken", tokenCode, { maxAge: 15 * 60 * 1000 });
    /////////////////////////////////////////////////////////////////

    //Enviar ese código por correo
    //#1 Transporter -> ¿Quién envía el correo?
    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: config.email.user_email,
        pass: config.email.user_password,
      },
    });

    //#2- mailOptions -> ¿quien lo recibe?
    const mailOptions = {
      from: config.email.user_email,
      to: email,
      subject: "Verificación de cuenta",
      text:
        "Para verificar tu cuenta, utiliza este código" +
        verificationCode +
        "expira en 15 minutos",
    };

    //#3- Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("error " + error);
        return res.status(500).json({ message: "error" });
      }
      res
        .status(200)
        .json({ message: "Customer registered, verify your email" });
    });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "internal server error" });
  }
};

//VERIFICAR EL CÓDIGO QUE LE ACABAMOS DE ENVIAR
registerCustomerController.verifyCode = async (req, res) => {
  try {
    //#1 Solicitamos el código que escribieron en el frontend
    const { verificationCodeRequest } = req.body;

    //#2- Obtener el token de las cookies
    const token = req.cookies.verificationToken;

    console.log(token);

    //#3- Ver que código está en el token
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    const { email, verificationCode: storedCode } = decoded;

    //Paso final: comparar el código que el usuario escribe
    //con el código que está en el token
    if (verificationCodeRequest !== storedCode) {
      return res.status(400).json({ message: "Invalid code" });
    }

    //si el código está bien, entonces, colocamos el campo
    //"isVerified" en true
    const customer = await customerModel.findOne({ email });
    customer.isVerified = true;
    await customer.save();
//
    res.clearCookie("verificationToken");

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default registerCustomerController;
