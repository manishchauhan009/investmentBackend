// modules/realEstate/realEstate.service.js
import RealEstate from "./realEstate.model.js";

// Get all properties for a user
export const getAllProperties = async (userId) => {
  return await RealEstate.find({ user: userId });
};

// Get single property for a user
export const getPropertyById = async (id, userId) => {
  return await RealEstate.findOne({ _id: id, user: userId });
};

// Add a property (force attach logged-in user)
export const addProperty = async (propertyData, userId) => {
  const property = new RealEstate({ ...propertyData, user: userId });
  return await property.save();
};

// Update property (only if it belongs to the user)
export const updateProperty = async (id, updatedData, userId) => {
  return await RealEstate.findOneAndUpdate(
    { _id: id, user: userId },
    updatedData,
    { new: true, runValidators: true }
  );
};

// Delete property (only if it belongs to the user)
export const deleteProperty = async (id, userId) => {
  return await RealEstate.findOneAndDelete({ _id: id, user: userId });
};
