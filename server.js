import express from "express";
import cors from "cors";
import { config } from "./config/env.config.js";
import { corsOptions, corsDevOptions } from "./config/cors.config.js";
import { requestLogger } from "./middleware/logger.middleware.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import routes from "./routes/index.routes.js";
import { contract, collegeAddress } from "./blockchain.js";

const app = express();

app.use(cors(config.isDevelopment ? corsDevOptions : corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use(requestLogger);

app.use("/", routes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log("");
  console.log("═══════════════════════════════════════════════════════");
  console.log("🚀 Certificate Backend API Server");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`📡 Server running on: http://localhost:${config.port}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`📝 Contract Address: ${contract.target}`);
  console.log(`🏛️  College Address: ${collegeAddress}`);
  console.log("═══════════════════════════════════════════════════════");
  console.log("");
  console.log("Available endpoints:");
  console.log(`  POST   http://localhost:${config.port}/issue-certificate`);
  console.log(
    `  GET    http://localhost:${config.port}/verify-certificate?certificateId=<id>`
  );
  console.log(`  POST   http://localhost:${config.port}/revoke-certificate`);
  console.log(`  GET    http://localhost:${config.port}/health`);
  console.log("");
});

export default app;
