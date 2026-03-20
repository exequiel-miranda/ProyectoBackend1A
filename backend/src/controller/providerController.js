//Array de funciones
const providerController = {};

//Importo la colección que voy a ocupar
import providerModel from "../models/providers.js";

//SELECT
providerController.getProviders = async (req, res) => {
  try {
    const providers = await providerModel.find();
    return res.status(200).json(providers);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//INSERT
providerController.insertProviders = async (req, res) => {
  try {
    //#1- Solicitamos los datos
    let { name, birthday, heigth, DUI, phone } = req.body;

    //#2 - Validar
    //Sanitizar
    name = name?.trim();
    DUI = DUI?.trim();
    phone = phone?.trim();

    //campos requeridos
    if (!name || !DUI || !phone) {
      return res.status(400).json({ message: "Field required" });
    }

    //Longitud de campos
    if (name.length < 3) {
      return res.status(400).json({ message: "name too short" });
    }

    if (DUI.length > 10 || DUI.length < 9) {
      return res.status(400).json({ message: "DUI not valid" });
    }

    //Validación de fecha
    if (birthday > new Date() || birthday < new Date("1908-01-01")) {
      return res.status(400).json({ message: "invalid date" });
    }

    //validación de numero
    if (Number(heigth) > 270) {
      return res.status(400).json({ message: "Heigth too long" });
    }

    const newProvider = new providerModel({
      name,
      birthday,
      heigth,
      DUI,
      phone,
    });
    await newProvider.save();

    return res.status(201).json({ mesage: "Provider saved" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//ELIMINAR
providerController.deleteProvider = async (req, res) => {
  try {
    const deletedProvider = await providerModel.findByIdAndDelete(
      req.params.id,
    );

    if (!deletedProvider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    return res.status(200).json({ message: "Provider deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//ACTUALIZAR
providerController.updateProvider = async (req, res) => {
  try {
    //#1- Solicitamos los datos
    let { name, birthday, heigth, DUI, phone } = req.body;

    //#2 - Validar
    //Sanitizar
    name = name?.trim();
    heigth = heigth?.trim();
    DUI = DUI?.trim();
    phone = phone?.trim();

    //Longitud de campos
    if (name.length < 3) {
      return res.status(400).json({ message: "name too short" });
    }

    if (DUI.length > 10 || DUI.length < 9) {
      return res.status(400).json({ message: "DUI not valid" });
    }

    //Validación de fecha
    if (birthday > new Date() || birthday < new Date("1908-01-01")) {
      return res.status(400).json({ message: "invalid date" });
    }

    //validación de numero
    if (Number(heigth) > 270) {
      return res.status(400).json({ message: "Heigth too long" });
    }

    const providerUpdated = await providerModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        birthday,
        heigth,
        DUI,
        phone,
      },
      { new: true },
    );

    if (!providerUpdated) {
      return res.status(404).json({ message: "Provider not found" });
    }

    return res.status(200).json({ message: "provider updated" });
  } catch (error) {
    console.log("error found" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default providerController;
