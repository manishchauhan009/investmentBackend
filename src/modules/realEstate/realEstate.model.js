// modules/realEstate/realEstate.model.js
import mongoose from "mongoose";

const realEstateSchema = new mongoose.Schema(
  {
    name: { type: String },
    location: { type: String },
    investedValue: { type: Number },
    currentValue: { type: Number },
    roi: { type: Number },
    rent: { type: Number },
    rentYield: { type: Number },
  },
  { timestamps: true }
);

// Pre-save hook to calculate rentYield & ROI
realEstateSchema.pre("save", function (next) {
  // ✅ Rent Yield calculation
  if (this.investedValue > 0 && this.rent > 0) {
    this.rentYield = ((this.rent * 12) / this.investedValue) * 100;
  } else {
    this.rentYield = 0;
  }

  // ✅ ROI calculation
  if (this.investedValue > 0 && this.currentValue) {
    this.roi = ((this.currentValue - this.investedValue) / this.investedValue) * 100;
  } else {
    this.roi = 0;
  }

  next();
});

realEstateSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  // Ensure investedValue & currentValue exist in the update
  const invested = update.investedValue ?? update.$set?.investedValue;
  const current = update.currentValue ?? update.$set?.currentValue;
  const rent = update.rent ?? update.$set?.rent;

  if (invested > 0) {
    if (current !== undefined) {
      update.roi = ((current - invested) / invested) * 100;
    }
    if (rent !== undefined) {
      update.rentYield = ((rent * 12) / invested) * 100;
    }
  } else {
    update.roi = 0;
    update.rentYield = 0;
  }

  next();
});


const RealEstate = mongoose.model("RealEstate", realEstateSchema);

export default RealEstate;
