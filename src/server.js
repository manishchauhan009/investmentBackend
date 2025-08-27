// server/src/server.js
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start the server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on https://investmentbackend-cmqd.onrender.com:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
