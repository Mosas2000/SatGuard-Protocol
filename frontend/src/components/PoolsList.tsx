import { useState } from 'react';
import { usePools } from '../hooks/usePools';
import PoolCard from './PoolCard';
import { POOL_STATUS } from '../utils/constants';
import { exportPoolsToCSV, exportPoolsToJSON } from '../utils/exportUtils';

export default function PoolsList() {
    const { pools, loading, error } = usePools();
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<number | 'all'>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'funds' | 'contributors'>('newest');

    const filteredPools = pools
        .filter((pool) => {
            const matchesSearch = pool.coverageType.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = filterStatus === 'all' || pool.status === filterStatus;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return b.createdAt - a.createdAt;
                case 'oldest':
                    return a.createdAt - b.createdAt;
                case 'funds':
                    return b.totalFunds - a.totalFunds;
                case 'contributors':
                    return b.contributorCount - a.contributorCount;
                default:
                    return 0;
            }
        });

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stacks-orange"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 text-center text-red-500">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Total Pools</p>
                    <p className="text-2xl font-bold text-black">{pools.length}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Active Pools</p>
                    <p className="text-2xl font-bold text-green-600">
                        {pools.filter(p => p.status === POOL_STATUS.ACTIVE).length}
                    </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Total Funds</p>
                    <p className="text-2xl font-bold text-stacks-orange">
                        {(pools.reduce((sum, p) => sum + p.totalFunds, 0) / 1000000).toFixed(2)} STX
                    </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Total Contributors</p>
                    <p className="text-2xl font-bold text-purple-600">
                        {pools.reduce((sum, p) => sum + p.contributorCount, 0)}
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-4xl font-bold text-black">Insurance Pools</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => exportPoolsToCSV(filteredPools)}
                            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border border-gray-300"
                            title="Export to CSV"
                        >
                            📊 CSV
                        </button>
                        <button
                            onClick={() => exportPoolsToJSON(filteredPools)}
                            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border border-gray-300"
                            title="Export to JSON"
                        >
                            📄 JSON
                        </button>
                    </div>
                </div>
                <div className="flex gap-4 w-full md:w-auto flex-wrap">
                    <input
                        type="text"
                        placeholder="Search pools..."
                        className="px-4 py-2 border border-gray-200 rounded focus:border-stacks-orange outline-none w-full md:w-64"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="px-4 py-2 border border-gray-200 rounded focus:border-stacks-orange outline-none"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                    >
                        <option value="all">All Status</option>
                        <option value={POOL_STATUS.ACTIVE}>Active</option>
                        <option value={POOL_STATUS.CLOSED}>Closed</option>
                    </select>
                    <select
                        className="px-4 py-2 border border-gray-200 rounded focus:border-stacks-orange outline-none"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="funds">Highest Funds</option>
                        <option value="contributors">Most Contributors</option>
                    </select>
                </div>
            </div>

            {filteredPools.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPools.map((pool) => (
                        <PoolCard key={pool.poolId} pool={pool} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border border-dashed border-gray-300 rounded">
                    <p className="text-gray-500">No pools found matching your criteria.</p>
                </div>
            )}
        </div>
    );
}
