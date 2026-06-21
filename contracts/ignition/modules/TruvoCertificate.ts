import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TruvoCertificateModule = buildModule("TruvoCertificateModule", (m) => {
  const truvoCertificate = m.contract("TruvoCertificate", []);
  return { truvoCertificate };
});

export default TruvoCertificateModule;
