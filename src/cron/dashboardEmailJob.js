import cron from "node-cron";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import User from "../modules/users/user.model.js";
import RealEstate from "../modules/realEstate/realEstate.model.js";
import Stock from "../modules/stocks/stock.model.js";
import { Commodity } from "../modules/commodities/commodity.model.js";
import { Business } from "../modules/businesses/business.model.js";

dotenv.config();

// Mail transporter (reuse Gmail creds)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper (same as before)...
const getUserDashboardSummary = async (userId) => {
  const [realEstates, stocks, commodities, businesses] = await Promise.all([
    RealEstate.find({ user: userId }),
    Stock.find({ user: userId }),
    Commodity.find({ user: userId }),
    Business.find({ user: userId }),
  ]);

  const totalRealEstateInvested = realEstates.reduce((sum, r) => sum + (r.investedValue || 0), 0);
  const totalRealEstateCurrent = realEstates.reduce((sum, r) => sum + (r.currentValue || 0), 0);
  const realEstateROI = totalRealEstateInvested > 0 ? ((totalRealEstateCurrent - totalRealEstateInvested) / totalRealEstateInvested) * 100 : 0;

  const totalStockInvested = stocks.reduce((sum, s) => sum + (s.quantity * s.buyPrice), 0);
  const totalStockCurrent = stocks.reduce((sum, s) => sum + (s.quantity * s.marketPrice), 0);
  const stockROI = totalStockInvested > 0 ? ((totalStockCurrent - totalStockInvested) / totalStockInvested) * 100 : 0;

  const totalCommodityInvested = commodities.reduce((sum, c) => sum + (c.quantity * c.buyPrice), 0);
  const totalCommodityCurrent = commodities.reduce((sum, c) => sum + (c.quantity * c.marketPrice), 0);
  const commodityROI = totalCommodityInvested > 0 ? ((totalCommodityCurrent - totalCommodityInvested) / totalCommodityInvested) * 100 : 0;

  const totalBusinessValuation = businesses.reduce((sum, b) => sum + (b.valuation || 0), 0);
  const totalBusinessRevenue = businesses.reduce((sum, b) => sum + (b.revenue || 0), 0);
  const totalBusinessProfit = businesses.reduce((sum, b) => sum + (b.netProfit || 0), 0);

  const totalInvested = totalRealEstateInvested + totalStockInvested + totalCommodityInvested;
  const totalCurrent = totalRealEstateCurrent + totalStockCurrent + totalCommodityCurrent;
  const overallROI = totalInvested > 0 ? ((totalCurrent - totalInvested) / totalInvested) * 100 : 0;

  return {
    portfolio: { invested: totalInvested, current: totalCurrent, roi: overallROI.toFixed(2) },
    realEstate: { invested: totalRealEstateInvested, current: totalRealEstateCurrent, roi: realEstateROI.toFixed(2) },
    stocks: { invested: totalStockInvested, current: totalStockCurrent, roi: stockROI.toFixed(2) },
    commodities: { invested: totalCommodityInvested, current: totalCommodityCurrent, roi: commodityROI.toFixed(2) },
    businesses: { valuation: totalBusinessValuation, revenue: totalBusinessRevenue, profit: totalBusinessProfit },
  };
};


export const startDashboardEmailJob = () => {
  cron.schedule("0 9 1,15 *", async () => { 
    console.log("📧 Running dashboard email job...");

    try {
      const users = await User.find({}, "email _id name");

      for (const user of users) {
        const summary = await getUserDashboardSummary(user._id);

        const emailHtml = `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 12px; background: #ffffff;">
            
            <!-- Header -->
            <div style="background: #2E86DE; color: white; padding: 15px; border-radius: 10px 10px 0 0; text-align: center;">
              <h2 style="margin: 0; font-size: 22px;">📊 Portfolio Summary</h2>
            </div>

            <!-- Greeting -->
            <div style="padding: 15px;">
              <p style="font-size: 16px; color: #333;">Hello <b>${user.name || "Investor"}</b>,</p>
              <p style="font-size: 14px; color: #555;">Here’s your latest investment summary:</p>
            </div>

            <!-- Table -->
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <thead>
                  <tr style="background: #f4f6f9; color: #2E86DE; text-align: left;">
                    <th style="padding: 10px; border-bottom: 1px solid #ddd;">Category</th>
                    <th style="padding: 10px; border-bottom: 1px solid #ddd;">Invested</th>
                    <th style="padding: 10px; border-bottom: 1px solid #ddd;">Current</th>
                    <th style="padding: 10px; border-bottom: 1px solid #ddd;">ROI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">Real Estate</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">${summary.realEstate.invested}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">${summary.realEstate.current}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; color: ${summary.realEstate.roi >= 0 ? "green" : "red"};">
                      ${summary.realEstate.roi}%
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">Stocks</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">${summary.stocks.invested}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">${summary.stocks.current}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; color: ${summary.stocks.roi >= 0 ? "green" : "red"};">
                      ${summary.stocks.roi}%
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">Commodities</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">${summary.commodities.invested}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">${summary.commodities.current}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; color: ${summary.commodities.roi >= 0 ? "green" : "red"};">
                      ${summary.commodities.roi}%
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">Businesses</td>
                    <td colspan="3" style="padding: 8px; border-bottom: 1px solid #eee;">
                      Valuation: <b>${summary.businesses.valuation}</b> | Revenue: <b>${summary.businesses.revenue}</b> | Profit: <b>${summary.businesses.profit}</b>
                    </td>
                  </tr>
                  <tr style="font-weight: bold; background: #f9fafc;">
                    <td style="padding: 10px;">TOTAL</td>
                    <td style="padding: 10px;">${summary.portfolio.invested}</td>
                    <td style="padding: 10px;">${summary.portfolio.current}</td>
                    <td style="padding: 10px; color: ${summary.portfolio.roi >= 0 ? "green" : "red"};">${summary.portfolio.roi}%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Footer -->
            <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #888;">
              <p style="margin: 0;">Keep tracking your investments 🚀</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;" />
              <p>© ${new Date().getFullYear()} Shree Rimake Holdings. All rights reserved.</p>
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: `"Shree Rimake Holdings" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: "📊 Your 15-Day Investment Summary",
          html: emailHtml,
        });

        console.log(`✅ Dashboard email sent to ${user.email}`);
      }
    } catch (err) {
      console.error("❌ Error in dashboard cron job:", err);
    }
  });
};
