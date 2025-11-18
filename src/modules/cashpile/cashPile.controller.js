import { CashPile } from "./cashPile.model.js";

// GET /api/v1/cash-piles
export const getCashPiles = async (req, res) => {
  try {
    const userId = req.user._id; // assuming auth middleware sets req.user
    const piles = await CashPile.find({ user: userId }).lean();

    res.json({ success: true, data: piles });
  } catch (err) {
    console.error("Failed to fetch cash piles:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/v1/cash-piles/:assetClass
export const getCashPileByClass = async (req, res) => {
  try {
    const userId = req.user._id;
    const { assetClass } = req.params;

    const pile = await CashPile.findOne({ user: userId, assetClass }).lean();

    res.json({
      success: true,
      data: pile || { assetClass, amount: 0, currency: "INR" },
    });
  } catch (err) {
    console.error("Failed to fetch cash pile:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/v1/cash-piles/:assetClass  (set amount)
export const setCashPile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { assetClass } = req.params;
    const { amount } = req.body;

    if (amount < 0) {
      return res
        .status(400)
        .json({ success: false, message: "Amount cannot be negative" });
    }

    const pile = await CashPile.findOneAndUpdate(
      { user: userId, assetClass },
      { amount },
      { new: true, upsert: true }
    );

    res.json({ success: true, data: pile });
  } catch (err) {
    console.error("Failed to update cash pile:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /api/v1/cash-piles/:assetClass/add  (increment amount)
export const addToCashPile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { assetClass } = req.params;
    const { delta } = req.body; // can be + or -

    const pile = await CashPile.findOneAndUpdate(
      { user: userId, assetClass },
      { $inc: { amount: delta } },
      { new: true, upsert: true }
    );

    res.json({ success: true, data: pile });
  } catch (err) {
    console.error("Failed to add to cash pile:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
