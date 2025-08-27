const RealEstate = require("../realEstate/realEstate.model");
const Stock = require("../stocks/stock.model");
const Commodity = require("../commodities/commodity.model");
const Business = require("../businesses/business.model");

exports.getDashboardData = async () => {
  // Fetch all investments
  const realEstate = await RealEstate.find();
  const stocks = await Stock.find();
  const commodities = await Commodity.find();
  const businesses = await Business.find();

  // Calculate totals
  const totalRealEstate = realEstate.reduce((sum, item) => sum + item.investmentAmount, 0);
  const totalStocks = stocks.reduce((sum, item) => sum + item.investmentAmount, 0);
  const totalCommodities = commodities.reduce((sum, item) => sum + item.investmentAmount, 0);
  const totalBusinesses = businesses.reduce((sum, item) => sum + item.investmentAmount, 0);

  // ROI Example (if model has `currentValue`)
  const totalROI = 
    realEstate.reduce((sum, item) => sum + (item.currentValue - item.investmentAmount), 0) +
    stocks.reduce((sum, item) => sum + (item.currentValue - item.investmentAmount), 0) +
    commodities.reduce((sum, item) => sum + (item.currentValue - item.investmentAmount), 0) +
    businesses.reduce((sum, item) => sum + (item.currentValue - item.investmentAmount), 0);

  return {
    totals: {
      realEstate: totalRealEstate,
      stocks: totalStocks,
      commodities: totalCommodities,
      businesses: totalBusinesses,
    },
    roi: totalROI,
    breakdown: [
      { category: "Real Estate", amount: totalRealEstate },
      { category: "Stocks", amount: totalStocks },
      { category: "Commodities", amount: totalCommodities },
      { category: "Businesses", amount: totalBusinesses },
    ]
  };
};
