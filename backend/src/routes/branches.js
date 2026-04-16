import express from "express";
import {
  getBranches,
  insertBranches,
  deleteBranches,
  updateBranches,
} from "../controller/branchesController.js";

//Router() nos ayuda a colocar los métodos
//que tendrá mi endpoint

const router = express.Router();

router
  .route("/")
  .get(getBranches)
  .post(insertBranches);

router
  .route("/:id")
  .put(updateBranches)
  .delete(deleteBranches);

export default router;
