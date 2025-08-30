import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    industry: { type: String, required: true },
    valuation: { type: Number, required: true },
    ownership: { type: String, required: true }, // % ownership
    revenue: { type: Number, required: true },
    netProfit: { type: Number, required: true },
    status: { type: String, enum: ["Active", "Exited", "Planning"], default: "Active" },
  },
  { timestamps: true }
);

export const Business = mongoose.model("Business", businessSchema);
