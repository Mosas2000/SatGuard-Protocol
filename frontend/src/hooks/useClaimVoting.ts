import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, boolCV, PostConditionMode } from '@stacks/transactions';
import { network } from '../utils/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../utils/constants';

export function useClaimVoting() {
    const [loading, setLoading] = useState(false);

    const voteOnClaim = async (poolId: number, claimId: number, support: boolean) => {
        setLoading(true);
        try {
            await openContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'vote-on-claim',
                functionArgs: [uintCV(poolId), uintCV(claimId), boolCV(support)],
                network,
                postConditionMode: PostConditionMode.Deny,
                onFinish: () => setLoading(false),
            });
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    return { voteOnClaim, loading };
}
