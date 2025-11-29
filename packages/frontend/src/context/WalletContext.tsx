import { createContext, useState, useContext, type ReactNode } from 'react';

interface WalletContextType {
    address: string | null;
    balance: string | null;
    walletName: string | null;
    walletApi: any | null; // Store the wallet API for advanced operations
    setWalletInfo: (address: string, balance: string, name: string, api?: any) => void;
    clearWallet: () => void;
}

const WalletContext = createContext<WalletContextType>({
    address: null,
    balance: null,
    walletName: null,
    walletApi: null,
    setWalletInfo: () => {},
    clearWallet: () => {},
});

export const useWallet = () => useContext(WalletContext);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [address, setAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState<string | null>(null);
    const [walletName, setWalletName] = useState<string | null>(null);
    const [walletApi, setWalletApi] = useState<any | null>(null);

    const setWalletInfo = (addr: string, bal: string, name: string, api?: any) => {
        setAddress(addr);
        setBalance(bal);
        setWalletName(name);
        if (api) setWalletApi(api);
    };

    const clearWallet = () => {
        setAddress(null);
        setBalance(null);
        setWalletName(null);
        setWalletApi(null);
    };

    return (
        <WalletContext.Provider value={{ address, balance, walletName, walletApi, setWalletInfo, clearWallet }}>
            {children}
        </WalletContext.Provider>
    );
}
