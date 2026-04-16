import express from "express";

import loginCustomers from "../controller/loginCustomerController.js";

const router = express.Router();

router.route("/").post(loginCustomers.login);

export default router;
