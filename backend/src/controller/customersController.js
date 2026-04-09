//importamos el Schema que vamos a utilizar
import customerModel from "../models/customers.js";

//creamos un array de funciones
const customerController = {};

//SELECT
customerController.getCustomer = async (req, res) => {
  try {
    const customers = await customerModel.find();
    return res.status(200).json(customers);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//DELETE
customerController.deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await customerModel.findByIdAndDelete(
      req.params.id,
    );

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json({ message: "Customer deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "internal server error" });
  }
};

//UPDATE
customerController.updateCustomer = async (req, res) => {
  try {
    //solicitos los nuevos datos a actualziar
    let {
      name,
      lastName,
      birthdate,
      email,
      password,
      isVerified,
      loginAttempts,
      timeOut,
    } = req.body;

    //VALIDACIONES
    //sanitizar
    name = name?.trim();
    email = email?.trim();

    //validación de tamaño del nombre
    if (name.length < 3 || name.length > 15) {
      return res.status(400).json({ message: "Invalid name" });
    }

    //validar la fecha de nacimiento
    if (birthdate > new Date() || birthdate < new Date("1900-01-01")) {
      return res.status(400).json({ message: "Invalid birthdate" });
    }

    //Acctualizamos
    const updatedCustomer = await customerModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        lastName,
        birthdate,
        email,
        password,
        isVerified,
        loginAttempts,
        timeOut,
      },
      { new: true },
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json({ message: "Customer updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default customerController;
