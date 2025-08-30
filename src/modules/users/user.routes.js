import express from "express";
import { register, login, verifyOtp } from "./user.controller.js";

const router = express.Router();

router.post("/register", register);      // Step 1: Request OTP
router.post("/verify-otp", verifyOtp);   // Step 2: Verify OTP & Create User
router.post("/login", login);            // Step 3: Login after verification

export default router;
