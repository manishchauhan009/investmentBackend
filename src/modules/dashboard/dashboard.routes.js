import express from "express";
import { getDashboardStats } from "./dashboard.controller.js";
import { protect } from "../../middlewares/protect.js";

const router = express.Router();

router.get("/", protect, getDashboardStats);


export default router;
