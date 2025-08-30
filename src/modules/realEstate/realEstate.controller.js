// modules/realEstate/realEstate.controller.js
import * as realEstateService from "./realEstate.service.js";

// Get all
export const getAllProperties = async (req, res) => {
  try {
    const properties = await realEstateService.getAllProperties(req.user._id);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get by ID
export const getPropertyById = async (req, res) => {
  try {
    const property = await realEstateService.getPropertyById(req.params.id, req.user._id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new
export const addProperty = async (req, res) => {
  try {
    const property = await realEstateService.addProperty(req.body, req.user._id);
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update
export const updateProperty = async (req, res) => {
  try {
    const property = await realEstateService.updateProperty(req.params.id, req.body, req.user._id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete
export const deleteProperty = async (req, res) => {
  try {
    const property = await realEstateService.deleteProperty(req.params.id, req.user._id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
