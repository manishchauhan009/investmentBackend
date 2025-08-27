import * as businessService from "./business.service.js";

export const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await businessService.getBusinesses();
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createBusiness = async (req, res) => {
  try {
    const data = {
      name: req.body.name || "New Business",
      industry: req.body.industry || "Unknown",
      valuation: req.body.valuation ?? 0,
      ownership: req.body.ownership || "0%",
      revenue: req.body.revenue ?? 0,
      netProfit: req.body.netProfit ?? 0,
      status: req.body.status || "Active",
    };
    const newBusiness = await businessService.addBusiness(data);
    res.status(201).json(newBusiness);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const editBusiness = async (req, res) => {
  try {
    const updatedBusiness = await businessService.updateBusiness(
      req.params.id,
      req.body
    );
    res.json(updatedBusiness);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeBusiness = async (req, res) => {
  try {
    await businessService.deleteBusiness(req.params.id);
    res.json({ message: "Business deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
