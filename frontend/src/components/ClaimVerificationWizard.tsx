import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, utf8CV, PostConditionMode } from '@stacks/transactions';
import { network } from '../utils/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME, MICRO_STACKS } from '../utils/constants';

interface ClaimVerificationWizardProps {
    poolId: number;
    onComplete?: () => void;
}

type VerificationStage = 'submission' | 'evidence' | 'review' | 'voting' | 'complete';

interface ClaimData {
    amount: number;
    reason: string;
    evidence: string[];
    category: string;
    urgency: 'low' | 'medium' | 'high';
}

export default function ClaimVerificationWizard({ poolId, onComplete }: ClaimVerificationWizardProps) {
    const [currentStage, setCurrentStage] = useState<VerificationStage>('submission');
    const [claimData, setClaimData] = useState<ClaimData>({
        amount: 0,
        reason: '',
        evidence: [],
        category: '',
        urgency: 'medium'
    });
    const [loading, setLoading] = useState(false);

    const stages: { id: VerificationStage; title: string; description: string }[] = [
        { id: 'submission', title: 'Claim Submission', description: 'Provide basic claim details' },
        { id: 'evidence', title: 'Evidence Upload', description: 'Submit supporting documentation' },
        { id: 'review', title: 'Initial Review', description: 'Automated validation checks' },
        { id: 'voting', title: 'Community Voting', description: 'Governance review period' },
        { id: 'complete', title: 'Complete', description: 'Claim submitted successfully' }
    ];

    const currentStageIndex = stages.findIndex(s => s.id === currentStage);

    const handleNext = () => {
        const nextIndex = currentStageIndex + 1;
        if (nextIndex < stages.length) {
            setCurrentStage(stages[nextIndex].id);
        }
    };

    const handleBack = () => {
        const prevIndex = currentStageIndex - 1;
        if (prevIndex >= 0) {
            setCurrentStage(stages[prevIndex].id);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await openContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'submit-claim',
                functionArgs: [
                    uintCV(poolId),
                    uintCV(claimData.amount * MICRO_STACKS),
                    utf8CV(claimData.reason)
                ],
                network,
                postConditionMode: PostConditionMode.Deny,
                onFinish: (data) => {
                    console.log('Claim submitted:', data);
                    setLoading(false);
                    setCurrentStage('complete');
                },
                onCancel: () => {
                    setLoading(false);
                }
            });
        } catch (err) {
            console.error(err);
            setLoading(false);
            alert('Failed to submit claim');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Multi-Stage Claim Verification</h2>

            {/* Progress Indicator */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {stages.map((stage, index) => (
                        <div key={stage.id} className="flex-1 flex items-center">
                            <div className="flex flex-col items-center flex-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${index <= currentStageIndex
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-gray-300 text-gray-600'
                                    }`}>
                                    {index < currentStageIndex ? '✓' : index + 1}
                                </div>
                                <div className="text-xs mt-2 text-center font-medium">{stage.title}</div>
                            </div>
                            {index < stages.length - 1 && (
                                <div className={`h-1 flex-1 ${index < currentStageIndex ? 'bg-orange-600' : 'bg-gray-300'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Stage Content */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                {currentStage === 'submission' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-900">Claim Submission</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Claim Amount (sBTC)</label>
                            <input
                                type="number"
                                step="0.0001"
                                value={claimData.amount}
                                onChange={(e) => setClaimData({ ...claimData, amount: parseFloat(e.target.value) })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                value={claimData.category}
                                onChange={(e) => setClaimData({ ...claimData, category: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 outline-none"
                            >
                                <option value="">Select category</option>
                                <option value="exchange-hack">Exchange Hack</option>
                                <option value="rug-pull">Rug Pull</option>
                                <option value="smart-contract">Smart Contract Exploit</option>
                                <option value="nft-theft">NFT Theft</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                            <div className="flex gap-4">
                                {(['low', 'medium', 'high'] as const).map(level => (
                                    <label key={level} className="flex items-center">
                                        <input
                                            type="radio"
                                            checked={claimData.urgency === level}
                                            onChange={() => setClaimData({ ...claimData, urgency: level })}
                                            className="mr-2"
                                        />
                                        <span className="capitalize">{level}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                            <textarea
                                rows={4}
                                value={claimData.reason}
                                onChange={(e) => setClaimData({ ...claimData, reason: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 outline-none"
                                placeholder="Describe the incident..."
                            />
                        </div>
                    </div>
                )}

                {currentStage === 'evidence' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-900">Evidence Upload</h3>
                        <p className="text-gray-600">Upload supporting documents, screenshots, or transaction hashes</p>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <div className="text-4xl mb-4">📎</div>
                            <p className="text-gray-600 mb-2">Drag and drop files here or click to browse</p>
                            <p className="text-sm text-gray-500">Supported: PDF, PNG, JPG, TXT (Max 10MB)</p>
                        </div>
                        {claimData.evidence.length > 0 && (
                            <div className="space-y-2">
                                {claimData.evidence.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                        <span className="text-sm">{file}</span>
                                        <button className="text-red-600 text-sm">Remove</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {currentStage === 'review' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-900">Initial Review</h3>
                        <div className="space-y-3">
                            <CheckItem label="Claim amount within pool limits" status="pass" />
                            <CheckItem label="Evidence provided" status="pass" />
                            <CheckItem label="No duplicate claims" status="pass" />
                            <CheckItem label="Contributor in good standing" status="pass" />
                            <CheckItem label="Fraud detection check" status="pass" />
                        </div>
                    </div>
                )}

                {currentStage === 'voting' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-900">Community Voting</h3>
                        <p className="text-gray-600">Your claim will now enter the community voting period (14 days)</p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                                <li>Pool contributors will review your claim</li>
                                <li>Voting power is weighted by contribution amount</li>
                                <li>60% approval required for payout</li>
                                <li>You'll receive notifications on voting progress</li>
                            </ul>
                        </div>
                    </div>
                )}

                {currentStage === 'complete' && (
                    <div className="text-center space-y-6">
                        <div className="text-6xl">✅</div>
                        <h3 className="text-2xl font-bold text-gray-900">Claim Submitted Successfully!</h3>
                        <p className="text-gray-600">Your claim has been submitted and is now under review.</p>
                        <div className="bg-gray-50 rounded-lg p-4 text-left">
                            <div className="text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Claim ID:</span>
                                    <span className="font-semibold">#12345</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Amount:</span>
                                    <span className="font-semibold">{claimData.amount} sBTC</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className="font-semibold text-orange-600">Pending Review</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            {currentStage !== 'complete' && (
                <div className="flex gap-4">
                    <button
                        onClick={handleBack}
                        disabled={currentStageIndex === 0}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Back
                    </button>
                    <button
                        onClick={currentStage === 'voting' ? handleSubmit : handleNext}
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : currentStage === 'voting' ? 'Submit Claim' : 'Continue'}
                    </button>
                </div>
            )}
        </div>
    );
}

function CheckItem({ label, status }: { label: string; status: 'pass' | 'fail' | 'pending' }) {
    const icons = {
        pass: '✅',
        fail: '❌',
        pending: '⏳'
    };
    return (
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
            <span className="text-sm text-gray-700">{label}</span>
            <span className="text-lg">{icons[status]}</span>
        </div>
    );
}
