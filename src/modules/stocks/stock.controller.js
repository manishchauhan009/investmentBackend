// modules/stocks/stock.controller.js
import {
  getStocks,
  getStockById,
  addStock,
  updateStock,
  deleteStock,
} from "./stock.service.js";

// GET /api/stocks
export const getAllStocks = async (req, res, next) => {
  try {
    const stocks = await getStocks(req.user._id);
    res.json({ success: true, data: stocks });
  } catch (err) {
    next(err);
  }
};

// GET /api/stocks/:id
export const getSingleStock = async (req, res, next) => {
  try {
    const stock = await getStockById(req.params.id, req.user._id);
    if (!stock) {
      return res.status(404).json({ success: false, message: "Stock not found" });
    }
    res.json({ success: true, data: stock });
  } catch (err) {
    next(err);
  }
};

// POST /api/stocks
export const createStock = async (req, res, next) => {
  try {
    const stock = await addStock(req.body, req.user._id);
    res.status(201).json({ success: true, data: stock });
  } catch (err) {
    next(err);
  }
};

// PUT /api/stocks/:id
export const editStock = async (req, res, next) => {
  try {
    const stock = await updateStock(req.params.id, req.body, req.user._id);
    if (!stock) {
      return res.status(404).json({ success: false, message: "Stock not found" });
    }
    res.json({ success: true, data: stock });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/stocks/:id
export const removeStock = async (req, res, next) => {
  try {
    const deleted = await deleteStock(req.params.id, req.user._id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Stock not found" });
    }
    res.json({ success: true, message: "Stock deleted successfully" });
  } catch (err) {
    next(err);
  }
};
