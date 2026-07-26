// import 'dotenv/config';
// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import connectDB from './config/db.js';
// import authRoutes from './routes/auth.js';
// import certificateRoutes from './routes/certificate.js';

// const app = express();

// app.use(helmet());
// app.use(cors());
// app.use(express.json());

// connectDB();

// app.get('/health', (req, res) => {
//   res.json({ status: 'ok', project: 'Truvo', day: 4 });
// });

// app.use('/api/auth', authRoutes);
// app.use('/api/certificate', certificateRoutes);

// app.use((err, req, res, next) => {
//   console.error('Error:', err.message);
//   res.status(err.status || 500).json({
//     error: err.message || 'Internal server error'
//   });
// });

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`Truvo backend running on port ${PORT}`);
// });

import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import certificateRoutes from "./routes/certificate.js";

const app = express();

// ── Security headers ────────────────────────────────────
app.use(helmet());


app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL, // production frontend
      "http://localhost:5173", // local dev (Vite)
      "http://localhost:3000", // local dev (CRA)
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Explicitly handle OPTIONS requests
app.options("*", cors());

// ── Body parser ─────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));

// ── Rate limiting ───────────────────────────────────────
// General rate limit — 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limit for auth — 10 attempts per 15 minutes
// Prevents brute force attacks on login
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts, please try again in 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Certificate issuance — 20 per hour (prevents spam)
const issueLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: {
    error: "Certificate issuance limit reached, please try again in 1 hour",
  },
});

app.use(generalLimiter);

// ── Database ─────────────────────────────────────────────
connectDB();

// ── Routes ───────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    project: "Truvo",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Apply strict rate limit to auth routes
app.use("/api/auth", authLimiter, authRoutes);

// Apply issue rate limit to certificate routes
app.use("/api/certificate", certificateRoutes);

// ── 404 handler ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── Global error handler ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Truvo backend running on port ${PORT}`);
});
