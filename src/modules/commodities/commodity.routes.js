import express from "express";
import {
  getAllCommodities,
  createCommodity,
  editCommodity,
  removeCommodity,
} from "./commodity.controller.js";
import { protect } from "../../middlewares/protect.js";

const router = express.Router();


router.get("/",protect, getAllCommodities);
router.post("/",protect, createCommodity);
router.put("/:id",protect, editCommodity);
router.delete("/:id",protect, removeCommodity);

export default router;
