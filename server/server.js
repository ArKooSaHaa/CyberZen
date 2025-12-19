import dotenv from 'dotenv';
import express from "express";
import cors from 'cors';
import mongoose from "mongoose";

import connectDb from "./DB/connect.js";
import { router } from "./routes/routes.js";


// Load environment variables
dotenv.config();

// Import and initialize Gemini service

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => { console.log(req.method, req.url); next(); });
app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api", router);


// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.setHeader('Content-Type', 'application/json');
  res.status(500).json({
    error: 'An unexpected error occurred',
    message: err.message
  });
});

const PORT = process.env.PORT || 5000;

// Start server even if DB connection fails (for testing)
const startServer = async () => {
  try {
    await connectDb();
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Failed:", err.message);
    console.log("Server will start without database connection");
  }
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
};

startServer();