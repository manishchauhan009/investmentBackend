import { Commodity } from "./commodity.model.js";

// Get all commodities
export const getCommodities = async (userId) => {
  return await Commodity.find({ user: userId });
};

// Add commodity
export const addCommodity = async (data, userId) => {
  const { quantity, marketPrice } = data;
  const value = quantity && marketPrice ? quantity * marketPrice : 0;

  const newCommodity = new Commodity({
    ...data,
    user: userId,
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
