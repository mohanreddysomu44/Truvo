// import { useAuth } from "../context/AuthContext";
// import { Link } from "react-router-dom";
// import {
//   Shield,
//   Award,
//   Search,
//   XCircle,
//   TrendingUp,
//   Zap,
//   Globe,
// } from "lucide-react";

// export default function Dashboard() {
//   const { user } = useAuth();

//   const cards = [
//     {
//       title: "Issue Certificate",
//       description: "Mint a blockchain-verified NFT certificate to a learner",
//       link: "/issue",
//       icon: <Award size={24} />,
//       gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
//       roles: ["issuer", "admin"],
//       glow: "rgba(99,102,241,0.3)",
//     },
//     {
//       title: "My Certificates",
//       description:
//         "View all certificates stored on the blockchain for your wallet",
//       link: "/learner",
//       icon: <Shield size={24} />,
//       gradient: "linear-gradient(135deg, #10b981, #059669)",
//       roles: ["admin", "issuer", "learner"],
//       glow: "rgba(16,185,129,0.3)",
//     },
//     {
//       title: "Verify Certificate",
//       description: "Verify any certificate instantly on the blockchain",
//       link: "/verify",
//       icon: <Search size={24} />,
//       gradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
//       roles: ["admin", "issuer", "learner"],
//       glow: "rgba(59,130,246,0.3)",
//     },
//     {
//       title: "Revoke Certificate",
//       description: "Permanently revoke a certificate on the blockchain",
//       link: "/revoke",
//       icon: <XCircle size={24} />,
//       gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
//       roles: ["issuer", "admin"],
//       glow: "rgba(239,68,68,0.3)",
//     },
//   ];

//   const stats = [
//     {
//       label: "Blockchain",
//       value: "Polygon",
//       icon: <Zap size={16} />,
//       color: "#8b5cf6",
//     },
//     {
//       label: "Storage",
//       value: "IPFS",
//       icon: <Globe size={16} />,
//       color: "#3b82f6",
//     },
//     {
//       label: "Standard",
//       value: "ERC-721",
//       icon: <Shield size={16} />,
//       color: "#10b981",
//     },
//     {
//       label: "Status",
//       value: "Live",
//       icon: <TrendingUp size={16} />,
//       color: "#f59e0b",
//     },
//   ];

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       {/* Hero */}
//       <div
//         className="mb-8 relative overflow-hidden rounded-3xl p-8 border border-indigo-100"
//         style={{ background: "linear-gradient(135deg, #eef2ff, #f5f3ff)" }}
//       >
//         <div
//           className="absolute top-0 right-0 w-64 h-64 opacity-10"
//           style={{
//             background: "radial-gradient(circle, #6366f1, transparent)",
//             transform: "translate(30%, -30%)",
//           }}
//         />
//         <div className="relative z-10">
//           <div className="flex items-center gap-2 mb-3">
//             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
//             <span className="text-green-600 text-xs font-medium">
//               Blockchain Connected
//             </span>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Welcome back, <span className="text-indigo-600">{user?.name}</span>!
//             👋
//           </h1>
//           <p className="text-gray-500 text-sm">
//             {user?.role === "issuer" &&
//               `Issuing certificates as ${user?.organisation || "your organisation"}`}
//             {user?.role === "admin" &&
//               "Full admin access — manage all certificates and issuers"}
//             {user?.role === "learner" &&
//               "Your blockchain-verified credentials are permanently secured"}
//           </p>
//         </div>
//         <div className="grid grid-cols-4 gap-3 mt-6">
//           {stats.map(({ label, value, icon, color }) => (
//             <div
//               key={label}
//               className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100"
//             >
//               <div
//                 className="flex items-center justify-center gap-1 mb-1"
//                 style={{ color }}
//               >
//                 {icon}
//                 <span className="text-xs font-bold">{value}</span>
//               </div>
//               <p className="text-xs text-gray-400">{label}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Action cards */}
//       <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
//         Quick Actions
//       </h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         {cards
//           .filter((card) => card.roles.includes(user?.role))
//           .map((card) => (
//             <Link
//               key={card.title}
//               to={card.link}
//               className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition hover:-translate-y-1"
//             >
//               <div
//                 className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4"
//                 style={{
//                   background: card.gradient,
//                   boxShadow: `0 8px 24px ${card.glow}`,
//                 }}
//               >
//                 {card.icon}
//               </div>
//               <h3 className="font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition">
//                 {card.title}
//               </h3>
//               <p className="text-gray-400 text-xs leading-relaxed">
//                 {card.description}
//               </p>
//             </Link>
//           ))}
//       </div>

