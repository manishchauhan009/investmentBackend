import express from "express";
import {
  getAllBusinesses,
  createBusiness,
  editBusiness,
  removeBusiness,
} from "./business.controller.js";

const router = express.Router();

router.get("/", getAllBusinesses);
router.post("/", createBusiness);
router.put("/:id", editBusiness);
router.delete("/:id", removeBusiness);

export default router;
