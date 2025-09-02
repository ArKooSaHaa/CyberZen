import express from "express";
import cors from 'cors';
import mongoose from "mongoose";
import dotenv from 'dotenv';

import connectDb from "./DB/connect.js";
import { router } from "./routes/routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => { console.log(req.method, req.url); next(); });
app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/User", router);

const PORT = process.env.PORT || 3001;

// Start server even if DB connection fails (for testing)
const startServer = async () => {
  try {
    await connectDb();
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    console.log("⚠️  Server will start without database connection");
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
  });
};

startServer();