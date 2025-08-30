// modules/stocks/stock.service.js
import Stock from "./stock.model.js";

// Get all stocks for a user
export const getStocks = async (userId) => {
  return await Stock.find({ user: userId });
};

// Get single stock by ID for a user
export const getStockById = async (id, userId) => {
  return await Stock.findOne({ _id: id, user: userId });
};

// Add a new stock (attach logged-in user)
export const addStock = async (stockData, userId) => {
  const stock = new Stock({ ...stockData, user: userId });
  return await stock.save();
};

// Update a stock (only if it belongs to the user)
export const updateStock = async (id, updatedStock, userId) => {
  return await Stock.findOneAndUpdate(
    { _id: id, user: userId },
    updatedStock,
    { new: true, runValidators: true }
  );
};

// Delete a stock (only if it belongs to the user)
export const deleteStock = async (id, userId) => {
  return await Stock.findOneAndDelete({ _id: id, user: userId });
};
  