export const parseContractError = (error) => {
  const errorMessage = error.message;

  if (errorMessage.includes("InvalidStudentIdentifier")) {
    return "Invalid student identifier provided";
  } else if (errorMessage.includes("InvalidCertificateHash")) {
    return "Invalid certificate hash provided";
  } else if (errorMessage.includes("InvalidMetadataURI")) {
    return "Invalid metadata URI provided";
  } else if (errorMessage.includes("CertificateHashAlreadyExists")) {
    return "A certificate with this hash already exists";
  } else if (errorMessage.includes("CertificateDoesNotExist")) {
    return "Certificate does not exist";
  } else if (errorMessage.includes("CertificateAlreadyRevoked")) {
    return "Certificate is already revoked";
  } else if (errorMessage.includes("OnlyCollegeAllowed")) {
    return "Only the college wallet can perform this action";
  }

  return errorMessage;
};
