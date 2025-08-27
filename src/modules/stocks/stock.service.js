// modules/stocks/stock.service.js
import Stock from "./stock.model.js";

// Get all stocks
export const getStocks = async () => {
  return await Stock.find();
};

// Get single stock by ID
export const getStockById = async (id) => {
  return await Stock.findById(id);
};

// Add a new stock
export const addStock = async (stockData) => {
  const stock = new Stock(stockData);
  return await stock.save();
};

// Update a stock
export const updateStock = async (id, updatedStock) => {
  return await Stock.findByIdAndUpdate(id, updatedStock, { new: true });
};

// Delete a stock
export const deleteStock = async (id) => {
  return await Stock.findByIdAndDelete(id);
};
