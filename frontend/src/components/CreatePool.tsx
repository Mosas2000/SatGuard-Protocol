import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { openContractCall } from '@stacks/connect';
import { stringAsciiCV, uintCV, PostConditionMode } from '@stacks/transactions';
import { network } from '../utils/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME, MICRO_STACKS } from '../utils/constants';

export default function CreatePool() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        coverageType: '',
        minContribution: '',
        maxCoverage: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await openContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'create-pool',
                functionArgs: [
                    stringAsciiCV(formData.coverageType),
                    uintCV(parseFloat(formData.minContribution) * MICRO_STACKS),
                    uintCV(parseFloat(formData.maxCoverage) * MICRO_STACKS),
                ],
                network,
                postConditionMode: PostConditionMode.Deny,
                onFinish: (data) => {
                    console.log('Finished:', data);
                    setLoading(false);
                    alert('Pool creation transaction broadcasted!');
                    navigate('/pools');
                },
                onCancel: () => {
                    setLoading(false);
                    console.log('Cancelled');
                },
            });
        } catch (err) {
            console.error(err);
            setLoading(false);
            alert('Failed to initiate pool creation');
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-black mb-8">Create New Insurance Pool</h1>

            <form onSubmit={handleSubmit} className="space-y-6 border border-gray-200 p-8 rounded shadow-sm">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Coverage Type (e.g., Exchange Hack, Rug Pull)
                    </label>
                    <input
                        type="text"
                        required
                        maxLength={50}
                        className="w-full px-4 py-3 border border-gray-200 rounded focus:border-stacks-orange outline-none"
                        placeholder="Describe what this pool covers"
                        value={formData.coverageType}
                        onChange={(e) => setFormData({ ...formData, coverageType: e.target.value })}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Minimum Contribution (sBTC)
                        </label>
                        <input
                            type="number"
                            required
                            step="0.0001"
                            min="0.000001"
                            className="w-full px-4 py-3 border border-gray-200 rounded focus:border-stacks-orange outline-none"
                            placeholder="0.01"
                            value={formData.minContribution}
                            onChange={(e) => setFormData({ ...formData, minContribution: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Maximum Coverage (sBTC)
                        </label>
                        <input
                            type="number"
                            required
                            step="0.1"
                            min="0.01"
                            className="w-full px-4 py-3 border border-gray-200 rounded focus:border-stacks-orange outline-none"
                            placeholder="10.0"
                            value={formData.maxCoverage}
                            onChange={(e) => setFormData({ ...formData, maxCoverage: e.target.value })}
                        />
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded text-sm text-gray-600">
                    <p>Note: Pool creation requires a Stacks transaction. You will be prompted to sign the transaction in your wallet.</p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 bg-stacks-orange text-white font-bold rounded hover:bg-orange-600 transition flex justify-center items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ) : null}
                    {loading ? 'Processing...' : 'Create Insurance Pool'}
                </button>
            </form>
        </div>
    );
}
