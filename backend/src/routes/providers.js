import express from "express";

import providerController from "../controller/providerController.js";

//usamos la función Router() de la libreria expres
//para acceder a los métodos get, post, put, delete
const router = express.Router();

router
  .route("/")
  .get(providerController.getProviders)
  .post(providerController.insertProviders);

router
  .route("/:id")
  .put(providerController.updateProvider)
  .delete(providerController.deleteProvider);

export default router;
