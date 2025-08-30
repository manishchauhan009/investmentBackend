import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: `"Shree Rimake Holdings" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your One-Time Password (OTP)",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px; background: #fafafa;">
          <h2 style="color: #2e86de; text-align: center;">🔐 Shree Rimake Holdings</h2>
          <p style="font-size: 16px; color: #333;">Dear User,</p>
          <p style="font-size: 16px; color: #333;">Use the following OTP to complete your verification:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #2e86de; letter-spacing: 4px;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #777;">This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
          <hr/>
          <p style="font-size: 12px; color: #999; text-align: center;">© ${new Date().getFullYear()} Shree Rimake Holdings. All rights reserved.</p>
        </div>
      `,
    });

    console.log("✅ OTP email sent successfully");
  } catch (err) {
    console.error("❌ Error sending OTP:", err.message);
    throw new Error("Failed to send OTP email");
  }
};
