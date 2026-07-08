import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { walletAddress, isConnected, connecting, connectWallet, disconnectWallet, formatAddress } = useWallet();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    disconnectWallet();
    navigate('/login');
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
            <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">
              Dashboard
            </Link>
            {(user?.role === 'issuer' || user?.role === 'admin') && (
              <Link to="/issue" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">
                Issue Certificate
              </Link>
            )}
            <Link to="/learner" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">
              My Certificates
            </Link>
            <Link to="/verify" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">
              Verify
            </Link>
          </div>

          {/* Right side — wallet + user */}
          <div className="flex items-center gap-3">

            {/* MetaMask wallet button */}
            {isConnected ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-mono text-green-700">
                    {formatAddress(walletAddress)}
                  </span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="text-xs text-gray-400 hover:text-red-500 transition"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={connecting}
                className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-orange-100 transition disabled:opacity-50"
              >
                🦊 {connecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}

            {/* User info */}
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-indigo-600 capitalize">{user?.role}</p>
            </div>

            {/* Logout */}
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