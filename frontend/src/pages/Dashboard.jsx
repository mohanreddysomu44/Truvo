import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();

  const cards = [
    {
      title: "Issue Certificate",
      description: "Issue a new blockchain-verified certificate to a learner",
      link: "/issue",
      color: "bg-indigo-600",
      icon: "🎓",
      roles: ["issuer", "admin"],
    },
    {
      title: "My Certificates",
      description: "View all certificates issued to your wallet",
      link: "/learner",
      color: "bg-green-600",
      icon: "📜",
      roles: ["admin", "issuer", "learner"],
    },
    {
      title: "Verify Certificate",
      description: "Verify any certificate using its token ID",
      link: "/verify",
      color: "bg-blue-600",
      icon: "✅",
      roles: ["admin", "issuer", "learner"],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          {user?.role === "issuer" && `Issuing as: ${user?.organisation}`}
          {user?.role === "admin" && "You have full admin access"}
          {user?.role === "learner" &&
            "View and share your blockchain certificates"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Role</p>
          <p className="text-2xl font-bold text-indigo-600 capitalize mt-1">
            {user?.role}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Platform</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">Truvo</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Blockchain</p>
          <p className="text-2xl font-bold text-green-600 mt-1">Connected ✓</p>
        </div>
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards
          .filter((card) => card.roles.includes(user?.role))
          .map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition group"
            >
              <div
                className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center text-2xl mb-4`}
              >
                {card.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition">
                {card.title}
              </h3>
              <p className="text-gray-500 text-sm mt-1">{card.description}</p>
            </Link>
          ))}
      </div>
    </div>
  );
}
