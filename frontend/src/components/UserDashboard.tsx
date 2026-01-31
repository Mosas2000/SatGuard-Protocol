import { Link } from 'react-router-dom';
import { useUserStats, ActivityItem } from '../hooks/useUserStats';
import { formatAmount, CLAIM_STATUS } from '../utils/constants';

interface UserDashboardProps {
    userAddress: string | null;
}

export default function UserDashboard({ userAddress }: UserDashboardProps) {
    const { stats, activities, loading } = useUserStats(userAddress);

    const getStatusLabel = (status?: number) => {
        switch (status) {
            case CLAIM_STATUS.PENDING: return { label: 'Pending', color: 'text-yellow-600' };
            case CLAIM_STATUS.APPROVED: return { label: 'Approved', color: 'text-green-600' };
            case CLAIM_STATUS.REJECTED: return { label: 'Rejected', color: 'text-red-600' };
            case CLAIM_STATUS.PAID: return { label: 'Paid', color: 'text-blue-600' };
            default: return { label: '', color: '' };
        }
    };

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
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-bold text-black">User Dashboard</h1>
                <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Connected Address</p>
                    <p className="font-mono text-sm font-bold">{userAddress.slice(0, 8)}...{userAddress.slice(-6)}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-12">
                <div className="bg-black text-white p-6 rounded shadow-lg">
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
                <div className="bg-stacks-orange text-white p-6 rounded shadow-lg">
                    <p className="text-orange-100 text-xs uppercase tracking-widest mb-2">Voting Power</p>
                    <p className="text-2xl font-mono font-bold">{formatAmount(stats.totalVotingPower)} VP</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section className="border border-gray-200 rounded p-8">
                        <h2 className="text-2xl font-bold text-black mb-8">Recent Activity</h2>
                        {activities.length > 0 ? (
                            <div className="space-y-4">
                                {activities.map((activity: ActivityItem) => {
                                    const status = getStatusLabel(activity.status);
                                    return (
                                        <div key={activity.id} className="flex items-center justify-between py-4 border-b last:border-0">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'contribution' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                                                    }`}>
                                                    {activity.type === 'contribution' ? '↑' : '↓'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-black capitalize">
                                                        {activity.type} to Pool #{activity.poolId}
                                                    </p>
                                                    <p className="text-xs text-gray-500">Block #{activity.timestamp}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-mono font-bold text-black">{formatAmount(activity.amount)} sBTC</p>
                                                {activity.type === 'claim' && (
                                                    <p className={`text-xs font-bold uppercase ${status.color}`}>
                                                        {status.label}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400 italic">
                                No recent activity found for your address.
                            </div>
                        )}
                    </section>
                </div>

                <div className="space-y-8">
                    <section className="border border-gray-200 rounded p-8 bg-gray-50">
                        <h2 className="text-xl font-bold text-black mb-6">Quick Management</h2>
                        <div className="space-y-4">
                            <Link
                                to="/pools"
                                className="block w-full text-center py-3 bg-black text-white rounded text-sm font-bold hover:bg-gray-800 transition"
                            >
                                Browse New Pools
                            </Link>
                            <Link
                                to="/create"
                                className="block w-full text-center py-3 border border-black text-black rounded text-sm font-bold hover:bg-gray-50 transition"
                            >
                                Create New Pool
                            </Link>
                        </div>
                    </section>

                    <section className="border border-gray-200 rounded p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <h2 className="text-sm font-bold text-gray-600 uppercase tracking-widest">Protocol Status</h2>
                        </div>
                        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                            SatGuard Protocol is active on Stacks Mainnet. Your voting power is proportional to your sBTC contributions across all active pools.
                        </p>
                        <div className="text-xs font-mono bg-gray-100 p-2 rounded truncate text-gray-600">
                            {CONTRACT_ADDRESS}.{CONTRACT_NAME}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
