// modules/realEstate/realEstate.service.js
import RealEstate from "./realEstate.model.js";

// Get all properties
export const getAllProperties = async () => {
  return await RealEstate.find();
};

// Get property by ID
export const getPropertyById = async (id) => {
  return await RealEstate.findById(id);
};

// Add a property
export const addProperty = async (propertyData) => {
  const property = new RealEstate(propertyData);
  return await property.save();
};

// Update property
export const updateProperty = async (id, updatedData) => {
  return await RealEstate.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });
};

// Delete property
export const deleteProperty = async (id) => {
  return await RealEstate.findByIdAndDelete(id);
};
