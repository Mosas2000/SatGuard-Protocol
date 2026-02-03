import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, PostConditionMode } from '@stacks/transactions';
import { network } from '../utils/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../utils/constants';

interface PoolMergerProps {
    onSuccess?: () => void;
}

interface PoolInfo {
    id: number;
    name: string;
    tvl: number;
    contributors: number;
    utilization: number;
}

export default function PoolMerger({ onSuccess }: PoolMergerProps) {
    const [sourcePool, setSourcePool] = useState<number | null>(null);
    const [targetPool, setTargetPool] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Mock pool data - would be fetched from contract
    const availablePools: PoolInfo[] = [
        { id: 1, name: 'Exchange Hack Insurance', tvl: 50, contributors: 15, utilization: 45 },
        { id: 2, name: 'Rug Pull Protection', tvl: 30, contributors: 8, utilization: 60 },
        { id: 3, name: 'Smart Contract Risk', tvl: 25, contributors: 12, utilization: 35 }
    ];

    const handleMerge = async () => {
        if (!sourcePool || !targetPool) return;

        setLoading(true);
        try {
            await openContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'merge-pools',
                functionArgs: [uintCV(sourcePool), uintCV(targetPool)],
                network,
                postConditionMode: PostConditionMode.Deny,
                onFinish: (data) => {
                    console.log('Pools merged:', data);
                    setLoading(false);
                    alert('Pools successfully merged!');
                    setShowConfirmation(false);
                    onSuccess?.();
                },
                onCancel: () => {
                    setLoading(false);
                    console.log('Cancelled');
                }
            });
        } catch (err) {
            console.error(err);
            setLoading(false);
            alert('Failed to merge pools');
        }
    };

    const source = availablePools.find(p => p.id === sourcePool);
    const target = availablePools.find(p => p.id === targetPool);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Pool Merger Tool</h2>
            <p className="text-gray-600 mb-8">Combine two pools to increase liquidity and efficiency</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Source Pool Selection */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Source Pool (Will be merged into target)</h3>
                    <div className="space-y-3">
                        {availablePools.map(pool => (
                            <div
                                key={pool.id}
                                onClick={() => setSourcePool(pool.id)}
                                className={`p-4 border-2 rounded-lg cursor-pointer transition ${sourcePool === pool.id
                                        ? 'border-orange-500 bg-orange-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    } ${targetPool === pool.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className="font-semibold text-gray-900">{pool.name}</div>
                                <div className="text-sm text-gray-600 mt-1">
                                    TVL: {pool.tvl} STX • {pool.contributors} contributors
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Target Pool Selection */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Target Pool (Will receive merged funds)</h3>
                    <div className="space-y-3">
                        {availablePools.map(pool => (
                            <div
                                key={pool.id}
                                onClick={() => setTargetPool(pool.id)}
                                className={`p-4 border-2 rounded-lg cursor-pointer transition ${targetPool === pool.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    } ${sourcePool === pool.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className="font-semibold text-gray-900">{pool.name}</div>
                                <div className="text-sm text-gray-600 mt-1">
                                    TVL: {pool.tvl} STX • {pool.contributors} contributors
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Merge Preview */}
            {source && target && (
                <div className="bg-gradient-to-r from-orange-50 to-blue-50 border border-gray-300 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Merge Preview</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-sm text-gray-600 mb-1">Combined TVL</div>
                            <div className="text-2xl font-bold text-gray-900">{source.tvl + target.tvl} STX</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600 mb-1">Total Contributors</div>
                            <div className="text-2xl font-bold text-gray-900">{source.contributors + target.contributors}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600 mb-1">New Utilization</div>
                            <div className="text-2xl font-bold text-gray-900">
                                {Math.round(((source.tvl * source.utilization + target.tvl * target.utilization) / (source.tvl + target.tvl)))}%
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Warning */}
            {source && target && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Important Notice</h4>
                    <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                        <li>Source pool will be permanently closed after merge</li>
                        <li>All contributors will be migrated to target pool</li>
                        <li>Claims from source pool will be transferred</li>
                        <li>This action cannot be undone</li>
                    </ul>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={() => setShowConfirmation(true)}
                    disabled={!source || !target || loading}
                    className={`flex-1 py-3 rounded-lg font-bold transition ${source && target && !loading
                            ? 'bg-orange-600 text-white hover:bg-orange-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {loading ? 'Merging...' : 'Merge Pools'}
                </button>
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Pool Merge</h3>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to merge <strong>{source?.name}</strong> into <strong>{target?.name}</strong>?
                            This action is permanent and cannot be reversed.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleMerge}
                                className="flex-1 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                            >
                                Confirm Merge
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
