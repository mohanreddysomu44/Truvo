import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import IssueCertificate from './pages/IssueCertificate';
import VerifyCertificate from './pages/VerifyCertificate';
import LearnerPortal from './pages/LearnerPortal';
import RevokeCertificate from './pages/RevokeCertificate';
import Navbar from './components/Navbar';
import BlockchainBackground from './components/BlockchainBackground';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Loading Truvo...</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
  return children;
};

const LightLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    {children}
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#111',
            border: '1px solid #e5e7eb',
          },
        }}
      />
      <Routes>
        {/* Public routes — dark blockchain theme */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyCertificate />} />
        <Route path="/verify/:tokenId" element={<VerifyCertificate />} />

        {/* Protected routes — light theme */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <LightLayout><Dashboard /></LightLayout>
          </ProtectedRoute>
        } />
        <Route path="/issue" element={
          <ProtectedRoute roles={['issuer', 'admin']}>
            <LightLayout><IssueCertificate /></LightLayout>
          </ProtectedRoute>
        } />
        <Route path="/learner" element={
          <ProtectedRoute>
            <LightLayout><LearnerPortal /></LightLayout>
          </ProtectedRoute>
        } />
        <Route path="/revoke" element={
          <ProtectedRoute roles={['issuer', 'admin']}>
            <LightLayout><RevokeCertificate /></LightLayout>
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;