//       {/* How it works */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//         <h3 className="font-bold text-gray-900 mb-4">How Truvo Works</h3>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           {[
//             {
//               step: "01",
//               title: "Issue",
//               desc: "Issuer creates certificate and mints it as an NFT",
//               color: "#6366f1",
//             },
//             {
//               step: "02",
//               title: "Store",
//               desc: "PDF stored on IPFS, hash recorded on blockchain",
//               color: "#8b5cf6",
//             },
//             {
//               step: "03",
//               title: "Own",
//               desc: "Certificate NFT sent to learner's wallet address",
//               color: "#3b82f6",
//             },
//             {
//               step: "04",
//               title: "Verify",
//               desc: "Anyone can verify instantly — no login required",
//               color: "#10b981",
//             },
//           ].map(({ step, title, desc, color }) => (
//             <div key={step} className="flex gap-3">
//               <div className="text-2xl font-black opacity-20" style={{ color }}>
//                 {step}
//               </div>
//               <div>
//                 <p className="font-bold text-gray-800 text-sm">{title}</p>
//                 <p className="text-gray-400 text-xs mt-1 leading-relaxed">
//                   {desc}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  Shield,
  Award,
  Search,
  XCircle,
  TrendingUp,
  Zap,
  Globe,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const cards = [
    {
      title: "Issue Certificate",
      description: "Mint a blockchain-verified NFT certificate to a learner",
      link: "/issue",
      icon: <Award size={24} />,
      gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      roles: ["issuer", "admin"],
      glow: "rgba(99,102,241,0.3)",
    },
    {
      title: "My Certificates",
      description:
        "View all certificates stored on the blockchain for your wallet",
      link: "/learner",
      icon: <Shield size={24} />,
      gradient: "linear-gradient(135deg, #10b981, #059669)",
      roles: ["admin", "issuer", "learner"],
      glow: "rgba(16,185,129,0.3)",
    },
    {
      title: "Verify Certificate",
      description: "Verify any certificate instantly on the blockchain",
      link: "/verify",
      icon: <Search size={24} />,
      gradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
      roles: ["admin", "issuer", "learner"],
      glow: "rgba(59,130,246,0.3)",
    },
    {
      title: "Revoke Certificate",
      description: "Permanently revoke a certificate on the blockchain",
      link: "/revoke",
      icon: <XCircle size={24} />,
      gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
      roles: ["issuer", "admin"],
      glow: "rgba(239,68,68,0.3)",
    },
  ];

  const stats = [
    {
      label: "Blockchain",
      value: "Polygon",
      icon: <Zap size={16} />,
      color: "#8b5cf6",
    },
    {
      label: "Storage",
      value: "IPFS",
      icon: <Globe size={16} />,
      color: "#3b82f6",
    },
    {
      label: "Standard",
      value: "ERC-721",
      icon: <Shield size={16} />,
      color: "#10b981",
    },
    {
      label: "Status",
      value: "Live",
      icon: <TrendingUp size={16} />,
      color: "#f59e0b",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Hero */}
      <div
        className="mb-8 relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-indigo-100"
        style={{ background: "linear-gradient(135deg, #eef2ff, #f5f3ff)" }}
      >
        <div
          className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 opacity-10"
          style={{
            background: "radial-gradient(circle, #6366f1, transparent)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-600 text-xs sm:text-sm font-medium">
              Blockchain Connected
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, <span className="text-indigo-600">{user?.name}</span>!
            👋
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm md:text-base">
            {user?.role === "issuer" &&
              `Issuing certificates as ${user?.organisation || "your organisation"}`}
            {user?.role === "admin" &&
              "Full admin access — manage all certificates and issuers"}
            {user?.role === "learner" &&
              "Your blockchain-verified credentials are permanently secured"}
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {stats.map(({ label, value, icon, color }) => (
            <div
              key={label}
              className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100"
            >
              <div
                className="flex items-center justify-center gap-1 mb-1"
                style={{ color }}
              >
                {icon}
                <span className="text-xs sm:text-sm font-bold">{value}</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action cards */}
      <h2 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {cards
          .filter((card) => card.roles.includes(user?.role))
          .map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className="group bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition hover:-translate-y-1 w-full"
            >
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-white mb-4"
                style={{
                  background: card.gradient,
                  boxShadow: `0 8px 24px ${card.glow}`,
                }}
              >
                {card.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base md:text-lg group-hover:text-indigo-600 transition">
                {card.title}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                {card.description}
              </p>
            </Link>
          ))}
      </div>

      {/* How it works */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h3 className="font-bold text-gray-900 mb-4 text-base sm:text-lg">
          How Truvo Works
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              step: "01",
              title: "Issue",
              desc: "Issuer creates certificate and mints it as an NFT",
              color: "#6366f1",
            },
            {
              step: "02",
              title: "Store",
              desc: "PDF stored on IPFS, hash recorded on blockchain",
              color: "#8b5cf6",
            },
            {
              step: "03",
              title: "Own",
              desc: "Certificate NFT sent to learner's wallet address",
              color: "#3b82f6",
            },
            {
              step: "04",
              title: "Verify",
              desc: "Anyone can verify instantly — no login required",
              color: "#10b981",
            },
          ].map(({ step, title, desc, color }) => (
            <div key={step} className="flex gap-3">
              <div
                className="text-xl sm:text-2xl font-black opacity-20"
                style={{ color }}
              >
                {step}
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm sm:text-base">
                  {title}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm mt-1 leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
