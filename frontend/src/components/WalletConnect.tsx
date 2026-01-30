import { useState, useEffect } from 'react';
import { AppConfig, showConnect, UserSession } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

interface WalletConnectProps {
    onConnect: (address: string) => void;
}

export default function WalletConnect({ onConnect }: WalletConnectProps) {
    const [mounted, setMounted] = useState(false);
    const [address, setAddress] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        if (userSession.isUserSignedIn()) {
            const userData = userSession.loadUserData();
            const userAddress = userData.profile.stxAddress.testnet;
            setAddress(userAddress);
            onConnect(userAddress);
        }
    }, [onConnect]);

    const connectWallet = () => {
        showConnect({
            appDetails: {
                name: 'SatGuard Protocol',
                icon: window.location.origin + '/logo.svg',
            },
            redirectTo: '/',
            onFinish: () => {
                const userData = userSession.loadUserData();
                const userAddress = userData.profile.stxAddress.testnet;
                setAddress(userAddress);
                onConnect(userAddress);
            },
            userSession,
        });
    };

    const disconnectWallet = () => {
        userSession.signUserOut();
        setAddress(null);
        window.location.reload();
    };

    if (!mounted) return null;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {address ? (
                <>
                    <span style={{
                        padding: '8px 16px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: 'monospace'
                    }}>
                        {address.slice(0, 6)}...{address.slice(-4)}
                    </span>
                    <button
                        onClick={disconnectWallet}
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            padding: '8px 16px'
                        }}
                    >
                        Disconnect
                    </button>
                </>
            ) : (
                <button
                    onClick={connectWallet}
                    style={{
                        background: 'white',
                        color: '#5546FF',
                        padding: '10px 20px',
                        fontWeight: '600'
                    }}
                >
                    Connect Wallet
                </button>
            )}
        </div>
    );
}
