import "dotenv/config";
import { ethers } from "ethers";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const contractJSON = JSON.parse(
  readFileSync(
    join(__dirname, "../../../shared/TruvoCertificate.json"),
    "utf8",
  ),
);

const addressJSON = JSON.parse(
  readFileSync(join(__dirname, "../../../shared/contractAddress.json"), "utf8"),
);

const provider = new ethers.JsonRpcProvider(
  process.env.BLOCKCHAIN_RPC || "http://127.0.0.1:8545",
);

const wallet = new ethers.Wallet(
  process.env.ISSUER_PRIVATE_KEY ||
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  provider,
);

const contract = new ethers.Contract(
  addressJSON.localhost,
  contractJSON.abi,
  wallet,
);

export const mintCertificate = async ({
  learnerWallet,
  ipfsCid,
  learnerName,
  skillName,
  issuingOrg,
}) => {
  const tx = await contract.issueCertificate(
    learnerWallet,
    ipfsCid,
    learnerName,
    skillName,
    issuingOrg,
  );
  const receipt = await tx.wait();
  const tokenId = await contract.totalIssued();
  return {
    tokenId: Number(tokenId),
    txHash: receipt.hash,
  };
};

export const verifyCertificateOnChain = async (tokenId) => {
  const cert = await contract.verifyCertificate(tokenId);
  return {
    ipfsCid: cert[0],
    learnerName: cert[1],
    skillName: cert[2],
    issuingOrg: cert[3],
    issuedAt: new Date(Number(cert[4]) * 1000),
    revoked: cert[5],
    owner: cert[6],
  };
};

export const revokeCertificateOnChain = async (tokenId) => {
  const tx = await contract.revokeCertificate(tokenId);
  const receipt = await tx.wait();
  return { txHash: receipt.hash };
};
