import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, utf8CV, PostConditionMode } from '@stacks/transactions';
import { network } from '../utils/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../utils/constants';

interface ClaimDisputeProps {
    claimId: number;
    currentStatus: 'approved' | 'rejected' | 'pending';
    onDisputeSubmitted?: () => void;
}

type DisputeReason = 'evidence' | 'fraud' | 'amount' | 'procedure' | 'other';

export default function ClaimDispute({ claimId, currentStatus, onDisputeSubmitted }: ClaimDisputeProps) {
    const [disputeReason, setDisputeReason] = useState<DisputeReason>('evidence');
    const [description, setDescription] = useState('');
    const [supportingEvidence, setSupportingEvidence] = useState('');
    const [loading, setLoading] = useState(false);

    const disputeReasons: { value: DisputeReason; label: string; description: string }[] = [
        {
            value: 'evidence',
            label: 'Insufficient Evidence',
            description: 'The claim lacks adequate supporting documentation'
        },
        {
            value: 'fraud',
            label: 'Suspected Fraud',
            description: 'Evidence suggests fraudulent activity'
        },
        {
            value: 'amount',
            label: 'Incorrect Amount',
            description: 'The claimed amount does not match the actual loss'
        },
        {
            value: 'procedure',
            label: 'Procedural Violation',
            description: 'Claim process was not followed correctly'
        },
        {
            value: 'other',
            label: 'Other',
            description: 'Other valid reason for dispute'
        }
    ];

    const handleSubmitDispute = async () => {
        if (!description.trim()) {
            alert('Please provide a detailed description');
            return;
        }

        setLoading(true);
        try {
            await openContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'submit-dispute',
                functionArgs: [
                    uintCV(claimId),
                    utf8CV(disputeReason),
                    utf8CV(description)
                ],
                network,
                postConditionMode: PostConditionMode.Deny,
                onFinish: (data) => {
                    console.log('Dispute submitted:', data);
                    setLoading(false);
                    alert('Dispute submitted successfully!');
                    onDisputeSubmitted?.();
                },
                onCancel: () => {
                    setLoading(false);
                }
            });
        } catch (err) {
            console.error(err);
            setLoading(false);
            alert('Failed to submit dispute');
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Dispute Claim Decision</h2>
            <p className="text-gray-600 mb-8">
                Challenge the current claim decision through formal dispute resolution
            </p>

            {/* Claim Status */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Current Claim Status</h3>
                <div className="flex justify-between items-center">
                    <span className="text-gray-700">Claim #{claimId}</span>
                    <span className={`px-4 py-2 rounded-full font-semibold ${currentStatus === 'approved' ? 'bg-green-100 text-green-800' :
                            currentStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                        }`}>
                        {currentStatus.toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Dispute Reason Selection */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Dispute Reason</h3>
                <div className="space-y-3">
                    {disputeReasons.map(reason => (
                        <div
                            key={reason.value}
                            onClick={() => setDisputeReason(reason.value)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition ${disputeReason === reason.value
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <input
                                    type="radio"
                                    checked={disputeReason === reason.value}
                                    onChange={() => { }}
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <div className="font-semibold text-gray-900">{reason.label}</div>
                                    <div className="text-sm text-gray-600">{reason.description}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detailed Description */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Description *</h3>
                <textarea
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 outline-none"
                    placeholder="Provide a detailed explanation of your dispute. Include specific facts, evidence references, and reasoning..."
                />
                <div className="text-xs text-gray-500 mt-1">
                    {description.length}/1000 characters
                </div>
            </div>

            {/* Supporting Evidence */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Supporting Evidence (Optional)</h3>
                <textarea
                    rows={4}
                    value={supportingEvidence}
                    onChange={(e) => setSupportingEvidence(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 outline-none"
                    placeholder="Links to additional evidence, transaction hashes, expert opinions, etc..."
                />
            </div>

            {/* Dispute Process Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">📋 Dispute Resolution Process</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Dispute is submitted and reviewed by moderators</li>
                    <li>Both parties present their case</li>
                    <li>Community votes on the dispute resolution</li>
                    <li>Final decision is binding and cannot be appealed</li>
                </ol>
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmitDispute}
                disabled={loading || !description.trim()}
                className={`w-full py-3 rounded-lg font-bold transition ${loading || !description.trim()
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                    }`}
            >
                {loading ? 'Submitting Dispute...' : 'Submit Dispute'}
            </button>

            {/* Warning */}
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Important</h4>
                <p className="text-sm text-yellow-800">
                    Disputes should only be filed for legitimate concerns. Frivolous disputes may result in penalties.
                    Make sure you have valid grounds and supporting evidence before proceeding.
                </p>
            </div>
        </div>
    );
}
