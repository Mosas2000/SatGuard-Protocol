import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, utf8CV, PostConditionMode } from '@stacks/transactions';
import { network } from '../utils/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../utils/constants';

interface ClaimAppealProps {
    claimId: number;
    originalAmount: number;
    rejectionReason: string;
    onAppealSubmitted?: () => void;
}

export default function ClaimAppeal({ claimId, originalAmount, rejectionReason, onAppealSubmitted }: ClaimAppealProps) {
    const [appealReason, setAppealReason] = useState('');
    const [newEvidence, setNewEvidence] = useState('');
    const [requestedAmount, setRequestedAmount] = useState(originalAmount);
    const [loading, setLoading] = useState(false);

    const handleSubmitAppeal = async () => {
        if (!appealReason.trim()) {
            alert('Please provide a reason for your appeal');
            return;
        }

        setLoading(true);
        try {
            await openContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'submit-appeal',
                functionArgs: [
                    uintCV(claimId),
                    utf8CV(appealReason),
                    uintCV(requestedAmount)
                ],
                network,
                postConditionMode: PostConditionMode.Deny,
                onFinish: (data) => {
                    console.log('Appeal submitted:', data);
                    setLoading(false);
                    alert('Appeal submitted successfully!');
                    onAppealSubmitted?.();
                },
                onCancel: () => {
                    setLoading(false);
                }
            });
        } catch (err) {
            console.error(err);
            setLoading(false);
            alert('Failed to submit appeal');
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Appeal Rejected Claim</h2>
            <p className="text-gray-600 mb-8">Submit an appeal if you believe your claim was unfairly rejected</p>

            {/* Original Claim Info */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-red-900 mb-3">Original Claim Details</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-red-700">Claim ID:</span>
                        <span className="font-semibold text-red-900">#{claimId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-red-700">Original Amount:</span>
                        <span className="font-semibold text-red-900">{originalAmount} sBTC</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-red-700">Status:</span>
                        <span className="font-semibold text-red-900">REJECTED</span>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-red-300">
                    <div className="text-sm text-red-700 mb-1">Rejection Reason:</div>
                    <div className="text-sm text-red-900 bg-white rounded p-3">{rejectionReason}</div>
                </div>
            </div>

            {/* Appeal Form */}
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Appeal Reason *
                    </label>
                    <textarea
                        rows={6}
                        value={appealReason}
                        onChange={(e) => setAppealReason(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 outline-none"
                        placeholder="Explain why you believe the rejection was incorrect. Address the rejection reason and provide additional context..."
                    />
                    <div className="text-xs text-gray-500 mt-1">
                        {appealReason.length}/1000 characters
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Evidence (Optional)
                    </label>
                    <textarea
                        rows={4}
                        value={newEvidence}
                        onChange={(e) => setNewEvidence(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 outline-none"
                        placeholder="Provide links to new evidence, transaction hashes, or additional documentation..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Requested Amount (sBTC)
                    </label>
                    <input
                        type="number"
                        step="0.0001"
                        value={requestedAmount}
                        onChange={(e) => setRequestedAmount(parseFloat(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 outline-none"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                        You can request the same or a different amount
                    </div>
                </div>

                {/* Appeal Guidelines */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">📋 Appeal Guidelines</h4>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                        <li>Clearly address each point in the rejection reason</li>
                        <li>Provide new evidence that wasn't available during initial review</li>
                        <li>Be specific and factual in your explanation</li>
                        <li>Appeals are reviewed by a different set of voters</li>
                        <li>You have one appeal opportunity per claim</li>
                    </ul>
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmitAppeal}
                    disabled={loading || !appealReason.trim()}
                    className={`w-full py-3 rounded-lg font-bold transition ${loading || !appealReason.trim()
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-orange-600 text-white hover:bg-orange-700'
                        }`}
                >
                    {loading ? 'Submitting Appeal...' : 'Submit Appeal'}
                </button>
            </div>

            {/* Warning */}
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Important</h4>
                <p className="text-sm text-yellow-800">
                    Appeals go through the same community voting process. Frivolous appeals may negatively impact your reputation.
                    Make sure you have valid grounds for appeal before submitting.
                </p>
            </div>
        </div>
    );
}
