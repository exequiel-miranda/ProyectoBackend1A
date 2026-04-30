//Creo un array de métodos
const productsController = {};
//import el Schema de la colección que
// voy a ocupar
import productsModel from "../models/products.js";

//SELECT
productsController.getProducts = async (req, res) => {
  const products = await productsModel.find();
  res.json(products);
};

//INSERT
productsController.insertProducts = async (req, res) => {
  const { name, description, price, stock } = req.body;
  const newProduct = new productsModel({ name, description, price, stock });
  await newProduct.save();
  res.json({ message: "Product save" });
};

//UPDATE
productsController.updateProducts = async (req, res) => {
  const { name, description, price, stock } = req.body;
  await productsModel.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      price,
      stock,
    },
    { new: true },
  );

  res.json({ message: "product updated" });
};

//ELIMINAR
productsController.deleteProducts = async (req, res) => {
  await productsModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};

//Buscar por id
productsController.getProductById = async (req, res) => {
  try {
    const product = await productsModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.log("error found" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Buscar por nombre
productsController.getProductsByName = async (req, res) => {
  try {
    const { name } = req.query;     
    const products = await productsModel.find({ name:{ $regex: name, $options: "i" } });
    if (!products) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(products);
  } catch (error) {
    console.log("error found" + error);
    return res.status(500).json({ message: "Internal server error" });
  }   
};  

//Buscar stock bajo
productsController.getLowStock = async (req, res) => {
  try {
    const { stock } = req.query;
    const products = await productsModel.find({ stock: { $lt: 5 } });
    if (!products) {
      return res.status(404).json({ message: "No products found with low stock" });
    }
    res.json(products);
  } catch (error) {
    console.log("error found" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Buscar por rango de precio
productsController.getProductsByPriceRange = async (req, res) => {
  try { 
    const { min, max } = req.query;
    const products = await productsModel.find({ price: { $gte: min, $lte: max } });
    if (!products) {
      return res.status(404).json({ message: "No products found in the specified price range" });
    }
    res.json(products);
  } catch (error) {
    console.log("error found" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//contar productos
productsController.countProducts = async (req, res) => {
  try {
    const count = await productsModel.countDocuments(); 
    res.status(200).json({ count });
  } catch (error) { 
    console.log("error found" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

  
export default productsController;
