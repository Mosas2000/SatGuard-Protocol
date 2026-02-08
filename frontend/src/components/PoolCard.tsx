import { Link } from 'react-router-dom';
import type { Pool } from '../types';
import { formatAmount, POOL_STATUS } from '../utils/constants';

interface PoolCardProps {
    pool: Pool;
}

export default function PoolCard({ pool }: PoolCardProps) {
    const statusColors = {
        [POOL_STATUS.ACTIVE]: 'bg-green-100 text-green-800',
        [POOL_STATUS.CLOSED]: 'bg-gray-100 text-gray-800',
    };

    const statusText = {
        [POOL_STATUS.ACTIVE]: 'Active',
        [POOL_STATUS.CLOSED]: 'Closed',
    };

    return (
        <Link
            to={`/pool/${pool.poolId}`}
            className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-black mb-1">
                        {pool.coverageType}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[pool.status] || 'bg-gray-100 text-gray-800'}`}>
                        {statusText[pool.status] || 'Unknown'}
                    </span>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Pool #{pool.poolId}</p>
                </div>
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Funds</span>
                    <span className="font-semibold text-stacks-orange">
                        {formatAmount(pool.totalFunds)} STX
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Min Contribution</span>
                    <span className="font-medium text-black">
                        {formatAmount(pool.minContribution)} STX
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Max Coverage</span>
                    <span className="font-medium text-black">
                        {formatAmount(pool.maxCoverage)} STX
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Contributors</span>
                    <span className="font-medium text-black">
                        {pool.contributorCount}
                    </span>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                    Created: {new Date(pool.createdAt * 1000).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-400 truncate mt-1">
                    Creator: {pool.creator}
                </p>
            </div>

            <div className="mt-4">
                <button className="w-full bg-stacks-orange text-white py-2 rounded font-medium hover:bg-opacity-90 transition-colors">
                    View Details
                </button>
            </div>
        </Link>
    );
}
