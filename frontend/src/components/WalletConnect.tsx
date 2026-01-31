import { useState, useEffect } from 'react';
import { AppConfig, showConnect, UserSession } from '@stacks/connect';
import { formatAddress } from '../utils/constants';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

interface WalletConnectProps {
    onConnect: (address: string) => void;
    onDisconnect: () => void;
}

export default function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
    const [mounted, setMounted] = useState(false);
    const [address, setAddress] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        if (userSession.isUserSignedIn()) {
            const userData = userSession.loadUserData();
            const userAddress = userData.profile.stxAddress.mainnet;
            setAddress(userAddress);
            onConnect(userAddress);
        }
    }, [onConnect]);

    const connectWallet = () => {
        showConnect({
            appDetails: {
                name: 'SatGuard Protocol',
                icon: window.location.origin + '/icon.png',
            },
            redirectTo: '/',
            onFinish: () => {
                const userData = userSession.loadUserData();
                const userAddress = userData.profile.stxAddress.mainnet;
                setAddress(userAddress);
                onConnect(userAddress);
            },
            userSession,
        });
    };

    const disconnectWallet = () => {
        userSession.signUserOut();
        setAddress(null);
        onDisconnect();
        window.location.reload();
    };

    if (!mounted) return null;

    return (
        <div className="flex items-center gap-3">
            {address ? (
                <>
                    <span className="px-4 py-2 bg-black text-white rounded text-sm font-mono border border-gray-300">
                        {formatAddress(address)}
                    </span>
                    <button
                        onClick={disconnectWallet}
                        className="px-4 py-2 border border-black text-black rounded hover:bg-black hover:text-white transition"
                    >
                        Disconnect
                    </button>
                </>
            ) : (
                <button
                    onClick={connectWallet}
                    className="px-6 py-2 bg-stacks-orange text-white rounded hover:bg-orange-600 transition font-medium"
                >
                    Connect Wallet
                </button>
            )}
        </div>
    );
}
