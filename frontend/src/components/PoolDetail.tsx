import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { openContractCall } from '@stacks/connect';
import { uintCV, boolCV, PostConditionMode } from '@stacks/transactions';
import { network } from '../utils/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../utils/constants';

import { usePool } from '../hooks/usePool';
import { useContribution } from '../hooks/useContribution';
import { useClaims } from '../hooks/useClaims';
import { formatAmount, getAddressUrl } from '../utils/network';
import { POOL_STATUS } from '../utils/constants';

import ContributeModal from './ContributeModal';
import SubmitClaimModal from './SubmitClaimModal';
import ClaimsList from './ClaimsList';

interface PoolDetailProps {
    userAddress: string | null;
}

export default function PoolDetail({ userAddress }: PoolDetailProps) {
    const { id } = useParams<{ id: string }>();
    const poolId = parseInt(id || '0');

    const { pool, loading: poolLoading, error: poolError } = usePool(poolId);
    const { contribution, loading: contribLoading } = useContribution(poolId, userAddress);
    const { claims, loading: claimsLoading, refetch: refetchClaims } = useClaims(poolId);

    const [isContributeOpen, setIsContributeOpen] = useState(false);
    const [isSubmitClaimOpen, setIsSubmitClaimOpen] = useState(false);

    const handleVote = async (claimId: number, approve: boolean) => {
        if (!userAddress) {
            alert('Please connect your wallet to vote.');
            return;
        }

        try {
            await openContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'vote',
                functionArgs: [
                    uintCV(claimId),
                    boolCV(approve),
                ],
                network,
                postConditionMode: PostConditionMode.Deny,
                onFinish: (data) => {
                    console.log('Vote Finished:', data);
                    alert('Vote transaction broadcasted!');
                    refetchClaims();
                },
                onCancel: () => console.log('Vote Cancelled'),
            });
        } catch (err) {
            console.error(err);
            alert('Failed to initiate vote');
        }
    };

    if (poolLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stacks-orange"></div>
            </div>
        );
    }

    if (poolError || !pool) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 text-center text-red-500">
                Error: {poolError || 'Pool not found'}
            </div>
        );
    }

    const isActive = pool.status === POOL_STATUS.ACTIVE;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="flex justify-between items-start mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-black mb-2">Pool #{pool.poolId}</h1>
                    <p className="text-xl text-gray-600">{pool.coverageType}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span
                        className={`px-4 py-2 rounded font-bold ${isActive ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                    >
                        {isActive ? 'Active' : 'Closed'}
                    </span>
                    {contribution && (
                        <span className="text-xs bg-stacks-orange text-white px-2 py-1 rounded">
                            Member
                        </span>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="border border-gray-200 p-8 rounded shadow-sm">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Pool Financials</h3>
                    <div className="space-y-6">
                        <div>
                            <p className="text-gray-600 text-sm">Total Funds Pooled</p>
                            <p className="text-3xl font-mono font-bold text-black">{formatAmount(pool.totalFunds)} sBTC</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600 text-sm">Min. Contribution</p>
                                <p className="font-mono font-bold">{formatAmount(pool.minContribution)} sBTC</p>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">Max Coverage</p>
                                <p className="font-mono font-bold">{formatAmount(pool.maxCoverage)} sBTC</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border border-gray-200 p-8 rounded shadow-sm bg-gray-50">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Your Status</h3>
                    <div className="space-y-6">
                        {userAddress ? (
                            contribLoading ? (
                                <p className="text-gray-500 italic">Checking status...</p>
                            ) : contribution ? (
                                <>
                                    <div>
                                        <p className="text-gray-600 text-sm">Your Contribution</p>
                                        <p className="text-2xl font-mono font-bold text-stacks-orange">{formatAmount(contribution.amount)} sBTC</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm">Member Since Block</p>
                                        <p className="font-bold text-black">#{contribution.contributedAt}</p>
                                    </div>
                                </>
                            ) : (
                                <div className="py-4">
                                    <p className="text-gray-600 italic">You haven't contributed to this pool yet.</p>
                                </div>
                            )
                        ) : (
                            <p className="text-gray-600 italic">Connect your wallet to see your status.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mb-16">
                <button
                    onClick={() => setIsContributeOpen(true)}
                    disabled={!isActive || !userAddress}
                    className={`flex-1 py-4 bg-stacks-orange text-white font-bold rounded hover:bg-orange-600 transition shadow-lg ${(!isActive || !userAddress) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    Contribute Funds
                </button>
                <button
                    onClick={() => setIsSubmitClaimOpen(true)}
                    disabled={!contribution || !isActive}
                    className={`flex-1 py-4 border-2 border-black text-black font-bold rounded hover:bg-black hover:text-white transition ${(!contribution || !isActive) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    Submit Claim
                </button>
            </div>

            <div className="border-t border-gray-200 pt-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-black">Governance & Claims</h2>
                    <div className="text-sm text-gray-500">
                        {claims.length} total claims
                    </div>
                </div>

                {claimsLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                    </div>
                ) : (
                    <ClaimsList
                        claims={claims}
                        userAddress={userAddress}
                        hasContributed={!!contribution}
                        onVote={handleVote}
                    />
                )}
            </div>

            <ContributeModal
                poolId={poolId}
                minContribution={pool.minContribution}
                isOpen={isContributeOpen}
                onClose={() => setIsContributeOpen(false)}
                onSuccess={() => window.location.reload()}
            />

            <SubmitClaimModal
                poolId={poolId}
                maxCoverage={pool.maxCoverage}
                totalFunds={pool.totalFunds}
                isOpen={isSubmitClaimOpen}
                onClose={() => setIsSubmitClaimOpen(false)}
                onSuccess={() => refetchClaims()}
            />
        </div>
    );
}
