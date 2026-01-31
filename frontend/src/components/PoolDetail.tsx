import { useParams } from 'react-router-dom';
import { usePool } from '../hooks/usePool';
import { formatAmount, getAddressUrl } from '../utils/network';
import { POOL_STATUS } from '../utils/constants';

export default function PoolDetail() {
    const { id } = useParams<{ id: string }>();
    const { pool, loading, error } = usePool(parseInt(id || '0'));

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stacks-orange"></div>
            </div>
        );
    }

    if (error || !pool) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 text-center text-red-500">
                Error: {error || 'Pool not found'}
            </div>
        );
    }

    const isActive = pool.status === POOL_STATUS.ACTIVE;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="flex justify-between items-start mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-black mb-2">Pool #{pool.poolId}</h1>
                    <p className="text-xl text-gray-600">{pool.coverageType}</p>
                </div>
                <span
                    className={`px-4 py-2 rounded font-bold ${isActive ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                >
                    {isActive ? 'Active' : 'Closed'}
                </span>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="border border-gray-200 p-8 rounded">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Pool Financials</h3>
                    <div className="space-y-6">
                        <div>
                            <p className="text-gray-600 text-sm">Total Funds Pooled</p>
                            <p className="text-3xl font-mono font-bold text-black">{formatAmount(pool.totalFunds)} sBTC</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600 text-sm">Min. Contribution</p>
                                <p className="font-mono font-bold">{formatAmount(pool.minContribution)} sBTC</p>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">Max Coverage</p>
                                <p className="font-mono font-bold">{formatAmount(pool.maxCoverage)} sBTC</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border border-gray-200 p-8 rounded">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Pool Info</h3>
                    <div className="space-y-6">
                        <div>
                            <p className="text-gray-600 text-sm">Created By</p>
                            <a
                                href={getAddressUrl(pool.creator)}
                                target="_blank"
                                rel="noreferrer"
                                className="font-mono text-black hover:text-stacks-orange transition truncate block"
                            >
                                {pool.creator}
                            </a>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Contributors</p>
                            <p className="font-bold text-black text-xl">{pool.contributorCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mb-12">
                <button className="flex-1 py-4 bg-stacks-orange text-white font-bold rounded hover:bg-orange-600 transition">
                    Contribute Funds
                </button>
                <button className="flex-1 py-4 border border-black text-black font-bold rounded hover:bg-black hover:text-white transition">
                    Submit Claim
                </button>
            </div>

            <div className="border-t border-gray-200 pt-12">
                <h2 className="text-2xl font-bold text-black mb-8">Claims & Activity</h2>
                <div className="text-center py-12 bg-gray-50 rounded">
                    <p className="text-gray-500">No recent activity for this pool.</p>
                </div>
            </div>
        </div>
    );
}
