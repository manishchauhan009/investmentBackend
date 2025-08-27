import mongoose from "mongoose";

const commoditySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true }, // g, kg, barrels etc.
    buyPrice: { type: Number, required: true },
    marketPrice: { type: Number, required: true },
    value: { type: Number, required: true }, // total value = quantity * marketPrice (approx)
  },
  { timestamps: true }
);

export const Commodity = mongoose.model("Commodity", commoditySchema);
