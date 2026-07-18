import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { Shield, LogOut, Wallet, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { walletAddress, isConnected, connecting, connectWallet, disconnectWallet, formatAddress } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();
  const [showWalletMenu, setShowWalletMenu] = useState(false);

  const handleLogout = () => {
    logout();
    disconnectWallet();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-indigo-600">Truvo</span>
              <div className="text-xs text-gray-400 -mt-1">Blockchain Credentials</div>
            </div>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {[
              { path: '/dashboard', label: 'Dashboard' },
              ...(user?.role === 'issuer' || user?.role === 'admin'
                ? [{ path: '/issue', label: 'Issue' }]
                : []),
              { path: '/learner', label: 'My Certs' },
              { path: '/verify', label: 'Verify' },
              ...(user?.role === 'issuer' || user?.role === 'admin'
                ? [{ path: '/revoke', label: 'Revoke' }]
                : []),
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(path)
                    ? 'text-indigo-600 bg-indigo-50 border border-indigo-200'
                    : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">

            {/* Wallet button */}
            {isConnected ? (
              <div className="relative">
                <button
                  onClick={() => setShowWalletMenu(!showWalletMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-green-200 bg-green-50 text-green-700 text-xs font-medium"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  {formatAddress(walletAddress)}
                  <ChevronDown size={12} />
                </button>
                {showWalletMenu && (
                  <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-2 w-48 z-50">
                    <p className="text-xs text-gray-400 px-2 py-1">Connected Wallet</p>
                    <p className="text-xs font-mono text-gray-600 px-2 py-1 break-all">{walletAddress}</p>
                    <button
                      onClick={() => { disconnectWallet(); setShowWalletMenu(false); }}
                      className="w-full text-left px-2 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg mt-1"
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={connecting}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-orange-200 bg-orange-50 text-orange-600 text-xs font-medium hover:bg-orange-100 transition"
              >
                <Wallet size={14} />
                {connecting ? 'Connecting...' : '🦊 Connect'}
              </button>
            )}

            {/* User info */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              >
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-indigo-500 capitalize">{user?.role}</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}