import express from "express";
import {
  getCashPiles,
  getCashPileByClass,
  setCashPile,
  addToCashPile,
} from "./cashPile.controller.js";
import { protect } from "../../middlewares/protect.js";

const router = express.Router();

router.use(protect)

router.get("/", getCashPiles);
router.get("/:assetClass", getCashPileByClass);
router.put("/:assetClass", setCashPile);
router.patch("/:assetClass/add", addToCashPile);

export default router;
