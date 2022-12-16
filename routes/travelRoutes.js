import express from "express";
import {
  getTravels,
  newTravel,
  getTravel,
  editTravel,
  deleteTravels,
} from "../controllers/travelController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, getTravels).post(checkAuth, newTravel);

router
  .route("/:id")
  .get(checkAuth, getTravel)
  .put(checkAuth, editTravel)
  .delete(checkAuth, deleteTravels);

export default router;
