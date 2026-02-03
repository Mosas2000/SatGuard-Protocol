import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, boolCV, PostConditionMode } from '@stacks/transactions';
import { network } from '../utils/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../utils/constants';

interface EmergencyPauseControlProps {
    poolId: number;
    isPaused: boolean;
    isOwner: boolean;
    onSuccess?: () => void;
}

export default function EmergencyPauseControl({ poolId, isPaused, isOwner, onSuccess }: EmergencyPauseControlProps) {
    const [loading, setLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [reason, setReason] = useState('');

    const handleTogglePause = async () => {
        if (!reason.trim()) {
            alert('Please provide a reason for this action');
            return;
        }

        setLoading(true);
        try {
            await openContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'toggle-emergency-pause',
                functionArgs: [uintCV(poolId), boolCV(!isPaused)],
                network,
                postConditionMode: PostConditionMode.Deny,
                onFinish: (data) => {
                    console.log('Pause toggled:', data);
                    setLoading(false);
                    alert(`Pool ${isPaused ? 'resumed' : 'paused'} successfully!`);
                    setShowConfirmation(false);
                    setReason('');
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
            alert('Failed to toggle pause state');
        }
    };

    if (!isOwner) {
        return (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                <p className="text-sm text-gray-600">Only pool owner can access emergency controls</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Emergency Pause Control</h3>
                    <p className="text-sm text-gray-600">Pool #{poolId}</p>
                </div>
                <div className={`px-4 py-2 rounded-full font-semibold ${isPaused ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {isPaused ? '⏸ PAUSED' : '▶ ACTIVE'}
                </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-red-900 mb-2">🚨 Emergency Controls</h4>
                <p className="text-sm text-red-800 mb-3">
                    Use emergency pause to temporarily halt all pool operations in case of:
                </p>
                <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
                    <li>Security vulnerabilities detected</li>
                    <li>Suspicious claim activity</li>
                    <li>Smart contract issues</li>
                    <li>Regulatory compliance requirements</li>
                </ul>
            </div>

            {isPaused && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Pool Currently Paused</h4>
                    <p className="text-sm text-yellow-800">
                        All contributions, claims, and withdrawals are currently disabled. Resume operations when the issue is resolved.
                    </p>
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reason for {isPaused ? 'Resuming' : 'Pausing'} *
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 outline-none"
                        placeholder={`Explain why you are ${isPaused ? 'resuming' : 'pausing'} this pool...`}
                    />
                </div>

                <button
                    onClick={() => setShowConfirmation(true)}
                    disabled={loading || !reason.trim()}
                    className={`w-full py-3 rounded-lg font-bold transition ${isPaused
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        } ${loading || !reason.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Processing...' : isPaused ? '▶ Resume Pool Operations' : '⏸ Pause Pool Operations'}
                </button>
            </div>

            {/* Pause History */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Pause History</h4>
                <div className="space-y-2">
                    <PauseHistoryItem
                        action="Paused"
                        reason="Security audit in progress"
                        timestamp="2024-02-01 14:30"
                        user="SP2...ABC"
                    />
                    <PauseHistoryItem
                        action="Resumed"
                        reason="Audit completed successfully"
                        timestamp="2024-02-01 18:45"
                        user="SP2...ABC"
                    />
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Confirm {isPaused ? 'Resume' : 'Pause'}
                        </h3>
                        <p className="text-gray-700 mb-4">
                            Are you sure you want to {isPaused ? 'resume' : 'pause'} pool operations?
                        </p>
                        <div className="bg-gray-50 rounded-lg p-3 mb-6">
                            <div className="text-sm font-medium text-gray-700 mb-1">Reason:</div>
                            <div className="text-sm text-gray-900">{reason}</div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleTogglePause}
                                className={`flex-1 py-2 text-white rounded-lg ${isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                                    }`}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function PauseHistoryItem({ action, reason, timestamp, user }: { action: string; reason: string; timestamp: string; user: string }) {
    return (
        <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <div className="flex justify-between items-start mb-1">
                <span className={`font-semibold ${action === 'Paused' ? 'text-red-700' : 'text-green-700'}`}>
                    {action}
                </span>
                <span className="text-gray-500 text-xs">{timestamp}</span>
            </div>
            <div className="text-gray-700 mb-1">{reason}</div>
            <div className="text-gray-500 text-xs">By: {user}</div>
        </div>
    );
}
