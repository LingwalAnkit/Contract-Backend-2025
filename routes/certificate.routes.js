import express from "express";
import {
  issueCertificate,
  verifyCertificate,
  revokeCertificate,
} from "../controllers/certificate.controller.js";
import {
  validateIssueCertificate,
  validateVerifyCertificate,
  validateRevokeCertificate,
} from "../middleware/validator.middleware.js";

const router = express.Router();

// Issue certificate
router.post("/issue-certificate", validateIssueCertificate, issueCertificate);

// Verify certificate
router.get("/verify-certificate", validateVerifyCertificate, verifyCertificate);

// Revoke certificate
router.post(
  "/revoke-certificate",
  validateRevokeCertificate,
  revokeCertificate
);

export default router;
