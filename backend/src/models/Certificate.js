import mongoose from "mongoose";

// This defines the structure of every certificate
// stored in MongoDB
const certificateSchema = new mongoose.Schema(
  {
    // The token ID from the blockchain (1, 2, 3...)
    tokenId: {
      type: Number,
      required: true,
      unique: true,
    },

    // The IPFS CID of the certificate PDF
    // This links MongoDB record to the blockchain record
    ipfsCid: {
      type: String,
      required: true,
    },

    // The blockchain transaction hash
    // Proof the certificate was minted on blockchain
    txHash: {
      type: String,
      default: "",
    },

    // Learner details
    learnerName: {
      type: String,
      required: true,
    },

    learnerEmail: {
      type: String,
      required: true,
    },

    learnerWallet: {
      type: String,
      required: true,
    },

    // Certificate details
    skillName: {
      type: String,
      required: true,
    },

    issuingOrg: {
      type: String,
      required: true,
    },

    // Certificate status
    // pending = being processed
    // issued = successfully on blockchain
    // revoked = revoked by issuer
    status: {
      type: String,
      enum: ["pending", "issued", "revoked"],
      default: "pending",
    },

    // When it was issued (from blockchain timestamp)
    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  },
);

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;
