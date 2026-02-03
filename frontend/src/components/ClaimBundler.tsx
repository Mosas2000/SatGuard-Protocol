import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, listCV, PostConditionMode } from '@stacks/transactions';
import { network } from '../utils/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../utils/constants';

interface ClaimBundlerProps {
    poolId: number;
    onBundleCreated?: () => void;
}

interface ClaimItem {
    id: number;
    amount: number;
    reason: string;
    selected: boolean;
}

export default function ClaimBundler({ poolId, onBundleCreated }: ClaimBundlerProps) {
    const [claims, setClaims] = useState<ClaimItem[]>([
        { id: 1, amount: 0.5, reason: 'Exchange hack incident #1', selected: false },
        { id: 2, amount: 0.3, reason: 'Exchange hack incident #2', selected: false },
        { id: 3, amount: 0.7, reason: 'Exchange hack incident #3', selected: false }
    ]);
    const [loading, setLoading] = useState(false);

    const toggleClaim = (id: number) => {
        setClaims(prev =>
            prev.map(claim =>
                claim.id === id ? { ...claim, selected: !claim.selected } : claim
            )
        );
    };

    const selectedClaims = claims.filter(c => c.selected);
    const totalAmount = selectedClaims.reduce((sum, c) => sum + c.amount, 0);

    const handleCreateBundle = async () => {
        if (selectedClaims.length < 2) {
            alert('Please select at least 2 claims to bundle');
            return;
        }

        setLoading(true);
        try {
            const claimIds = selectedClaims.map(c => uintCV(c.id));

            await openContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'create-claim-bundle',
                functionArgs: [
                    uintCV(poolId),
                    listCV(claimIds)
                ],
                network,
                postConditionMode: PostConditionMode.Deny,
                onFinish: (data) => {
                    console.log('Bundle created:', data);
                    setLoading(false);
                    alert('Claim bundle created successfully!');
                    onBundleCreated?.();
                },
                onCancel: () => {
                    setLoading(false);
                }
            });
        } catch (err) {
            console.error(err);
            setLoading(false);
            alert('Failed to create claim bundle');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Claim Bundler</h2>
            <p className="text-gray-600 mb-8">
                Combine multiple related claims into a single bundle for efficient processing
            </p>

            {/* Benefits */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3">✨ Benefits of Bundling</h3>
                <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
                    <li>Process multiple related claims together</li>
                    <li>Reduce voting overhead for similar incidents</li>
                    <li>Save on transaction fees</li>
                    <li>Streamline evidence submission</li>
                </ul>
            </div>

            {/* Available Claims */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Claims to Bundle</h3>
                <div className="space-y-3">
                    {claims.map(claim => (
                        <div
                            key={claim.id}
                            onClick={() => toggleClaim(claim.id)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition ${claim.selected
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <input
                                    type="checkbox"
                                    checked={claim.selected}
                                    onChange={() => { }}
                                    className="w-5 h-5"
                                />
                                <div className="flex-1">
                                    <div className="font-semibold text-gray-900">Claim #{claim.id}</div>
                                    <div className="text-sm text-gray-600">{claim.reason}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-gray-900">{claim.amount} sBTC</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bundle Summary */}
            {selectedClaims.length > 0 && (
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-orange-900 mb-4">Bundle Summary</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-sm text-orange-700">Selected Claims</div>
                            <div className="text-3xl font-bold text-orange-900">{selectedClaims.length}</div>
                        </div>
                        <div>
                            <div className="text-sm text-orange-700">Total Amount</div>
                            <div className="text-3xl font-bold text-orange-900">{totalAmount.toFixed(2)}</div>
                            <div className="text-xs text-orange-700">sBTC</div>
                        </div>
                        <div>
                            <div className="text-sm text-orange-700">Estimated Savings</div>
                            <div className="text-3xl font-bold text-orange-900">{(selectedClaims.length * 0.001).toFixed(3)}</div>
                            <div className="text-xs text-orange-700">STX in fees</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={handleCreateBundle}
                    disabled={selectedClaims.length < 2 || loading}
                    className={`flex-1 py-3 rounded-lg font-bold transition ${selectedClaims.length >= 2 && !loading
                            ? 'bg-orange-600 text-white hover:bg-orange-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {loading ? 'Creating Bundle...' : `Create Bundle (${selectedClaims.length} claims)`}
                </button>
            </div>

            {/* Guidelines */}
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">📋 Bundling Guidelines</h4>
                <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                    <li>Only bundle claims related to the same incident or event</li>
                    <li>All bundled claims will be voted on together</li>
                    <li>Minimum 2 claims required for bundling</li>
                    <li>Bundled claims share the same evidence and voting period</li>
                </ul>
            </div>
        </div>
    );
}
