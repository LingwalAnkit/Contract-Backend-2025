import express from "express";
import certificateRoutes from "./certificate.routes.js";
import { healthCheck, getApiInfo } from "../controllers/health.controller.js";

const router = express.Router();

// API Info
router.get("/", getApiInfo);

// Health check
router.get("/health", healthCheck);

// Certificate routes
router.use("/", certificateRoutes);

export default router;
