import { Business } from "./business.model.js";

// Get all businesses
export const getBusinesses = async () => {
  return await Business.find();
};

// Add new business
export const addBusiness = async (data) => {
  const newBusiness = new Business(data);
  return await newBusiness.save();
};

// Update business
export const updateBusiness = async (id, data) => {
  return await Business.findByIdAndUpdate(id, data, { new: true });
};

// Delete business
export const deleteBusiness = async (id) => {
  return await Business.findByIdAndDelete(id);
};
