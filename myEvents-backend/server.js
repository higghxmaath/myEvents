import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import rsvpRoutes from "./routes/rsvpRoutes.js";
import path from "path";

const app = express();

// allow frontend origin (adjust if you deploy)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// expose uploads folder for local file serving
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/rsvps", rsvpRoutes);

// connect db and start
connectDB();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
