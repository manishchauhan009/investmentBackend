import express from "express";
import {
  getAllProperties,
  getPropertyById,
  addProperty,
  updateProperty,
  deleteProperty,
} from "./realEstate.controller.js";
import { protect } from "../../middlewares/protect.js";

const router = express.Router();

router.get("/", protect, getAllProperties);
router.get("/:id", protect, getPropertyById);
router.post("/", protect, addProperty);
router.put("/:id", protect, updateProperty);
router.delete("/:id", protect, deleteProperty);

export default router;
