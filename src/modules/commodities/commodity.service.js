import { Commodity } from "./commodity.model.js";

// Get all commodities
export const getCommodities = async () => {
  return await Commodity.find();
};

// Add commodity
export const addCommodity = async (data) => {
  const { quantity, marketPrice } = data;
  const value = quantity && marketPrice ? quantity * marketPrice : 0;

  const newCommodity = new Commodity({
    ...data,
    value,
  });

  return await newCommodity.save();
};

// Update commodity
export const updateCommodity = async (id, data) => {
  if (data.quantity && data.marketPrice) {
    data.value = data.quantity * data.marketPrice;
  }
  return await Commodity.findByIdAndUpdate(id, data, { new: true });
};

// Delete commodity
export const deleteCommodity = async (id) => {
  return await Commodity.findByIdAndDelete(id);
};
