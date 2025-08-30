import * as businessService from "./business.service.js";

export const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await businessService.getBusinesses({ user: req.user._id }); 
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
      user: req.user._id, // ✅ attach logged-in user
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
      req.body,
      req.user._id // ✅ check ownership
    );
    if (!updatedBusiness) {
      return res.status(403).json({ error: "Not authorized to edit this business" });
    }
    res.json(updatedBusiness);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeBusiness = async (req, res) => {
  try {
    const deletedBusiness = await businessService.deleteBusiness(req.params.id, req.user._id);
    if (!deletedBusiness) {
      return res.status(403).json({ error: "Not authorized to delete this business" });
    }
    res.json({ message: "Business deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
