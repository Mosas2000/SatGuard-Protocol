import { Link } from 'react-router-dom';
import WalletConnect from './WalletConnect';

interface HeaderProps {
    userAddress: string | null;
    onConnect: (address: string) => void;
    onDisconnect: () => void;
}

export default function Header({ userAddress, onConnect, onDisconnect }: HeaderProps) {
    return (
        <header className="border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="text-2xl font-bold text-black">
                            SatGuard
                        </Link>
                        <nav className="hidden md:flex gap-6">
                            <Link to="/pools" className="text-black hover:text-stacks-orange transition">
                                Pools
                            </Link>
                            <Link to="/create" className="text-black hover:text-stacks-orange transition">
                                Create Pool
                            </Link>
                            {userAddress && (
                                <Link to="/dashboard" className="text-black hover:text-stacks-orange transition">
                                    Dashboard
                                </Link>
                            )}
                        </nav>
                    </div>
                    <WalletConnect onConnect={onConnect} onDisconnect={onDisconnect} />
                </div>
            </div>
        </header>
    );
}
