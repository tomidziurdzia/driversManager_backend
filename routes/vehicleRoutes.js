import express from "express";
import {
  getVehicles,
  newVehicle,
  getVehicle,
  editVehicle,
  deleteVehicle,
} from "../controllers/vehicleController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, getVehicles).post(checkAuth, newVehicle);

router
  .route("/:id")
  .get(checkAuth, getVehicle)
  .put(checkAuth, editVehicle)
  .delete(checkAuth, deleteVehicle);

export default router;
