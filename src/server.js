// server/src/server.js
import app from "./app.js";
import connectDB from "./config/db.js";
import "./config/env.js";  // load env FIRST
import { startDashboardEmailJob } from "./cron/dashboardEmailJob.js";

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start the server
startDashboardEmailJob();
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on PORT No ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
