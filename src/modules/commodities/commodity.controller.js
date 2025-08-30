import * as commodityService from "./commodity.service.js";

export const getAllCommodities = async (req, res) => {
  try {
    const commodities = await commodityService.getCommodities(req.user._id);
    res.json(commodities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCommodity = async (req, res) => {
  try {
    const newCommodity = await commodityService.addCommodity(req.body, req.user._id);
    res.status(201).json(newCommodity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const editCommodity = async (req, res) => {
  try {
    const updatedCommodity = await commodityService.updateCommodity(
      req.params.id,
      req.body
    );
    res.json(updatedCommodity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeCommodity = async (req, res) => {
  try {
    await commodityService.deleteCommodity(req.params.id);
    res.json({ message: "Commodity deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
