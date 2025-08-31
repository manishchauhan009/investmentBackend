// server/src/modules/dashboard/dashboard.controller.js
import RealEstate from "../realEstate/realEstate.model.js";
import Stock from "../stocks/stock.model.js";
import { Commodity } from "../commodities/commodity.model.js";
import { Business } from "../businesses/business.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized: user not found" });
    }

    const userId = req.user._id;

    // Fetch user's records
    const [realEstates, stocks, commodities, businesses] = await Promise.all([
      RealEstate.find({ user: userId }),
      Stock.find({ user: userId }),
      Commodity.find({ user: userId }),
      Business.find({ user: userId }),
    ]);

    // Counts
    const counts = {
      realEstate: realEstates.length,
      stocks: stocks.length,
      commodities: commodities.length,
      businesses: businesses.length,
    };

    // Calculations
    const totalRealEstateInvested = realEstates.reduce((sum, r) => sum + (r.investedValue || 0), 0);
    const totalRealEstateCurrent = realEstates.reduce((sum, r) => sum + (r.currentValue || 0), 0);
    const realEstateROI = totalRealEstateInvested > 0
      ? ((totalRealEstateCurrent - totalRealEstateInvested) / totalRealEstateInvested) * 100
      : 0;

    const totalStockInvested = stocks.reduce((sum, s) => sum + (s.quantity * s.buyPrice), 0);
    const totalStockCurrent = stocks.reduce((sum, s) => sum + (s.quantity * s.marketPrice), 0);
    const stockROI = totalStockInvested > 0
      ? ((totalStockCurrent - totalStockInvested) / totalStockInvested) * 100
      : 0;

    const totalCommodityInvested = commodities.reduce((sum, c) => sum + (c.quantity * c.buyPrice), 0);
    const totalCommodityCurrent = commodities.reduce((sum, c) => sum + (c.quantity * c.marketPrice), 0);
    const commodityROI = totalCommodityInvested > 0
      ? ((totalCommodityCurrent - totalCommodityInvested) / totalCommodityInvested) * 100
      : 0;

    const totalBusinessValuation = businesses.reduce((sum, b) => sum + (b.valuation || 0), 0);
    const totalBusinessRevenue = businesses.reduce((sum, b) => sum + (b.revenue || 0), 0);
    const totalBusinessProfit = businesses.reduce((sum, b) => sum + (b.netProfit || 0), 0);

    const totalInvested = totalRealEstateInvested + totalStockInvested + totalCommodityInvested;
    const totalCurrent = totalRealEstateCurrent + totalStockCurrent + totalCommodityCurrent;
    const overallROI = totalInvested > 0
      ? ((totalCurrent - totalInvested) / totalInvested) * 100
      : 0;

    res.status(200).json({
      success: true,
      data: {
        counts, // Added counts
        totals: {
          realEstate: { invested: totalRealEstateInvested, current: totalRealEstateCurrent, roi: realEstateROI },
          stocks: { invested: totalStockInvested, current: totalStockCurrent, roi: stockROI },
          commodities: { invested: totalCommodityInvested, current: totalCommodityCurrent, roi: commodityROI },
          businesses: { valuation: totalBusinessValuation, revenue: totalBusinessRevenue, netProfit: totalBusinessProfit },
        },
        portfolio: { invested: totalInvested, current: totalCurrent, roi: overallROI },
        breakdown: [
          { category: "Real Estate", invested: totalRealEstateInvested, current: totalRealEstateCurrent, count: realEstates.length },
          { category: "Stocks", invested: totalStockInvested, current: totalStockCurrent, count: stocks.length },
          { category: "Commodities", invested: totalCommodityInvested, current: totalCommodityCurrent, count: commodities.length },
          { category: "Businesses", valuation: totalBusinessValuation, count: businesses.length },
        ],
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch dashboard data" });
  }
};
