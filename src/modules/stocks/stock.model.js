import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Stock name is required"], 
      trim: true 
    },
    quantity: { 
      type: Number, 
      required: [true, "Quantity is required"], 
      min: [0, "Quantity cannot be negative"] 
    },
    buyPrice: { 
      type: Number, 
      required: [true, "Buy price is required"], 
      min: [0, "Buy price must be positive"] 
    },
    marketPrice: { 
      type: Number, 
      required: [true, "Market price is required"], 
      min: [0, "Market price must be positive"] 
    },
  },
  { timestamps: true }
);

// Virtual field to calculate profit/loss
stockSchema.virtual("profit").get(function () {
  return this.marketPrice - this.buyPrice;
});

export default mongoose.model("Stock", stockSchema);
