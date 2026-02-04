import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, utf8CV, boolCV, PostConditionMode } from '@stacks/transactions';
import { network } from '../utils/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../utils/constants';

interface EmergencyGovernanceProps {
    poolId: number;
    isOwner: boolean;
    onActionExecuted?: () => void;
}

type EmergencyAction = 'pause' | 'unpause' | 'freeze-withdrawals' | 'emergency-withdrawal' | 'force-close';

export default function EmergencyGovernance({ poolId, isOwner, onActionExecuted }: EmergencyGovernanceProps) {
    const [selectedAction, setSelectedAction] = useState<EmergencyAction>('pause');
    const [reason, setReason] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [loading, setLoading] = useState(false);

    const actions: { value: EmergencyAction; label: string; description: string; severity: 'high' | 'critical' }[] = [
        {
            value: 'pause',
            label: 'Pause Pool Operations',
            description: 'Temporarily halt all pool activities including contributions and claims',
            severity: 'high'
        },
        {
            value: 'unpause',
            label: 'Resume Pool Operations',
            description: 'Resume normal pool operations after a pause',
            severity: 'high'
        },
        {
            value: 'freeze-withdrawals',
            label: 'Freeze Withdrawals',
            description: 'Prevent all withdrawals while allowing other operations',
            severity: 'critical'
        },
        {
            value: 'emergency-withdrawal',
            label: 'Emergency Withdrawal',
            description: 'Execute emergency withdrawal of pool funds to safe address',
            severity: 'critical'
        },
        {
            value: 'force-close',
            label: 'Force Close Pool',
            description: 'Immediately close the pool and return funds to contributors',
            severity: 'critical'
        }
    ];

    const handleExecute = async () => {
        if (!reason.trim()) {
            alert('Please provide a reason for this emergency action');
            return;
        }

        setLoading(true);
        try {
            await openContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'emergency-action',
                functionArgs: [
                    uintCV(poolId),
                    utf8CV(selectedAction),
                    utf8CV(reason)
                ],
                network,
                postConditionMode: PostConditionMode.Deny,
                onFinish: (data) => {
                    console.log('Emergency action executed:', data);
                    setLoading(false);
                    setShowConfirmation(false);
                    alert('Emergency action executed successfully!');
                    onActionExecuted?.();
                },
                onCancel: () => {
                    setLoading(false);
                }
            });
        } catch (err) {
            console.error(err);
            setLoading(false);
            alert('Failed to execute emergency action');
        }
    };

    if (!isOwner) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-4">🔒</div>
                    <h3 className="font-bold text-red-900 mb-2">Access Denied</h3>
                    <p className="text-red-800">Only pool owners can access emergency governance controls</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Emergency Governance</h2>
            <p className="text-gray-600 mb-8">Execute emergency actions to protect the pool</p>

            {/* Warning Banner */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-red-900 mb-2">⚠️ Critical Warning</h4>
                <p className="text-sm text-red-800">
                    Emergency actions should only be used in critical situations. All actions are logged and subject to community review.
                </p>
            </div>

            {/* Action Selection */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Emergency Action</h3>
                <div className="space-y-3">
                    {actions.map(action => (
                        <div
                            key={action.value}
                            onClick={() => setSelectedAction(action.value)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition ${selectedAction === action.value
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="font-bold text-gray-900">{action.label}</div>
                                    <div className="text-sm text-gray-600 mt-1">{action.description}</div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${action.severity === 'critical'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-orange-100 text-orange-800'
                                    }`}>
                                    {action.severity.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reason Input */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reason for Emergency Action *</h3>
                <textarea
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 outline-none"
                    placeholder="Provide a detailed explanation for this emergency action..."
                />
            </div>

            {/* Execute Button */}
            <button
                onClick={() => setShowConfirmation(true)}
                disabled={!reason.trim()}
                className={`w-full py-3 rounded-lg font-bold transition ${reason.trim()
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
            >
                Execute Emergency Action
            </button>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-red-900 mb-4">Confirm Emergency Action</h3>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to execute: <strong>{actions.find(a => a.value === selectedAction)?.label}</strong>?
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleExecute}
                                disabled={loading}
                                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                {loading ? 'Executing...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
