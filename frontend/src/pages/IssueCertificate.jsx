import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { useWallet } from "../context/WalletContext";
import toast from "react-hot-toast";

export default function IssueCertificate() {
  const navigate = useNavigate();
  const { walletAddress, isConnected, connectWallet } = useWallet();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({
    learnerName: "",
    learnerEmail: "",
    learnerWallet: "",
    skillName: "",
    issuingOrg: "",
  });

  // Auto-fill wallet when MetaMask is connected
  useEffect(() => {
    if (walletAddress) {
      setForm((prev) => ({ ...prev, learnerWallet: walletAddress }));
    }
  }, [walletAddress]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/certificate/issue", form);
      setResult(data.certificate);
      toast.success("Certificate issued successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to issue certificate");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Certificate Issued!
          </h2>
          <p className="text-gray-500 mb-6">Minted as NFT on the blockchain</p>

          <div className="bg-gray-50 rounded-xl p-4 text-left space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Token ID</span>
              <span className="text-sm font-bold text-indigo-600">
                #{result.tokenId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Learner</span>
              <span className="text-sm font-medium">{form.learnerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Skill</span>
              <span className="text-sm font-medium">{result.skillName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">IPFS CID</span>
              <span className="text-xs font-mono text-gray-600">
                {result.ipfsCid?.slice(0, 20)}...
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">TX Hash</span>
              <span className="text-xs font-mono text-gray-600">
                {result.txHash?.slice(0, 20)}...
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <a
              href={result.ipfsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1
              bg-indigo-600 text-white py-2.5 rounded-lg font-medium
              hover:bg-indigo-700 transition text-center"
            >
              {" "}
              View Certificate PDF
            </a>
            <button
              onClick={() => setResult(null)}
              className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              Issue Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Issue Certificate</h1>
        <p className="text-gray-500 mt-1">
          Issue a blockchain-verified certificate to a learner
        </p>
      </div>

      {/* MetaMask connection status */}
      {!isConnected ? (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-orange-800">
              🦊 Connect MetaMask
            </p>
            <p className="text-xs text-orange-600 mt-1">
              Connect your wallet to auto-fill the learner wallet address
            </p>
          </div>
          <button
            onClick={connectWallet}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition"
          >
            Connect
          </button>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
          <p className="text-sm font-medium text-green-800">
            ✅ Wallet Connected
          </p>
          <p className="text-xs font-mono text-green-600 mt-1">
            {walletAddress}
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Learner Name
              </label>
              <input
                type="text"
                value={form.learnerName}
                onChange={(e) =>
                  setForm({ ...form, learnerName: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Mohan Kumar"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Learner Email
              </label>
              <input
                type="email"
                value={form.learnerEmail}
                onChange={(e) =>
                  setForm({ ...form, learnerEmail: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="learner@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Learner Wallet Address
              {isConnected && (
                <span className="ml-2 text-xs text-green-600">
                  ✅ Auto-filled from MetaMask
                </span>
              )}
            </label>
            <input
              type="text"
              value={form.learnerWallet}
              onChange={(e) =>
                setForm({ ...form, learnerWallet: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              placeholder="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skill / Course Name
            </label>
            <input
              type="text"
              value={form.skillName}
              onChange={(e) => setForm({ ...form, skillName: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Full Stack Web Development"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Issuing Organisation
            </label>
            <input
              type="text"
              value={form.issuingOrg}
              onChange={(e) => setForm({ ...form, issuingOrg: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Truvo Training Institute"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Issuing on blockchain...
              </>
            ) : (
              "🎓 Issue Certificate"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
