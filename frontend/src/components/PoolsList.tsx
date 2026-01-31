import { useState } from 'react';
import { usePools } from '../hooks/usePools';
import PoolCard from './PoolCard';
import { POOL_STATUS } from '../utils/constants';

export default function PoolsList() {
    const { pools, loading, error } = usePools();
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<number | 'all'>('all');

    const filteredPools = pools.filter((pool) => {
        const matchesSearch = pool.coverageType.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === 'all' || pool.status === filterStatus;
        return matchesSearch && matchesStatus;
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
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <h1 className="text-4xl font-bold text-black">Insurance Pools</h1>
                <div className="flex gap-4 w-full md:w-auto">
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
