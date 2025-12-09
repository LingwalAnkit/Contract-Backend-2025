import { contract, collegeAddress } from "../blockchain.js";

export const healthCheck = async (req, res) => {
  try {
    const totalCertificates = await contract.getTotalCertificates();

    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      contractAddress: contract.target,
      collegeAddress: collegeAddress,
      totalCertificates: totalCertificates.toString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      error: error.message,
    });
  }
};

export const getApiInfo = (req, res) => {
  res.json({
    message: "Certificate Verification API",
    version: "1.0.0",
    endpoints: {
      "POST /issue-certificate": {
        description: "Issue a new certificate on the blockchain",
        body: {
          studentIdentifier: "string (required) - Student roll number or ID",
          certificateHash:
            "string (required) - Hex bytes32 hash of the certificate",
          metadataURI:
            "string (required) - URL or IPFS CID to certificate metadata/PDF",
        },
        response: {
          success: "boolean",
          txHash: "string - Transaction hash",
          certificateId: "string - ID of the issued certificate",
          eventData: "object - Event data from the blockchain",
        },
      },
      "GET /verify-certificate": {
        description: "Verify a certificate by ID or hash",
        query: {
          certificateId: "integer (optional) - Certificate ID to verify",
          certificateHash:
            "string (optional) - Certificate hash to check existence",
        },
        response: {
          exists: "boolean",
          isValid: "boolean",
          revoked: "boolean",
          certificateId: "string",
          studentIdentifier: "string",
          certificateHash: "string",
          metadataURI: "string",
          issuedAt: "string (timestamp)",
          issuerAddress: "string",
        },
      },
      "POST /revoke-certificate": {
        description: "Revoke an existing certificate",
        body: {
          certificateId: "integer (required) - Certificate ID to revoke",
        },
        response: {
          success: "boolean",
          txHash: "string - Transaction hash",
          message: "string",
        },
      },
      "GET /health": {
        description: "Health check endpoint",
        response: {
          status: "string",
          contractAddress: "string",
          totalCertificates: "string",
        },
      },
    },
  });
};
