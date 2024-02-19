import express from "express";
import {
  getPlatforms,
  newPlatform,
  getPlatform,
  editPlatform,
  deletePlatform,
} from "../controllers/platformController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, getPlatforms).post(checkAuth, newPlatform);

router
  .route("/:id")
  .get(checkAuth, getPlatform)
  .put(checkAuth, editPlatform)
  .delete(checkAuth, deletePlatform);

export default router;
