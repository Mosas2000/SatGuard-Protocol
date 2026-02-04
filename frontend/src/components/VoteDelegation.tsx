import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, principalCV, PostConditionMode } from '@stacks/transactions';
import { network } from '../utils/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../utils/constants';

interface VoteDelegationProps {
    poolId: number;
    userVotingPower: number;
    onDelegationComplete?: () => void;
}

interface Delegate {
    address: string;
    name: string;
    votingPower: number;
    delegatedPower: number;
    reputation: number;
    activeProposals: number;
}

export default function VoteDelegation({ poolId, userVotingPower, onDelegationComplete }: VoteDelegationProps) {
    const [selectedDelegate, setSelectedDelegate] = useState<string>('');
    const [delegationAmount, setDelegationAmount] = useState(userVotingPower);
    const [loading, setLoading] = useState(false);

    // Mock delegates - would be fetched from contract
    const delegates: Delegate[] = [
        {
            address: 'SP2...ABC',
            name: 'Alice (Community Leader)',
            votingPower: 1500,
            delegatedPower: 3200,
            reputation: 95,
            activeProposals: 12
        },
        {
            address: 'SP3...XYZ',
            name: 'Bob (Security Expert)',
            votingPower: 800,
            delegatedPower: 1800,
            reputation: 88,
            activeProposals: 8
        },
        {
            address: 'SP4...DEF',
            name: 'Carol (DeFi Specialist)',
            votingPower: 1200,
            delegatedPower: 2500,
            reputation: 92,
            activeProposals: 15
        }
    ];

    const handleDelegate = async () => {
        if (!selectedDelegate) {
            alert('Please select a delegate');
            return;
        }

        setLoading(true);
        try {
            await openContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'delegate-votes',
                functionArgs: [
                    uintCV(poolId),
                    principalCV(selectedDelegate),
                    uintCV(delegationAmount)
                ],
                network,
                postConditionMode: PostConditionMode.Deny,
                onFinish: (data) => {
                    console.log('Delegation successful:', data);
                    setLoading(false);
                    alert('Votes delegated successfully!');
                    onDelegationComplete?.();
                },
                onCancel: () => {
                    setLoading(false);
                }
            });
        } catch (err) {
            console.error(err);
            setLoading(false);
            alert('Failed to delegate votes');
        }
    };

    const handleRevoke = async () => {
        setLoading(true);
        try {
            await openContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'revoke-delegation',
                functionArgs: [uintCV(poolId)],
                network,
                postConditionMode: PostConditionMode.Deny,
                onFinish: (data) => {
                    console.log('Delegation revoked:', data);
                    setLoading(false);
                    alert('Delegation revoked successfully!');
                    onDelegationComplete?.();
                },
                onCancel: () => {
                    setLoading(false);
                }
            });
        } catch (err) {
            console.error(err);
            setLoading(false);
            alert('Failed to revoke delegation');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Vote Delegation</h2>
            <p className="text-gray-600 mb-8">
                Delegate your voting power to a trusted community member
            </p>

            {/* Your Voting Power */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Your Voting Power</h3>
                <div className="text-4xl font-bold text-blue-600">{userVotingPower.toFixed(2)}</div>
                <div className="text-sm text-gray-600 mt-1">Available to delegate</div>
            </div>

            {/* Delegation Amount */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delegation Amount</h3>
                <div className="mb-4">
                    <input
                        type="range"
                        min="0"
                        max={userVotingPower}
                        step="0.01"
                        value={delegationAmount}
                        onChange={(e) => setDelegationAmount(parseFloat(e.target.value))}
                        className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span>0</span>
                        <span className="font-semibold text-blue-600">{delegationAmount.toFixed(2)}</span>
                        <span>{userVotingPower.toFixed(2)}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setDelegationAmount(userVotingPower * 0.25)}
                        className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    >
                        25%
                    </button>
                    <button
                        onClick={() => setDelegationAmount(userVotingPower * 0.5)}
                        className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    >
                        50%
                    </button>
                    <button
                        onClick={() => setDelegationAmount(userVotingPower * 0.75)}
                        className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    >
                        75%
                    </button>
                    <button
                        onClick={() => setDelegationAmount(userVotingPower)}
                        className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    >
                        100%
                    </button>
                </div>
            </div>

            {/* Select Delegate */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Delegate</h3>
                <div className="space-y-3">
                    {delegates.map(delegate => (
                        <div
                            key={delegate.address}
                            onClick={() => setSelectedDelegate(delegate.address)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition ${selectedDelegate === delegate.address
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="font-bold text-gray-900">{delegate.name}</div>
                                    <div className="text-sm text-gray-600">{delegate.address}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-right">
                                        <div className="text-sm text-gray-600">Reputation</div>
                                        <div className="font-bold text-green-600">{delegate.reputation}%</div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <div className="text-gray-600">Own Power</div>
                                    <div className="font-semibold text-gray-900">{delegate.votingPower}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600">Delegated</div>
                                    <div className="font-semibold text-gray-900">{delegate.delegatedPower}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600">Active Votes</div>
                                    <div className="font-semibold text-gray-900">{delegate.activeProposals}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={handleDelegate}
                    disabled={!selectedDelegate || delegationAmount <= 0 || loading}
                    className={`flex-1 py-3 rounded-lg font-bold transition ${selectedDelegate && delegationAmount > 0 && !loading
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {loading ? 'Processing...' : 'Delegate Votes'}
                </button>
                <button
                    onClick={handleRevoke}
                    disabled={loading}
                    className="px-6 py-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                >
                    Revoke Delegation
                </button>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">💡 About Delegation</h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Delegation is temporary and can be revoked at any time</li>
                    <li>Your delegate will vote on your behalf for all proposals</li>
                    <li>You can still vote directly, which overrides delegation</li>
                    <li>Choose delegates with good reputation and active participation</li>
                </ul>
            </div>
        </div>
    );
}
