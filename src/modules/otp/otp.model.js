import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  userData: { type: Object, required: true }, // store user info until verified
  createdAt: { type: Date, default: Date.now, expires: 300 }, // ⏳ TTL (5 min)
});

export const OTP = mongoose.model("OTP", otpSchema);
