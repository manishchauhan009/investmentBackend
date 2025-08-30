import { createUser, findUserByEmail } from "./user.service.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendOTPEmail } from "../../utils/emailService.js";
import { OTP } from "../otp/otp.model.js";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// 🔹 Step 1: Request OTP (Registration)
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Hash password temporarily (store in OTP doc until verified)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Delete old OTP if exists
    await OTP.deleteMany({ email });

    // Save OTP in DB (expires in 5 min due to TTL index)
    await OTP.create({
      email,
      otp,
      userData: { name, email, password: hashedPassword }, // custom field
    });

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify to complete registration.",
    });
  } catch (err) {
    next(err);
  }
};

// 🔹 Step 2: Verify OTP
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Check OTP record in DB
    const record = await OTP.findOne({ email });
    if (!record) {
      return res.status(400).json({ success: false, message: "OTP expired or not found" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Create user in DB (using stored userData)
    const user = await createUser({ ...record.userData, isVerified: true });

    // Remove OTP after successful verification
    await OTP.deleteOne({ email });

    res.json({
      success: true,
      message: "OTP verified and user registered successfully",
      token: generateToken(user),
      data: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

// 🔹 Login (only if verified)
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ success: false, message: "Please verify your OTP before login" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email },
      token: generateToken(user),
    });
  } catch (err) {
    next(err);
  }
};
