// modules/realEstate/realEstate.routes.js
import express from "express";
import {
  getAllProperties,
  getPropertyById,
  addProperty,
  updateProperty,
  deleteProperty,
} from "./realEstate.controller.js";

const router = express.Router();

router.get("/", getAllProperties);
router.get("/:id", getPropertyById);
router.post("/", addProperty);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);

export default router;
