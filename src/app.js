import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import { errorMiddleware } from "./middlewares/error.middleware.js";


// Import all routes
import userRoutes from "./modules/users/user.routes.js";
import stockRoutes from "./modules/stocks/stock.routes.js";
import realEstateRoutes from "./modules/realEstate/realEstate.routes.js";
import commodityRoutes from "./modules/commodities/commodity.routes.js";
import businessRoutes from "./modules/businesses/business.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";

const app = express();

// --------- Global Middlewares ---------
app.use(helmet()); // security headers
app.use(cors()); // allow cross-origin requests
app.use(express.json()); // parse JSON body
app.use(express.urlencoded({ extended: true })); // parse URL-encoded data

// Logging (skip in test mode)
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// --------- API Versioning ---------
const API_PREFIX = "/api/v1";

app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/stocks`, stockRoutes);
app.use(`${API_PREFIX}/real-estate`, realEstateRoutes);
app.use(`${API_PREFIX}/commodities`, commodityRoutes);
app.use(`${API_PREFIX}/businesses`, businessRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);

// --------- Health Check ---------
app.get(`${API_PREFIX}/health`, (req, res) => {
  res.json({ status: "ok", message: "API is running 🚀" });
});

// --------- 404 Handler ---------
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// --------- Error Middleware ---------
app.use(errorMiddleware);

export default app;
