import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, PostConditionMode } from '@stacks/transactions';
import { network } from '../utils/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME, MICRO_STACKS } from '../utils/constants';

interface ContributeModalProps {
    poolId: number;
    minContribution: number;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ContributeModal({ poolId, minContribution, isOpen, onClose, onSuccess }: ContributeModalProps) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await openContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'contribute',
                functionArgs: [
                    uintCV(poolId),
                    uintCV(parseFloat(amount) * MICRO_STACKS),
                ],
                network,
                postConditionMode: PostConditionMode.Deny,
                onFinish: (data) => {
                    console.log('Finished:', data);
                    setLoading(false);
                    alert('Contribution transaction broadcasted!');
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
            alert('Failed to initiate contribution');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-black">Contribute to Pool</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contribution Amount (sBTC)
                        </label>
                        <input
                            type="number"
                            required
                            step="0.0001"
                            min={minContribution / MICRO_STACKS}
                            className="w-full px-4 py-3 border border-gray-200 rounded focus:border-stacks-orange outline-none"
                            placeholder="0.1"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <p className="mt-2 text-xs text-gray-500">
                            Minimum required: {(minContribution / MICRO_STACKS).toFixed(4)} sBTC
                        </p>
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
                            className={`flex-1 py-3 bg-stacks-orange text-white font-bold rounded hover:bg-orange-600 transition flex justify-center items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            ) : null}
                            {loading ? 'Confirming...' : 'Contribute'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
