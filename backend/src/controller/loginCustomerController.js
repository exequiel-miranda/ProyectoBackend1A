import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

import customerModel from "../models/customers.js";
import { config } from "../../config.js";

//Array de funciones
const loginCustomerController = {};

loginCustomerController.login = async (req, res) => {
  try {
    //Solicitar los datos
    const { email, password } = req.body;
    //Veriaficar que existe el correo en la bd
    const userFound = await customerModel.findOne({ email });

    if (!userFound) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    //Verificar que no esté bloqueado
    if (userFound.timeOut && userFound.timeOut > Date.now()) {
      return res.status(403).json({ message: "Cuenta bloqueada" });
    }

    //Validar la contraseña
    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) {
      //Si se equivoca en la contraseña
      //vamos a sumarle 1 a los intentos fallidos
      userFound.loginAttemps = (userFound.loginAttemps || 0) + 1;

      //Bloquear la cuenta despues de 5 intentos fallidos
      if (userFound.loginAttemps >= 5) {
        userFound.timeOut = Date.now() + 15 * 60 * 1000;
        userFound.loginAttemps = 0;

        await userFound.save();

        return res.status(403).json({ message: "Cuenta bloqueada" });
      }

      await userFound.save();
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    //Si escribe los datos bien, hay que borrar los
    //intentos fallidos anteriores
    userFound.loginAttemps = 0;
    userFound.timeOut = null;
    await userFound.save();

    //Crear el token
    const token = jsonwebtoken.sign(
      //#1- ¿que vamos a guardar?
      { id: userFound._id, userType: "customer" },
      //#2- Secret key
      config.JWT.secret,
      //#3- cuando expira
      { expiresIn: "30d" },
    );

    //Guardamos el token en una cookie
    res.cookie("authCookie", token);

    //Listo!
    return res.status(200).json({ message: "Login exitoso" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ mesage: "Internal server error" });
  }
};

export default loginCustomerController;
