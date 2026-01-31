import { useState, useEffect } from 'react';
import { callReadOnlyFunction, cvToJSON, uintCV } from '@stacks/transactions';
import { network } from '../utils/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../utils/constants';
import { Claim } from '../types';

export function useClaims(poolId: number) {
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchClaims() {
            try {
                const countResult = await callReadOnlyFunction({
                    contractAddress: CONTRACT_ADDRESS,
                    contractName: CONTRACT_NAME,
                    functionName: 'get-claim-count',
                    functionArgs: [],
                    network,
                    senderAddress: CONTRACT_ADDRESS,
                });

                const claimCount = parseInt(cvToJSON(countResult).value);
                const claimPromises = [];

                for (let i = 1; i <= claimCount; i++) {
                    claimPromises.push(
                        callReadOnlyFunction({
                            contractAddress: CONTRACT_ADDRESS,
                            contractName: CONTRACT_NAME,
                            functionName: 'get-claim',
                            functionArgs: [uintCV(i)],
                            network,
                            senderAddress: CONTRACT_ADDRESS,
                        })
                    );
                }

                const results = await Promise.all(claimPromises);
                const fetchedClaims: Claim[] = results
                    .map((result, index) => {
                        const claimData = cvToJSON(result);
                        if (!claimData.value) return null;

                        // Only return claims for this specific pool
                        if (parseInt(claimData.value['p-id'].value) !== poolId) return null;

                        return {
                            claimId: index + 1,
                            poolId: parseInt(claimData.value['p-id'].value),
                            claimant: claimData.value.cl.value,
                            amount: parseInt(claimData.value.a.value),
                            reason: claimData.value.r.value,
                            submittedAt: parseInt(claimData.value.sa.value),
                            status: parseInt(claimData.value.st.value),
                            votesFor: parseInt(claimData.value.vf.value),
                            votesAgainst: parseInt(claimData.value.va.value),
                        };
                    })
                    .filter((claim): claim is Claim => claim !== null);

                setClaims(fetchedClaims);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch claims');
                setLoading(false);
            }
        }

        fetchClaims();
    }, [poolId]);

    return { claims, loading, error, refetch: () => setLoading(true) };
}
