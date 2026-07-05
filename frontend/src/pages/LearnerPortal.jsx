// import { useState } from 'react';
// import API from '../utils/api';
// import { useAuth } from '../context/AuthContext';

// export default function LearnerPortal() {
//   const { user } = useAuth();
//   const [wallet, setWallet] = useState('');
//   const [certificates, setCertificates] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searched, setSearched] = useState(false);

//   const handleSearch = async () => {
//     if (!wallet) return;
//     setLoading(true);
//     setSearched(true);
//     try {
//       const { data } = await API.get(`/certificate/learner/${wallet}`);
//       setCertificates(data.certificates);
//     } catch (error) {
//       setCertificates([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Learner Portal</h1>
//         <p className="text-gray-500 mt-1">View all certificates for a wallet address</p>
//       </div>

//       {/* Search */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Enter Wallet Address
//         </label>
//         <div className="flex gap-3">
//           <input
//             type="text"
//             value={wallet}
//             onChange={(e) => setWallet(e.target.value)}
//             className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
//             placeholder="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
//           />
//           <button
//             onClick={handleSearch}
//             disabled={loading || !wallet}
//             className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
//           >
//             {loading ? 'Loading...' : 'Search'}
//           </button>
//         </div>

//         {/* Quick fill with test wallet */}
//         <button
//           onClick={() => setWallet('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')}
//           className="mt-2 text-xs text-indigo-500 hover:underline"
//         >
//           Use test wallet address
//         </button>
//       </div>

//       {/* Results */}
//       {searched && !loading && (
//         <>
//           {certificates.length === 0 ? (
//             <div className="text-center py-12 text-gray-400">
//               No certificates found for this wallet address
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {certificates.map((cert) => (
//                 <div
//                   key={cert._id}
//                   className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
//                 >
//                   <div className="flex justify-between items-start mb-3">
//                     <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
//                       #{cert.tokenId}
//                     </span>
//                     <span
//                       className={`text-xs px-2 py-1 rounded-full font-medium ${
//                         cert.status === 'issued'
//                           ? 'bg-green-100 text-green-700'
//                           : 'bg-red-100 text-red-700'
//                       }`}
//                     >
//                       {cert.status}
//                     </span>
//                   </div>

//                   <h3 className="font-bold text-gray-900 mb-1">{cert.skillName}</h3>
//                   <p className="text-sm text-gray-500 mb-1">{cert.learnerName}</p>
//                   <p className="text-xs text-gray-400 mb-3">{cert.issuingOrg}</p>
//                   <p className="text-xs text-gray-400 mb-4">
//                     Issued: {new Date(cert.issuedAt).toLocaleDateString('en-IN')}
//                   </p>

//                   <div className="flex gap-2">
//                     <a
//                       href={`https://gateway.pinata.cloud/ipfs/${cert.ipfsCid}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-xs font-medium text-center hover:bg-indigo-700 transition"
//                     >
//                       View PDF
//                     </a>
//                     <a
//                       href={`/verify/${cert.tokenId}`}
//                       className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-xs font-medium text-center hover:bg-gray-200 transition"
//                     >
//                       Verify
//                     </a>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }



import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { Link } from 'react-router-dom';

export default function LearnerPortal() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState('');
  const [searched, setSearched] = useState(false);

  // Auto-load if user has a wallet address saved
  useEffect(() => {
    if (user?.walletAddress) {
      setWallet(user.walletAddress);
      fetchCertificates(user.walletAddress);
    }
  }, [user]);

  const fetchCertificates = async (walletAddress) => {
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await API.get(`/certificate/learner/${walletAddress}`);
      setCertificates(data.certificates);
    } catch (error) {
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!wallet) return;
    fetchCertificates(wallet);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
        <p className="text-gray-500 mt-1">
          Certificates are linked to your blockchain wallet address
        </p>
      </div>

      {/* Wallet input */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Wallet Address
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
            placeholder="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !wallet}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>

        {/* Info about wallet */}
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            💡 Certificates are stored on the blockchain linked to a wallet address.
            Enter the wallet address used when the certificate was issued.
          </p>
        </div>

        {/* Quick fill buttons */}
        <div className="mt-2 flex gap-2 flex-wrap">
          <button
            onClick={() => {
              setWallet('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
              fetchCertificates('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
            }}
            className="text-xs text-indigo-500 hover:underline"
          >
            Use test wallet
          </button>
          {user?.walletAddress && (
            <button
              onClick={() => {
                setWallet(user.walletAddress);
                fetchCertificates(user.walletAddress);
              }}
              className="text-xs text-indigo-500 hover:underline"
            >
              Use my wallet ({user.walletAddress.slice(0, 10)}...)
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Loading certificates from blockchain...</p>
        </div>
      )}

      {/* No results */}
      {searched && !loading && certificates.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
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
          <p className="text-sm text-gray-500 mb-4">
            Found {certificates.length} certificate{certificates.length > 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                    Token #{cert.tokenId}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    cert.status === 'issued'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {cert.status === 'issued' ? '✅ Valid' : '❌ Revoked'}
                  </span>
                </div>

                {/* Details */}
                <h3 className="font-bold text-gray-900 text-lg mb-1">
                  {cert.skillName}
                </h3>
                <p className="text-sm text-gray-600 mb-1">{cert.learnerName}</p>
                <p className="text-xs text-gray-400 mb-1">{cert.issuingOrg}</p>
                <p className="text-xs text-gray-400 mb-4">
                  Issued: {new Date(cert.issuedAt).toLocaleDateString('en-IN')}
                </p>

                {/* IPFS CID */}
                <div className="bg-gray-50 rounded-lg p-2 mb-4">
                  <p className="text-xs text-gray-400">IPFS CID (tamper-proof link)</p>
                  <p className="text-xs font-mono text-gray-600 truncate">
                    {cert.ipfsCid}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  
                  <a>
                    href={`https://gateway.pinata.cloud/ipfs/${cert.ipfsCid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-xs font-medium text-center hover:bg-indigo-700 transition"
                  
                    📄 View PDF
                  </a>
                  <Link
                    to={`/verify/${cert.tokenId}`}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-xs font-medium text-center hover:bg-gray-200 transition"
                  >
                    🔍 Verify
                  </Link>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/verify/${cert.tokenId}`
                      );
                      alert('Verification link copied!');
                    }}
                    className="flex-1 bg-green-50 text-green-700 py-2 rounded-lg text-xs font-medium text-center hover:bg-green-100 transition"
                  >
                    🔗 Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Not searched yet */}
      {!searched && !loading && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-500 font-medium">Enter a wallet address to view certificates</p>
          <p className="text-gray-400 text-sm mt-1">
            Certificates are stored on the blockchain linked to wallet addresses
          </p>
        </div>
      )}
    </div>
  );
}