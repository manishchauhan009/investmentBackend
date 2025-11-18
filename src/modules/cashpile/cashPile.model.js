import mongoose from "mongoose";

const cashPileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assetClass: {
      type: String,
      enum: ["stocks", "realEstate", "commodities", "businesses", "global"],
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
  },
  { timestamps: true }
);

// One cash pile per user per assetClass
cashPileSchema.index({ user: 1, assetClass: 1 }, { unique: true });

export const CashPile = mongoose.model("CashPile", cashPileSchema);
