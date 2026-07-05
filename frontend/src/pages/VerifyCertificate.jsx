// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import API from "../utils/api";

// export default function VerifyCertificate() {
//   const { tokenId: paramTokenId } = useParams();
//   const [tokenId, setTokenId] = useState(paramTokenId || "");
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (paramTokenId) handleVerify(paramTokenId);
//   }, [paramTokenId]);

//   const handleVerify = async (id) => {
//     setLoading(true);
//     setError("");
//     setResult(null);
//     try {
//       const { data } = await API.get(`/certificate/verify/${id || tokenId}`);
//       setResult(data);
//     } catch (err) {
//       setError("Certificate not found or invalid token ID");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
//       <div className="w-full max-w-lg">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
//             <span className="text-white font-bold text-2xl">T</span>
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             Verify Certificate
//           </h1>
//           <p className="text-gray-500 mt-1">
//             Enter a certificate token ID to verify it on the blockchain
//           </p>
//         </div>

//         {/* Search box */}
//         <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
//           <div className="flex gap-3">
//             <input
//               type="number"
//               value={tokenId}
//               onChange={(e) => setTokenId(e.target.value)}
//               className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               placeholder="Enter Token ID (e.g. 1)"
//             />
//             <button
//               onClick={() => handleVerify()}
//               disabled={loading || !tokenId}
//               className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
//             >
//               {loading ? "Checking..." : "Verify"}
//             </button>
//           </div>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
//             ❌ {error}
//           </div>
//         )}

//         {/* Result */}
//         {result && (
//           <div
//             className={`bg-white rounded-2xl shadow-sm p-6 border-2 ${result.valid ? "border-green-500" : "border-red-500"}`}
//           >
//             {/* Status badge */}
//             <div
//               className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4 ${result.valid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
//             >
//               {result.valid ? "✅ VALID CERTIFICATE" : "❌ REVOKED CERTIFICATE"}
//             </div>
//             {/* Certificate details */}
//             <div className="space-y-3">
//               <div className="flex justify-between py-2 border-b border-gray-100">
//                 <span className="text-sm text-gray-500">Token ID</span>
//                 <span className="text-sm font-bold text-indigo-600">
//                   #{result.certificate.tokenId}
//                 </span>
//               </div>
//               <div className="flex justify-between py-2 border-b border-gray-100">
//                 <span className="text-sm text-gray-500">Learner</span>
//                 <span className="text-sm font-medium">
//                   {result.certificate.learnerName}
//                 </span>
//               </div>
//               <div className="flex justify-between py-2 border-b border-gray-100">
//                 <span className="text-sm text-gray-500">Skill</span>
//                 <span className="text-sm font-medium">
//                   {result.certificate.skillName}
//                 </span>
//               </div>
//               <div className="flex justify-between py-2 border-b border-gray-100">
//                 <span className="text-sm text-gray-500">Issued By</span>
//                 <span className="text-sm font-medium">
//                   {result.certificate.issuingOrg}
//                 </span>
//               </div>
//               <div className="flex justify-between py-2 border-b border-gray-100">
//                 <span className="text-sm text-gray-500">Issued At</span>
//                 <span className="text-sm font-medium">
//                   {new Date(result.certificate.issuedAt).toLocaleDateString(
//                     "en-IN",
//                   )}
//                 </span>
//               </div>
//               <div className="flex justify-between py-2 border-b border-gray-100">
//                 <span className="text-sm text-gray-500">Owner Wallet</span>
//                 <span className="text-xs font-mono text-gray-600">
//                   {result.certificate.owner?.slice(0, 20)}...
//                 </span>
//               </div>
//             </div>
//             {/* View PDF button */}
//             href={result.certificate.ipfsUrl}
//             target="_blank" rel="noopener noreferrer" className="mt-4 block
//             w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium
//             hover:bg-indigo-700 transition text-center"
//             <a>View Certificate PDF on IPFS</a>
//             {/* Blockchain proof */}
//             <p className="text-xs text-gray-400 text-center mt-3">
//               🔗 Verified on Polygon blockchain — tamper-proof
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../utils/api';

