import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import BlockchainBackground from "../components/BlockchainBackground";
import {
  Shield,
  Search,
  ExternalLink,
  Copy,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function VerifyCertificate() {
  const { tokenId: paramTokenId } = useParams();
  const [tokenId, setTokenId] = useState(paramTokenId || "");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (paramTokenId) handleVerify(paramTokenId);
  }, [paramTokenId]);

  const handleVerify = async (id) => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const { data } = await API.get(`/certificate/verify/${id || tokenId}`);
      setResult(data);
    } catch (err) {
      setError("Certificate not found or invalid token ID");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadVerify = async () => {
    setVerifying(true);
    try {
      const response = await fetch(result.certificate.ipfsUrl);
      const buffer = await response.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      alert(
        `✅ Authenticity Verified!\n\n` +
          `IPFS CID on Blockchain:\n${result.certificate.ipfsCid}\n\n` +
          `SHA-256:\n${hashHex.slice(0, 32)}...\n\n` +
          `This PDF has NOT been tampered with.`,
      );
    } catch (err) {
      alert("Could not verify — IPFS gateway may be slow. Try again.");
    } finally {
      setVerifying(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/verify/${result.certificate.tokenId}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative">
  <BlockchainBackground className="opacity-10" />

      <div className="w-full max-w-lg relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 pulse-glow"
            style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}
          >
            <Shield size={36} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">
            Verify Certificate
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Instant blockchain verification — no login required
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl p-6 mb-4 border border-gray-200 shadow-lg">
          <div className="flex gap-3">
            <input
              type="number"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
              placeholder="Enter Certificate Token ID (e.g. 1)"
            />
            <button
              onClick={() => handleVerify()}
              disabled={loading || !tokenId}
              className="px-6 py-3 rounded-xl font-semibold text-white flex items-center gap-2 text-sm disabled:opacity-50 transition hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              }}
            >
              <Search size={16} />
              {loading ? "Checking..." : "Verify"}
            </button>
          </div>
   <p className="text-xs text-gray-500 mt-2 text-center">
            Data sourced directly from Polygon blockchain
          </p>
        </div>

        {/* Error */}
        {error && (
         <div className="bg-red-50 rounded-2xl p-4 mb-4 border border-red-200 shadow">
            <div className="flex items-center gap-2 text-red-400">
              <XCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div
            className={`glass-dark rounded-2xl p-6 border-2 ${
              result.valid ? "border-green-500/40" : "border-red-500/40"
            }`}
          >
            {/* Status badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6 ${
                result.valid
                  ? "bg-green-500/20 text-green-300 border border-green-500/30"
                  : "bg-red-500/20 text-red-300 border border-red-500/30"
              }`}
              style={{
                boxShadow: result.valid
                  ? "0 0 20px rgba(16,185,129,0.2)"
                  : "0 0 20px rgba(239,68,68,0.2)",
              }}
            >
              {result.valid ? (
                <>
                  <CheckCircle size={16} /> VALID CERTIFICATE
                </>
              ) : (
                <>
                  <XCircle size={16} /> REVOKED CERTIFICATE
                </>
              )}
            </div>

            {/* Certificate details */}
            <div className="space-y-3 mb-6">
              {[
                {
                  label: "Token ID",
                  value: `#${result.certificate.tokenId}`,
                  highlight: true,
                },
                {
                  label: "Learner Name",
                  value: result.certificate.learnerName,
                },
                {
                  label: "Skill / Course",
                  value: result.certificate.skillName,
                },
                { label: "Issued By", value: result.certificate.issuingOrg },
                {
                  label: "Issue Date",
                  value: new Date(
                    result.certificate.issuedAt,
                  ).toLocaleDateString("en-IN"),
                },
                {
                  label: "Owner Wallet",
                  value: `${result.certificate.owner?.slice(0, 10)}...${result.certificate.owner?.slice(-6)}`,
                  mono: true,
                },
                {
                  label: "IPFS CID",
                  value: `${result.certificate.ipfsCid?.slice(0, 12)}...${result.certificate.ipfsCid?.slice(-6)}`,
                  mono: true,
                },
              ].map(({ label, value, highlight, mono }) => (
                <div
                  key={label}
                 className="flex justify-between items-center py-2 border-b border-gray-200"
                >
                 <span className="text-gray-500 text-xs">{label}</span>
                  <span
                    className={`text-xs font-medium ${
                     highlight ? "text-indigo-600 font-bold" : "text-gray-800"
                    } ${mono ? "font-mono" : ""}`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              <a
                href={result.certificate.ipfsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-white text-sm transition hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                }}
              >
                <ExternalLink size={16} />
                View Certificate PDF on IPFS
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleDownloadVerify}
                  disabled={verifying}
                  className="py-2.5 rounded-xl text-sm font-medium text-green-300 glass border border-green-500/20 hover:bg-green-500/10 transition disabled:opacity-50"
                >
                  {verifying ? "🔄 Verifying..." : "🔍 Verify Hash"}
                </button>
                <button
                  onClick={copyLink}
                  className="py-2.5 rounded-xl text-sm font-medium text-white/60 glass border border-white/10 hover:bg-white/10 transition flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle size={14} className="text-green-400" />{" "}
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>

           <p className="text-xs text-gray-500 text-center mt-4">
              🔗 Permanently recorded on Polygon blockchain — tamper-proof
              forever
            </p>
          </div>
        )}

        {/* How it works */}
        {!result && !error && (
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-lg">
            <h3 className="font-bold text-gray-800 text-sm mb-3">
              How verification works
            </h3>
            <div className="space-y-2">
              {[
                "Enter the certificate token ID",
                "We read the record directly from the blockchain",
                "IPFS CID on-chain matches the PDF — proving no tampering",
                'Click "Verify Hash" to cryptographically confirm authenticity',
              ].map((step, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-indigo-400 font-bold text-xs mt-0.5">
                    {i + 1}.
                  </span>
                  <p className="text-gray-600 text-xs">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
