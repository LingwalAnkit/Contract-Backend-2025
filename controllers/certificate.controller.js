import { contract, collegeAddress } from "../blockchain.js";
import { formatCertificateData, parseEventData } from "../utils/formatters.js";
import { parseContractError } from "../utils/errorMessages.js";

export const issueCertificate = async (req, res) => {
  try {
    const { studentIdentifier, formattedHash, metadataURI } = req.body;

    console.log("📝 Issuing certificate...");
    console.log("   Student:", studentIdentifier);
    console.log("   Hash:", formattedHash);
    console.log("   Metadata:", metadataURI);

    // Call smart contract function
    const tx = await contract.issueCertificate(
      studentIdentifier,
      formattedHash,
      metadataURI
    );

    console.log("⏳ Transaction sent:", tx.hash);
    console.log("   Waiting for confirmation...");

    // Wait for transaction to be mined
    const receipt = await tx.wait();

    console.log("✅ Transaction confirmed in block:", receipt.blockNumber);

    // Parse the CertificateIssued event
    const { certificateId, eventData } = parseEventData(contract, receipt);

    if (certificateId) {
      console.log("📜 Certificate ID:", certificateId);
    }

    // Return success response
    return res.status(200).json({
      success: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      certificateId: certificateId,
      eventData: eventData,
      gasUsed: receipt.gasUsed.toString(),
      issuer: collegeAddress,
    });
  } catch (error) {
    console.error("❌ Error issuing certificate:", error);

    const errorMessage = parseContractError(error);

    return res.status(500).json({
      success: false,
      error: errorMessage,
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.query;

    console.log("🔍 Verifying certificate...");
    console.log("   Certificate ID:", certificateId);

    // First check if certificate exists
    const exists = await contract.doesCertificateExist(certificateId);

    if (!exists) {
      return res.status(404).json({
        success: false,
        error: "Certificate not found",
      });
    }

    // Call smart contract function to get certificate details
    const certificate = await contract.getCertificate(certificateId);

    console.log("✅ Certificate retrieved");

    // Format certificate data
    const formattedData = formatCertificateData(certificate);

    return res.status(200).json({
      success: true,
      certificate: formattedData,
    });
  } catch (error) {
    console.error("❌ Error verifying certificate:", error);

    const errorMessage = parseContractError(error);

    return res.status(500).json({
      success: false,
      error: errorMessage,
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const revokeCertificate = async (req, res) => {
  try {
    const { certificateId } = req.body;

    console.log("🚫 Revoking certificate...");
    console.log("   Certificate ID:", certificateId);

    // Call smart contract function (no reason parameter in contract)
    const tx = await contract.revokeCertificate(certificateId);

    console.log("⏳ Transaction sent:", tx.hash);
    console.log("   Waiting for confirmation...");

    // Wait for transaction to be mined
    const receipt = await tx.wait();

    console.log("✅ Transaction confirmed in block:", receipt.blockNumber);

    // Parse the CertificateRevoked event
    const { eventData } = parseEventData(contract, receipt);

    return res.status(200).json({
      success: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      eventData: eventData,
      gasUsed: receipt.gasUsed.toString(),
    });
  } catch (error) {
    console.error("❌ Error revoking certificate:", error);

    const errorMessage = parseContractError(error);

    return res.status(500).json({
      success: false,
      error: errorMessage,
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