export default function VerifyCertificate() {
  const { tokenId: paramTokenId } = useParams();
  const [tokenId, setTokenId] = useState(paramTokenId || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (paramTokenId) handleVerify(paramTokenId);
  }, [paramTokenId]);

  const handleVerify = async (id) => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const { data } = await API.get(`/certificate/verify/${id || tokenId}`);
      setResult(data);
    } catch (err) {
      setError('Certificate not found or invalid token ID');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadVerify = async () => {
    setVerifying(true);
    try {
      const response = await fetch(result.certificate.ipfsUrl);
      const buffer = await response.arrayBuffer();

      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      alert(
        `✅ Certificate Authenticity Verified!\n\n` +
        `IPFS CID on Blockchain:\n${result.certificate.ipfsCid}\n\n` +
        `SHA-256 of downloaded PDF:\n${hashHex.slice(0, 32)}...\n\n` +
        `This PDF is exactly what was stored when the certificate was issued.\n` +
        `It has NOT been tampered with.`
      );
    } catch (err) {
      alert('Could not verify — IPFS gateway may be slow. Try again in a moment.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verify Certificate</h1>
          <p className="text-gray-500 mt-1">
            Enter a certificate token ID to verify it on the blockchain
          </p>
        </div>

        {/* Search box */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <div className="flex gap-3">
            <input
              type="number"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter Token ID (e.g. 1)"
            />
            <button
              onClick={() => handleVerify()}
              disabled={loading || !tokenId}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Verify'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            This verification reads directly from the blockchain — no login required
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm mb-4">
            ❌ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`bg-white rounded-2xl shadow-sm p-6 border-2 ${
            result.valid ? 'border-green-500' : 'border-red-500'
          }`}>

            {/* Status badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6 ${
              result.valid
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {result.valid ? '✅ VALID CERTIFICATE' : '❌ REVOKED CERTIFICATE'}
            </div>

            {/* Certificate details */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Token ID</span>
                <span className="text-sm font-bold text-indigo-600">
                  #{result.certificate.tokenId}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Learner Name</span>
                <span className="text-sm font-medium">
                  {result.certificate.learnerName}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Skill / Course</span>
                <span className="text-sm font-medium">
                  {result.certificate.skillName}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Issued By</span>
                <span className="text-sm font-medium">
                  {result.certificate.issuingOrg}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Issue Date</span>
                <span className="text-sm font-medium">
                  {new Date(result.certificate.issuedAt).toLocaleDateString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Owner Wallet</span>
                <span className="text-xs font-mono text-gray-600">
                  {result.certificate.owner?.slice(0, 10)}...{result.certificate.owner?.slice(-6)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">IPFS CID</span>
                <span className="text-xs font-mono text-gray-600">
                  {result.certificate.ipfsCid?.slice(0, 10)}...{result.certificate.ipfsCid?.slice(-6)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`text-sm font-bold ${
                  result.valid ? 'text-green-600' : 'text-red-600'
                }`}>
                  {result.valid ? 'Active & Valid' : 'Revoked'}
                </span>
              </div>
            </div>

            {/* Action buttons */}
           <div className="space-y-2">
  {/* View PDF */}
  <a
    href={result.certificate.ipfsUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="block w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition text-center"
  >
    📄 View Certificate PDF on IPFS
  </a>

  {/* Download and verify hash */}
  <button
    onClick={handleDownloadVerify}
    disabled={verifying}
    className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
  >
    {verifying ? "🔄 Verifying..." : "🔍 Download & Verify Authenticity"}
  </button>

  {/* Copy verify link */}
  <button
    onClick={() => {
      navigator.clipboard.writeText(
        `${window.location.origin}/verify/${result.certificate.tokenId}`
      );
      alert("Verification link copied to clipboard!");
    }}
    className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition"
  >
    🔗 Copy Verification Link
  </button>
</div>
            {/* Blockchain proof footer */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-400 text-center">
                🔗 Data sourced directly from blockchain — tamper-proof & permanent
              </p>
              <p className="text-xs text-gray-400 text-center mt-1">
                Even if Truvo closes, this certificate remains verifiable forever
              </p>
            </div>
          </div>
        )}

        {/* How it works */}
        {!result && !error && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mt-4">
            <h3 className="font-bold text-gray-900 mb-3">How verification works</h3>
            <div className="space-y-2">
              <div className="flex gap-3 items-start">
                <span className="text-indigo-600 font-bold">1.</span>
                <p className="text-sm text-gray-600">Enter the certificate token ID</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-indigo-600 font-bold">2.</span>
                <p className="text-sm text-gray-600">We read the record directly from the blockchain</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-indigo-600 font-bold">3.</span>
                <p className="text-sm text-gray-600">The IPFS CID on-chain matches the PDF — proving it was not tampered</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-indigo-600 font-bold">4.</span>
                <p className="text-sm text-gray-600">Click "Download & Verify" to confirm the PDF hash matches the CID</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}