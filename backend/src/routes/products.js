import express from "express";
import productsController from "../controller/productsController.js";

//Router() nos ayuda a colocar los métodos
// que tendrá mi endpoint

const router = express.Router();

router.route("/")
.get(productsController.getProducts)
.post(productsController.insertProducts);

router.route("/searchbyname")
.post(productsController.getProductsByName);

router.route("/low-stock")
.get(productsController.getLowStock);

router.route("/price-range")
.post(productsController.getProductsByPriceRange);

router.route("/count")
.get(productsController.countProducts);


router.route("/:id")
.get(productsController.getProductById)
.put(productsController.updateProducts)
.delete(productsController.deleteProducts);

export default router;

