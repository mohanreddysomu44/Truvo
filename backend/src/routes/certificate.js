import express from "express";
import axios from "axios";
import Certificate from "../models/Certificate.js";
import { generateCertificatePDF } from "../services/pdfService.js";
import { uploadToIPFS, getIPFSUrl } from "../services/ipfsService.js";
import {
  mintCertificate,
  verifyCertificateOnChain,
  revokeCertificateOnChain,
} from "../services/blockchainService.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

// POST /api/certificate/issue
router.post(
  "/issue",
  protect,
  restrictTo("issuer", "admin"),
  async (req, res) => {
    try {
      const {
        learnerName,
        learnerEmail,
        learnerWallet,
        skillName,
        issuingOrg,
      } = req.body;

      if (!learnerName || !learnerEmail || !learnerWallet || !skillName) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const org = issuingOrg || req.user.organisation || "Truvo Institute";

      // Step 1 — Generate PDF
      const pdfBuffer = await generateCertificatePDF({
        learnerName,
        skillName,
        issuingOrg: org,
        issuedDate: new Date().toLocaleDateString("en-IN"),
        tokenId: "pending",
      });

      // Step 2 — Upload to IPFS
      const ipfsCid = await uploadToIPFS(
        pdfBuffer,
        `${learnerName.replace(/\s/g, "_")}_certificate.pdf`,
      );

      // Step 3 — Mint on blockchain
      const { tokenId, txHash } = await mintCertificate({
        learnerWallet,
        ipfsCid,
        learnerName,
        skillName,
        issuingOrg: org,
      });

      // Step 4 — Save to MongoDB
      const certificate = await Certificate.create({
        tokenId,
        ipfsCid,
        txHash,
        learnerName,
        learnerEmail,
        learnerWallet,
        skillName,
        issuingOrg: org,
        status: "issued",
      });

      // Step 5 — Notify n8n
      try {
        await axios.post(process.env.N8N_WEBHOOK_URL, {
          event: "certificate_issued",
          learnerName,
          learnerEmail,
          skillName,
          tokenId,
          ipfsUrl: getIPFSUrl(ipfsCid),
          txHash,
        });
      } catch (e) {
        console.log("n8n skipped:", e.message);
      }

      return res.status(201).json({
        success: true,
        certificate: {
          tokenId,
          ipfsCid,
          ipfsUrl: getIPFSUrl(ipfsCid),
          txHash,
          learnerName,
          skillName,
          status: "issued",
        },
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

// GET /api/certificate/verify/:tokenId
router.get("/verify/:tokenId", async (req, res) => {
  try {
    const tokenId = parseInt(req.params.tokenId);
    const chainData = await verifyCertificateOnChain(tokenId);
    const dbData = await Certificate.findOne({ tokenId });

    return res.json({
      success: true,
      valid: !chainData.revoked,
      certificate: {
        tokenId,
        ...chainData,
        ipfsUrl: getIPFSUrl(chainData.ipfsCid),
        learnerEmail: dbData?.learnerEmail || "",
      },
    });
  } catch (error) {
    return res.status(404).json({ error: "Certificate not found" });
  }
});

// GET /api/certificate/learner/:wallet
router.get("/learner/:wallet", async (req, res) => {
  try {
    const certificates = await Certificate.find({
      learnerWallet: req.params.wallet,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: certificates.length,
      certificates,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/certificate/revoke/:tokenId
router.post(
  "/revoke/:tokenId",
  protect,
  restrictTo("issuer", "admin"),
  async (req, res) => {
    try {
      const tokenId = parseInt(req.params.tokenId);
      const { txHash } = await revokeCertificateOnChain(tokenId);
      await Certificate.findOneAndUpdate({ tokenId }, { status: "revoked" });

      return res.json({
        success: true,
        message: `Certificate #${tokenId} revoked`,
        txHash,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

// GET /api/certificate/all
router.get("/all", protect, restrictTo("admin"), async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .sort({ createdAt: -1 })
      .limit(100);
    return res.json({
      success: true,
      count: certificates.length,
      certificates,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
