import { Business } from "./business.model.js";

// Get all businesses (only for logged-in user)
export const getBusinesses = async (filter) => {
  return await Business.find(filter);
};

// Add new business
export const addBusiness = async (data) => {
  const newBusiness = new Business(data);
  return await newBusiness.save();
};

// Update business (with user ownership check)
export const updateBusiness = async (id, data, userId) => {
  return await Business.findOneAndUpdate(
    { _id: id, user: userId }, // ✅ check user ownership
    data,
    { new: true }
  );
};

// Delete business (with user ownership check)
export const deleteBusiness = async (id, userId) => {
  return await Business.findOneAndDelete({ _id: id, user: userId });
};
