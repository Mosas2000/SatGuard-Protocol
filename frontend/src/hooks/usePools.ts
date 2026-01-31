import { useState, useEffect } from 'react';
import { callReadOnlyFunction, cvToJSON, uintCV } from '@stacks/transactions';
import { network } from '../utils/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../utils/constants';
import { Pool } from '../types';

export function usePools() {
    const [pools, setPools] = useState<Pool[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPools() {
            try {
                const countResult = await callReadOnlyFunction({
                    contractAddress: CONTRACT_ADDRESS,
                    contractName: CONTRACT_NAME,
                    functionName: 'get-pool-count',
                    functionArgs: [],
                    network,
                    senderAddress: CONTRACT_ADDRESS,
                });

                const poolCount = parseInt(cvToJSON(countResult).value);
                const poolPromises = [];

                // Corrected logic: Pools are often 1-indexed in Clariy nonces if starting at 1
                // We saw Pool 1 exist earlier.
                for (let i = 1; i <= poolCount; i++) {
                    poolPromises.push(
                        callReadOnlyFunction({
                            contractAddress: CONTRACT_ADDRESS,
                            contractName: CONTRACT_NAME,
                            functionName: 'get-pool',
                            functionArgs: [uintCV(i)],
                            network,
                            senderAddress: CONTRACT_ADDRESS,
                        })
                    );
                }

                const results = await Promise.all(poolPromises);
                const fetchedPools: Pool[] = results
                    .map((result, index) => {
                        const poolData = cvToJSON(result);
                        if (!poolData.value) return null;

                        return {
                            poolId: index + 1,
                            creator: poolData.value.cr.value,
                            coverageType: poolData.value.ct.value,
                            totalFunds: parseInt(poolData.value.tf.value),
                            minContribution: parseInt(poolData.value.mc.value),
                            maxCoverage: parseInt(poolData.value.mx.value),
                            createdAt: parseInt(poolData.value.ca.value),
                            status: parseInt(poolData.value.st.value),
                            contributorCount: parseInt(poolData.value.cc.value),
                        };
                    })
                    .filter((pool): pool is Pool => pool !== null);

                setPools(fetchedPools);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch pools');
                setLoading(false);
            }
        }

        fetchPools();
    }, []);

    return { pools, loading, error, refetch: () => setLoading(true) };
}
