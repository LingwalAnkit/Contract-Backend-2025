export const formatCertificateData = (certificate) => {
  return {
    certificateId: certificate.certificateId.toString(),
    studentIdentifier: certificate.studentIdentifier,
    certificateHash: certificate.certificateHash,
    metadataURI: certificate.metadataURI,
    issuedAt: certificate.issuedAt.toString(),
    issuedAtDate: new Date(Number(certificate.issuedAt) * 1000).toISOString(),
    revoked: certificate.revoked,
  };
};

export const parseEventData = (contract, receipt) => {
  try {
    const event = receipt.logs.find((log) => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed && parsed.name === "CertificateIssued";
      } catch {
        return false;
      }
    });

    if (event) {
      const parsedEvent = contract.interface.parseLog(event);
      const certificateId = parsedEvent.args.certificateId.toString();

      return {
        certificateId,
        eventData: {
          certificateId: certificateId,
          studentIdentifier: parsedEvent.args.studentIdentifier,
          certificateHash: parsedEvent.args.certificateHash,
          metadataURI: parsedEvent.args.metadataURI,
          issuedAt: parsedEvent.args.issuedAt.toString(),
        },
      };
    }
  } catch (error) {
    console.warn("⚠️  Could not parse event data:", error.message);
  }

  return { certificateId: null, eventData: null };
};
