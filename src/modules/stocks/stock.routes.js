import { Router } from "express";
import {
  getAllStocks,
  createStock,
  editStock,
  removeStock,
} from "./stock.controller.js";

const router = Router();

router.get("/", getAllStocks);       // GET all stocks
router.post("/", createStock);       // Add new stock
router.put("/:id", editStock);       // Update stock
router.delete("/:id", removeStock);  // Delete stock

export default router;
