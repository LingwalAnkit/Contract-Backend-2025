export const validateIssueCertificate = (req, res, next) => {
  const { studentIdentifier, certificateHash, metadataURI } = req.body;

  // Validate studentIdentifier
  if (
    !studentIdentifier ||
    typeof studentIdentifier !== "string" ||
    studentIdentifier.trim() === ""
  ) {
    return res.status(400).json({
      success: false,
      error: "studentIdentifier is required and must be a non-empty string",
    });
  }

  // Validate certificateHash
  if (!certificateHash || typeof certificateHash !== "string") {
    return res.status(400).json({
      success: false,
      error:
        "certificateHash is required and must be a valid hex string (bytes32)",
    });
  }

  // Format and validate certificateHash
  try {
    const hashToFormat = certificateHash.startsWith("0x")
      ? certificateHash
      : `0x${certificateHash}`;

    if (hashToFormat.length !== 66) {
      throw new Error("Hash must be 32 bytes (64 hex characters)");
    }

    req.body.formattedHash = hashToFormat;
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: `Invalid certificateHash format: ${error.message}`,
    });
  }

  // Validate metadataURI
  if (
    !metadataURI ||
    typeof metadataURI !== "string" ||
    metadataURI.trim() === ""
  ) {
    return res.status(400).json({
      success: false,
      error:
        "metadataURI is required and must be a non-empty string (URL or IPFS CID)",
    });
  }

  next();
};

export const validateRevokeCertificate = (req, res, next) => {
  const { certificateId } = req.body;

  if (!certificateId || isNaN(parseInt(certificateId))) {
    return res.status(400).json({
      success: false,
      error: "certificateId is required and must be a valid integer",
    });
  }

  req.body.certificateId = parseInt(certificateId);
  next();
};

export const validateVerifyCertificate = (req, res, next) => {
  const { certificateId, certificateHash } = req.query;

  if (!certificateId && !certificateHash) {
    return res.status(400).json({
      success: false,
      error:
        "Either certificateId or certificateHash query parameter is required",
    });
  }

  if (certificateId) {
    const id = parseInt(certificateId);
    if (isNaN(id) || id < 0) {
      return res.status(400).json({
        success: false,
        error: "certificateId must be a valid non-negative integer",
      });
    }
    req.query.certificateId = id;
  }

  if (certificateHash) {
    try {
      const formattedHash = certificateHash.startsWith("0x")
        ? certificateHash
        : `0x${certificateHash}`;

      if (formattedHash.length !== 66) {
        throw new Error("Hash must be 32 bytes (64 hex characters)");
      }

      req.query.formattedHash = formattedHash;
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: `Invalid certificateHash format: ${error.message}`,
      });
    }
  }

  next();
};
