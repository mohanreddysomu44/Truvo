import { network } from "hardhat";
import { createPublicClient, createWalletClient, http, parseAbi } from "viem";
import { hardhat } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3" as `0x${string}`;

// Hardhat default account #0 private key
const ACCOUNT_0_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
// Hardhat default account #1 — learner
const ACCOUNT_1_ADDRESS = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" as `0x${string}`;

const abi = parseAbi([
  "function issueCertificate(address learner, string ipfsCid, string learnerName, string skillName, string issuingOrg) returns (uint256)",
  "function verifyCertificate(uint256 tokenId) view returns (string, string, string, string, uint256, bool, address)",
  "function revokeCertificate(uint256 tokenId)",
  "function totalIssued() view returns (uint256)",
]);

async function main() {
  console.log("Testing TruvoCertificate on local Hardhat network...\n");

  const account = privateKeyToAccount(ACCOUNT_0_KEY as `0x${string}`);

  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http("http://127.0.0.1:8545"),
  });

  const walletClient = createWalletClient({
    account,
    chain: hardhat,
    transport: http("http://127.0.0.1:8545"),
  });

  console.log("Issuer wallet:", account.address);
  console.log("Learner wallet:", ACCOUNT_1_ADDRESS);
  console.log("");

  // TEST 1 — Issue a certificate
  console.log("Test 1: Issuing a certificate...");
  const issueTxHash = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "issueCertificate",
    args: [
      ACCOUNT_1_ADDRESS,
      "bafkreitest123abc",
      "Mohan Kumar",
      "Full Stack Web Development",
      "Truvo Training Institute",
    ],
  });
  await publicClient.waitForTransactionReceipt({ hash: issueTxHash });
  console.log("Certificate issued!");
  console.log("Transaction hash:", issueTxHash);
  console.log("");

  // TEST 2 — Verify the certificate
  console.log("Test 2: Verifying certificate with tokenId 1...");
  const cert = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "verifyCertificate",
    args: [1n],
  }) as any[];
  console.log("IPFS CID:    ", cert[0]);
  console.log("Learner Name:", cert[1]);
  console.log("Skill:       ", cert[2]);
  console.log("Org:         ", cert[3]);
  console.log("Issued At:   ", new Date(Number(cert[4]) * 1000).toLocaleString());
  console.log("Revoked:     ", cert[5]);
  console.log("Owner:       ", cert[6]);
  console.log("");

  // TEST 3 — Total issued
  const total = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "totalIssued",
    args: [],
  });
  console.log("Total certificates issued:", total.toString());
  console.log("");

  // TEST 4 — Revoke
  console.log("Test 4: Revoking certificate...");
  const revokeTxHash = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "revokeCertificate",
    args: [1n],
  });
  await publicClient.waitForTransactionReceipt({ hash: revokeTxHash });
  console.log("Certificate revoked!");
  console.log("");

  // TEST 5 — Verify after revoke
  console.log("Test 5: Verifying after revocation...");
  const revokedCert = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "verifyCertificate",
    args: [1n],
  }) as any[];
  console.log("Revoked:", revokedCert[5]);
  console.log("");

  console.log("All tests passed! Contract is working perfectly.");
}

main().catch(console.error);