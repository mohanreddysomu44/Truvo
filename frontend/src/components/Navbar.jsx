import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Truvo</span>
          </Link>

          {/* Navigation links */}
          <div className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-indigo-600 text-sm font-medium"
            >
              Dashboard
            </Link>
            {(user?.role === "issuer" || user?.role === "admin") && (
              <Link
                to="/issue"
                className="text-gray-600 hover:text-indigo-600 text-sm font-medium"
              >
                Issue Certificate
              </Link>
            )}
            <Link
              to="/learner"
              className="text-gray-600 hover:text-indigo-600 text-sm font-medium"
            >
              My Certificates
            </Link>
            <Link
              to="/verify"
              className="text-gray-600 hover:text-indigo-600 text-sm font-medium"
            >
              Verify
            </Link>
          </div>

          {/* User info + logout */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-indigo-600 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-100 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
