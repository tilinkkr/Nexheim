import { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';

interface CardanoAPI {
    enable(): Promise<any>;
    isEnabled(): Promise<boolean>;
    getUsedAddresses(): Promise<string[]>;
    getUnusedAddresses(): Promise<string[]>;
    getChangeAddress(): Promise<string>;
    getRewardAddresses(): Promise<string[]>;
    signTx(tx: string, partialSign: boolean): Promise<string>;
    signData(address: string, payload: string): Promise<any>;
    submitTx(tx: string): Promise<string>;
    getUtxos(): Promise<string[]>;
    getBalance(): Promise<string>;
    getNetworkId(): Promise<number>;
}

interface CardanoWallet {
    name: string;
    icon: string;
    apiVersion: string;
    enable(): Promise<CardanoAPI>;
    isEnabled(): Promise<boolean>;
}

declare global {
    interface Window {
        cardano?: {
            [key: string]: CardanoWallet;
        };
    }
}

const ConnectWalletButton = () => {
    const { address: contextAddress, balance: contextBalance, walletName: contextName, setWalletInfo, clearWallet } = useWallet();
    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [availableWallets, setAvailableWallets] = useState<string[]>([]);

    // Sync with context
    useEffect(() => {
        setConnected(!!contextAddress);
    }, [contextAddress]);

    useEffect(() => {
        // Check for available wallets - delay to ensure wallet extensions load
        const checkWallets = () => {
            if (typeof window !== 'undefined' && window.cardano) {
                console.log('Available wallet keys:', Object.keys(window.cardano));
                const wallets = Object.keys(window.cardano).filter(key => {
                    const wallet = window.cardano![key];
                    console.log(`Checking ${key}:`, wallet, 'has enable?', typeof wallet?.enable);
                    // Check if it's a valid wallet object (has enable method)
                    return wallet && typeof wallet.enable === 'function';
                });
                console.log('Filtered wallets:', wallets);
                setAvailableWallets(wallets);
            }
        };
        
        // Check immediately
        checkWallets();
        
        // Also check after a delay (wallet extensions may load late)
        const timeout = setTimeout(checkWallets, 500);
        
        return () => clearTimeout(timeout);
    }, []);

    const handleConnect = async (wallet: string) => {
        if (!window.cardano || !window.cardano[wallet]) {
            alert(`${wallet} wallet not found. Please install it first.`);
            return;
        }

        setConnecting(true);
        console.log(`Attempting to connect to ${wallet}...`);
        
        try {
            console.log('Calling enable() on', wallet);
            const api = await window.cardano[wallet].enable();
            console.log('API received:', api);
            
            if (api) {
                // Get wallet address - try multiple methods for better compatibility
                let walletAddress = '';
                console.log('Getting addresses...');
                
                try {
                    // Try used addresses first
                    const usedAddresses = await api.getUsedAddresses();
                    console.log('Used addresses received:', usedAddresses);
                    
                    if (usedAddresses && usedAddresses.length > 0) {
                        walletAddress = usedAddresses[0];
                    } else {
                        // If no used addresses, try unused addresses
                        console.log('No used addresses, trying unused addresses...');
                        const unusedAddresses = await api.getUnusedAddresses();
                        console.log('Unused addresses received:', unusedAddresses);
                        
                        if (unusedAddresses && unusedAddresses.length > 0) {
                            walletAddress = unusedAddresses[0];
                        } else {
                            // Last resort: try change address
                            console.log('No unused addresses, trying change address...');
                            const changeAddress = await api.getChangeAddress();
                            console.log('Change address received:', changeAddress);
                            
                            if (changeAddress) {
                                walletAddress = changeAddress;
                            }
                        }
                    }
                } catch (addrError) {
                    console.error('Error getting addresses:', addrError);
                }
                
                console.log('Final wallet address:', walletAddress);

                // Get wallet balance (in lovelace, 1 ADA = 1,000,000 lovelace)
                let ada = '0.00';
                try {
                    console.log('Getting balance...');
                    const balanceHex = await api.getBalance();
                    console.log('Balance (hex):', balanceHex);
                    const lovelace = parseInt(balanceHex, 16);
                    ada = (lovelace / 1_000_000).toFixed(2);
                } catch (e) {
                    console.warn('Could not fetch balance:', e);
                }
                
                // Update context with API for advanced operations
                setWalletInfo(walletAddress, ada, wallet, api);
                setConnected(true);
                setShowModal(false);
                console.log(`Successfully connected to ${wallet}`, walletAddress || 'No address');
            }
        } catch (error: any) {
            console.error('Wallet connection failed:', error);
            console.error('Error details:', error.message, error.code);
            alert(`Failed to connect to ${wallet}: ${error.message || 'Unknown error'}`);
        } finally {
            setConnecting(false);
        }
    };

    const handleDisconnect = () => {
        clearWallet();
        setConnected(false);
    };

    if (connected && contextAddress) {
        const displayAddress = contextAddress 
            ? `${contextAddress.slice(0, 8)}...${contextAddress.slice(-6)}`
            : 'Connected';
            
        return (
            <div className="flex items-center gap-2">
                <button
                    onClick={handleDisconnect}
                    className="px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50"
                    title={contextAddress || 'Connected'}
                >
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="hidden md:inline">{contextName ? contextName.charAt(0).toUpperCase() + contextName.slice(1) : 'Wallet'}: </span>
                    {displayAddress}
                </button>
                {contextBalance && (
                    <div className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-mono">
                        <span>₳</span>
                        <span>{contextBalance}</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setShowModal(!showModal)}
                disabled={connecting}
                className="px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {connecting ? (
                    <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Connecting...
                    </>
                ) : (
                    'Connect Wallet'
                )}
            </button>

            {showModal && (
                <>
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowModal(false)}
                    />
                    <div className="absolute top-12 right-0 w-48 bg-surface border border-glass-outline rounded-xl shadow-xl overflow-hidden z-50 flex flex-col">
                        <div className="p-2 text-xs text-muted font-bold uppercase tracking-wider bg-black/20">Select Wallet</div>
                        {availableWallets.length > 0 ? (
                            availableWallets.map((wallet) => (
                                <button
                                    key={wallet}
                                    onClick={() => handleConnect(wallet)}
                                    className="px-4 py-3 text-left text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-2 capitalize"
                                >
                                    {wallet}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-400 text-center">
                                No wallets detected.<br/>
                                Please install Nami, Eternl, or Flint.
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ConnectWalletButton;
