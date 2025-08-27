import express from "express";
import {
  getAllCommodities,
  createCommodity,
  editCommodity,
  removeCommodity,
} from "./commodity.controller.js";

const router = express.Router();

router.get("/", getAllCommodities);
router.post("/", createCommodity);
router.put("/:id", editCommodity);
router.delete("/:id", removeCommodity);

export default router;
