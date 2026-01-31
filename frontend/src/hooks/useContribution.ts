import { useState, useEffect } from 'react';
import { callReadOnlyFunction, cvToJSON, uintCV, principalCV } from '@stacks/transactions';
import { network } from '../utils/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../utils/constants';
import { Contribution } from '../types';

export function useContribution(poolId: number, userAddress: string | null) {
    const [contribution, setContribution] = useState<Contribution | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchContribution() {
            if (!userAddress) {
                setContribution(null);
                setLoading(false);
                return;
            }

            try {
                const result = await callReadOnlyFunction({
                    contractAddress: CONTRACT_ADDRESS,
                    contractName: CONTRACT_NAME,
                    functionName: 'get-contrib',
                    functionArgs: [uintCV(poolId), principalCV(userAddress)],
                    network,
                    senderAddress: userAddress,
                });

                const contribData = cvToJSON(result);

                if (contribData.value) {
                    setContribution({
                        amount: parseInt(contribData.value.a.value),
                        contributedAt: parseInt(contribData.value.ca.value),
                    });
                } else {
                    setContribution(null);
                }

                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch contribution');
                setLoading(false);
            }
        }

        fetchContribution();
    }, [poolId, userAddress]);

    return { contribution, loading, error };
}
