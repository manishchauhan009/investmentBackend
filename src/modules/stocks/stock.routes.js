// modules/stocks/stock.routes.js
import { Router } from "express";
import {
  getAllStocks,
  getSingleStock,
  createStock,
  editStock,
  removeStock,
} from "./stock.controller.js";
import { protect } from "../../middlewares/protect.js";

const router = Router();

router.get("/", protect, getAllStocks);        // GET all stocks
router.get("/:id", protect, getSingleStock);   // GET stock by id
router.post("/", protect, createStock);        // Add new stock
router.put("/:id", protect, editStock);        // Update stock
router.delete("/:id", protect, removeStock);   // Delete stock

export default router;
