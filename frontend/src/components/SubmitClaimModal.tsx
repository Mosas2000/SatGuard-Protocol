import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, utf8CV, PostConditionMode } from '@stacks/transactions';
import { network } from '../utils/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME, MICRO_STACKS } from '../utils/constants';

interface SubmitClaimModalProps {
    poolId: number;
    maxCoverage: number;
    totalFunds: number;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function SubmitClaimModal({
    poolId,
    maxCoverage,
    totalFunds,
    isOpen,
    onClose,
    onSuccess
}: SubmitClaimModalProps) {
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await openContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'submit-claim',
                functionArgs: [
                    uintCV(poolId),
                    uintCV(parseFloat(amount) * MICRO_STACKS),
                    utf8CV(reason),
                ],
                network,
                postConditionMode: PostConditionMode.Deny,
                onFinish: (data) => {
                    console.log('Finished:', data);
                    setLoading(false);
                    alert('Claim submission transaction broadcasted!');
                    onSuccess();
                    onClose();
                },
                onCancel: () => {
                    setLoading(false);
                    console.log('Cancelled');
                },
            });
        } catch (err) {
            console.error(err);
            setLoading(false);
            alert('Failed to initiate claim submission');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-lg w-full p-8 shadow-2xl my-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-black">Submit Insurance Claim</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Requested Amount (sBTC)
                        </label>
                        <input
                            type="number"
                            required
                            step="0.0001"
                            max={Math.min(maxCoverage, totalFunds) / MICRO_STACKS}
                            className="w-full px-4 py-3 border border-gray-200 rounded focus:border-stacks-orange outline-none"
                            placeholder="0.5"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <div className="mt-2 flex justify-between text-xs text-gray-500">
                            <span>Max allowed: {(maxCoverage / MICRO_STACKS).toFixed(4)} sBTC</span>
                            <span>Pool liquidity: {(totalFunds / MICRO_STACKS).toFixed(4)} sBTC</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reason / Evidence (Max 500 chars)
                        </label>
                        <textarea
                            required
                            maxLength={500}
                            rows={5}
                            className="w-full px-4 py-3 border border-gray-200 rounded focus:border-stacks-orange outline-none resize-none"
                            placeholder="Describe the incident, attach links to evidence, transaction hashes, etc."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>

                    <div className="bg-orange-50 p-4 rounded text-xs text-orange-800 border border-orange-100 italic">
                        <strong>Warning:</strong> Submitting false claims may result in loss of voting power or blacklisting by the community. Claims are subject to governance voting.
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border border-gray-200 text-gray-700 rounded hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 py-3 bg-black text-white font-bold rounded hover:bg-gray-800 transition flex justify-center items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            ) : null}
                            {loading ? 'Submitting...' : 'Submit Claim'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
