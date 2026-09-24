import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDatabase } from "./config/database";
import authRoutes from "./routes/auth.routes";
import kitRoutes from "./routes/kit.routes";
import assistantRoutes from "./routes/assistant.routes";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/kits", kitRoutes);
app.use("/api/assistant", assistantRoutes);

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "AI Interview Prep Kit API is running",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();