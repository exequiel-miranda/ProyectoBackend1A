import bcrypt from "bcryptjs";
import JsonWebToken from "jsonwebtoken";

import customerModel from "../models/customers.js";
import { config } from "../../config.js";

const loginCustomers = {};

loginCustomers.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userFound = await customerModel.findOne({ email });

        //verificar correo
        if (!userFound) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        //verificar cuenta no bloqueada
        if (userFound.timeOut && userFound.timeOut > Date.now()) {
            return res.status(403).json({ message: "Cuenta bloqueada" });
        }

        //validar contraseña
        const isMatch = await bcrypt.compare(password, userFound.password);

        if (!isMatch) {
            //si se equivoca se suma 1 al intento fallido
            userFound.loginAttempts = (userFound.loginAttempts || 0) + 1;

            //bloquear cuenta a los 5 intentos fallidos
            if (userFound.loginAttempts >= 5) {
                userFound.timeOut = Date.now() + 15 * 60 * 1000;
                userFound.loginAttempts = 0;

                await userFound.save();

                return res.status(403).json({ message: "Cuenta bloqueada" });
            }

            await userFound.save();
            return res.status(401).json({ message: "Contraseña Incorrecta" });
        }

        //si accede se reinician las cuentas
        userFound.loginAttempts = 0;
        userFound.timeOut = null;
        await userFound.save();

        //generar cookie
        const token = JsonWebToken.sign(
            //#1 que se guarda
            { id: userFound._id, userType: "Customer" },

            //llave secreta
            config.JWT.secret,

            //cuando expira
            { expiresIn: "30d" },
        );

        res.cookie("authCookie", token);

        return res.status(200).json({ message: "Login exitoso" });
    } catch (error) {
        console.log("error found" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default loginCustomers;
