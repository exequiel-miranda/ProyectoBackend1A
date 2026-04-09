import express from "express";
import customerController from "../controller/customersController.js";

//Usamos Router() de la libreria Express que
//define los metodos HTTP (get, post, put, delete)

const router = express.Router();

router.route("/")
.get(customerController.getCustomer);

router.route("/:id")
  .put(customerController.updateCustomer)
  .delete(customerController.deleteCustomer);

export default router;
