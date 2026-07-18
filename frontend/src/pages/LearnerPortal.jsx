import { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import API from '../utils/api';
import { Link } from 'react-router-dom';
import { Search, ExternalLink, Shield, Copy, CheckCircle, Wallet } from 'lucide-react';

export default function LearnerPortal() {
  const { walletAddress, isConnected, connectWallet, formatAddress } = useWallet();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState('');
  const [searched, setSearched] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const fetchCertificates = async (walletAddr) => {
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await API.get(`/certificate/learner/${walletAddr}`);
      setCertificates(data.certificates);
    } catch (error) {
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      setWallet(walletAddress);
      fetchCertificates(walletAddress);
    }
  }, [walletAddress]);

  const handleSearch = () => {
    if (!wallet) return;
    fetchCertificates(wallet);
  };

  const copyLink = (tokenId) => {
    navigator.clipboard.writeText(`${window.location.origin}/verify/${tokenId}`);
    setCopiedId(tokenId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
        <p className="text-gray-500 text-sm mt-1">
          Blockchain certificates linked to your wallet address
        </p>
      </div>

      {/* Wallet connect */}
      {!isConnected && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-orange-700">🦊 Connect MetaMask</p>
            <p className="text-xs text-orange-500 mt-0.5">Auto-load your certificates</p>
          </div>
          <button
            onClick={connectWallet}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
          >
            Connect Wallet
          </button>
        </div>
      )}

      {isConnected && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-sm font-medium text-green-700">Wallet Connected</p>
          </div>
          <p className="text-xs font-mono text-green-600 mt-1">{walletAddress}</p>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          Wallet Address
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Wallet size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-gray-800 text-sm font-mono placeholder-gray-300 focus:outline-none focus:border-indigo-400 transition"
              placeholder="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !wallet}
            className="px-5 py-2.5 rounded-xl font-medium text-white flex items-center gap-2 text-sm disabled:opacity-50 transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <Search size={14} />
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
        <button
          onClick={() => {
            setWallet('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
            fetchCertificates('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
          }}
          className="mt-2 text-xs text-indigo-500 hover:text-indigo-700"
        >
          Use test wallet →
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading certificates from blockchain...</p>
        </div>
      )}

      {/* No results */}
      {searched && !loading && certificates.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-gray-500 font-medium">No certificates found</p>
          <p className="text-gray-400 text-sm mt-1">
            No certificates have been issued to this wallet address
          </p>
        </div>
      )}

      {/* Certificate cards */}
      {certificates.length > 0 && (
        <>
          <p className="text-xs text-gray-400 mb-4">
            Found {certificates.length} certificate{certificates.length > 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                    >
                      <Shield size={16} className="text-white" />
                    </div>
                    <span className="text-xs font-bold text-indigo-600">
                      Token #{cert.tokenId}
                    </span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    cert.status === 'issued'
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {cert.status === 'issued' ? '✅ Valid' : '❌ Revoked'}
                  </span>
                </div>

                {/* Details */}
                <h3 className="font-bold text-gray-900 text-base mb-1">
                  {cert.skillName}
                </h3>
                <p className="text-sm text-gray-600 mb-0.5">{cert.learnerName}</p>
                <p className="text-xs text-gray-400 mb-0.5">{cert.issuingOrg}</p>
                <p className="text-xs text-gray-300 mb-4">
                  Issued: {new Date(cert.issuedAt).toLocaleDateString('en-IN')}
                </p>

                {/* NFT ownership badge */}
                {isConnected &&
                  walletAddress.toLowerCase() === cert.learnerWallet?.toLowerCase() && (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-2.5 mb-3">
                    <p className="text-xs text-indigo-600 font-medium">
                      🎖️ You own this NFT certificate
                    </p>
                    <p className="text-xs font-mono text-indigo-400">
                      {formatAddress(walletAddress)}
                    </p>
                  </div>
                )}

                {/* IPFS CID */}
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 mb-4">
                  <p className="text-xs text-gray-400 mb-0.5">IPFS CID</p>
                  <p className="text-xs font-mono text-gray-500 truncate">
                    {cert.ipfsCid}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${cert.ipfsCid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 rounded-xl text-xs font-medium text-white flex items-center justify-center gap-1 hover:opacity-90 transition"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                  >
                    <ExternalLink size={12} /> PDF
                  </a>
                  <Link
                    to={`/verify/${cert.tokenId}`}
                    className="flex-1 py-2 rounded-xl text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 flex items-center justify-center gap-1 hover:bg-gray-200 transition"
                  >
                    <Shield size={12} /> Verify
                  </Link>
                  <button
                    onClick={() => copyLink(cert.tokenId)}
                    className="flex-1 py-2 rounded-xl text-xs font-medium bg-gray-100 border border-gray-200 flex items-center justify-center gap-1 hover:bg-gray-200 transition text-gray-600"
                  >
                    {copiedId === cert.tokenId
                      ? <><CheckCircle size={12} className="text-green-500" /> Done</>
                      : <><Copy size={12} /> Share</>
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty state */}
      {!searched && !loading && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-500 font-medium">
            {isConnected
              ? 'Loading your certificates...'
              : 'Connect wallet or enter address to view certificates'}
          </p>
        </div>
      )}
    </div>
  );
}