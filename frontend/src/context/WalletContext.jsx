import { createContext, useContext, useState } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');

  const connectWallet = async () => {
    setConnecting(true);
    setError('');
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        setError('MetaMask not installed. Please install it from metamask.io');
        return;
      }

      // Request wallet connection
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        console.log('Wallet connected:', accounts[0]);
      }

    } catch (err) {
      if (err.code === 4001) {
        setError('Connection rejected. Please approve in MetaMask.');
      } else {
        setError('Failed to connect wallet: ' + err.message);
      }
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    setIsConnected(false);
    setError('');
  };

  // Format address for display: 0x1234...5678
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <WalletContext.Provider value={{
      walletAddress,
      isConnected,
      connecting,
      error,
      connectWallet,
      disconnectWallet,
      formatAddress,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);