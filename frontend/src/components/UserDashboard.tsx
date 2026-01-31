import { useUserStats } from '../hooks/useUserStats';
import { formatAmount } from '../utils/network';

interface UserDashboardProps {
    userAddress: string | null;
}

export default function UserDashboard({ userAddress }: UserDashboardProps) {
    const { stats, loading } = useUserStats(userAddress);

    if (!userAddress) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
                <p className="text-gray-600">Please connect your wallet to view your dashboard.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stacks-orange"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-black mb-12">User Dashboard</h1>

            <div className="grid md:grid-cols-4 gap-6 mb-12">
                <div className="bg-black text-white p-6 rounded shadow-sm">
                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Total Contributed</p>
                    <p className="text-2xl font-mono font-bold">{formatAmount(stats.totalContributed)} sBTC</p>
                </div>
                <div className="bg-white border border-gray-200 p-6 rounded shadow-sm">
                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Active Pools</p>
                    <p className="text-2xl font-bold text-black">{stats.activePoolsCount}</p>
                </div>
                <div className="bg-white border border-gray-200 p-6 rounded shadow-sm">
                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Claims Submitted</p>
                    <p className="text-2xl font-bold text-black">{stats.submittedClaimsCount}</p>
                </div>
                <div className="bg-stacks-orange text-white p-6 rounded shadow-sm">
                    <p className="text-orange-200 text-xs uppercase tracking-widest mb-2">Voting Power</p>
                    <p className="text-2xl font-mono font-bold">{formatAmount(stats.totalVotingPower)} VP</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section className="border border-gray-200 rounded p-8">
                        <h2 className="text-2xl font-bold text-black mb-6">Recent Activity</h2>
                        <div className="text-center py-12 text-gray-400 italic">
                            Activity feed coming soon...
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    <section className="border border-gray-200 rounded p-8">
                        <h2 className="text-xl font-bold text-black mb-6">Quick Actions</h2>
                        <div className="space-y-4">
                            <button className="w-full py-3 bg-black text-white rounded text-sm font-bold hover:bg-gray-800 transition">
                                Browse New Pools
                            </button>
                            <button className="w-full py-3 border border-black text-black rounded text-sm font-bold hover:bg-gray-50 transition">
                                View My Claims
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
