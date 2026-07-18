import { useState } from "react";
import API from "../utils/api";
import toast from "react-hot-toast";
import {
  XCircle,
  AlertTriangle,
  Search,
} from "lucide-react";

export default function RevokeCertificate() {
  const [tokenId, setTokenId] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [revoked, setRevoked] = useState(false);

  const handleSearch = async () => {
    if (!tokenId) return;

    setLoading(true);
    setCertificate(null);

    try {
      const { data } = await API.get(`/certificate/verify/${tokenId}`);
      setCertificate(data);
    } catch (error) {
      toast.error("Certificate not found");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (
      !window.confirm(
        `Are you sure you want to revoke Certificate #${tokenId}? This action is permanent and cannot be undone.`,
      )
    )
      return;

    setRevoking(true);

    try {
      await API.post(`/certificate/revoke/${tokenId}`);
      setRevoked(true);
      toast.success(`Certificate #${tokenId} revoked successfully`);
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to revoke certificate"
      );
    } finally {
      setRevoking(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Revoke Certificate
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Permanently invalidate a certificate on the blockchain
        </p>
      </div>

      {/* Warning */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle
            size={20}
            className="text-red-600 mt-0.5 flex-shrink-0"
          />
          <div>
            <p className="text-red-700 font-semibold">
              Warning — Irreversible Action
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Revoking a certificate permanently marks it as invalid on the
              blockchain. This action cannot be undone. The NFT remains in the
              learner's wallet but will always appear as revoked.
            </p>
          </div>
        </div>
      </div>

      {/* Search Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Certificate Token ID
        </label>

        <div className="flex gap-3">
          <input
            type="number"
            value={tokenId}
            onChange={(e) => {
              setTokenId(e.target.value);
              setCertificate(null);
              setRevoked(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Enter token ID (e.g. 1)"
            className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
          />

          <button
            onClick={handleSearch}
            disabled={loading || !tokenId}
            className="px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 disabled:opacity-50 transition hover:opacity-90"
            style={{
              background: "linear-gradient(135deg,#3b82f6,#2563eb)",
            }}
          >
            <Search size={16} />
            {loading ? "Searching..." : "Find"}
          </button>
        </div>
      </div>

      {/* Certificate Details */}
      {certificate && !revoked && (
        <div
          className={`bg-white rounded-2xl shadow-lg border p-6 ${
            certificate.valid
              ? "border-yellow-300"
              : "border-red-300"
          }`}
        >
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-lg text-gray-900">
              Certificate Found
            </h3>

            <span
              className={`text-xs px-3 py-1 rounded-full font-semibold ${
                certificate.valid
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {certificate.valid
                ? "✅ Currently Valid"
                : "❌ Already Revoked"}
            </span>
          </div>

          <div className="space-y-3 mb-6">
            {[
              {
                label: "Token ID",
                value: `#${certificate.certificate.tokenId}`,
              },
              {
                label: "Learner",
                value: certificate.certificate.learnerName,
              },
              {
                label: "Skill",
                value: certificate.certificate.skillName,
              },
              {
                label: "Issued By",
                value: certificate.certificate.issuingOrg,
              },
              {
                label: "Issue Date",
                value: new Date(
                  certificate.certificate.issuedAt
                ).toLocaleDateString("en-IN"),
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex justify-between border-b border-gray-200 pb-2"
              >
                <span className="text-gray-500 text-sm">{label}</span>
                <span className="text-gray-900 font-medium text-sm">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {certificate.valid ? (
            <button
              onClick={handleRevoke}
              disabled={revoking}
              className="w-full py-3 rounded-xl text-white font-semibold flex justify-center items-center gap-2 hover:opacity-90 disabled:opacity-50 transition"
              style={{
                background:
                  "linear-gradient(135deg,#ef4444,#dc2626)",
              }}
            >
              {revoking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Revoking on blockchain...
                </>
              ) : (
                <>
                  <XCircle size={18} />
                  Revoke Certificate #{tokenId}
                </>
              )}
            </button>
          ) : (
            <div className="bg-gray-100 rounded-xl py-3 text-center text-gray-600">
              This certificate is already revoked.
            </div>
          )}
        </div>
      )}

      {/* Success */}
      {revoked && (
        <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{
              background:
                "linear-gradient(135deg,#ef4444,#dc2626)",
            }}
          >
            <XCircle size={30} className="text-white" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Certificate Revoked
          </h2>

          <p className="text-gray-600 mb-6">
            Certificate #{tokenId} has been permanently revoked on the
            blockchain. Future verification attempts will show this
            certificate as invalid.
          </p>

          <button
            onClick={() => {
              setTokenId("");
              setCertificate(null);
              setRevoked(false);
            }}
            className="px-6 py-3 rounded-xl bg-gray-100 border border-gray-300 hover:bg-gray-200 transition font-medium text-gray-700"
          >
            Revoke Another Certificate
          </button>
        </div>
      )}
    </div>
  );
}