import { useState, useEffect } from 'react';
import { callReadOnlyFunction, cvToJSON, uintCV } from '@stacks/transactions';
import { network } from '../utils/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../utils/constants';
import { Pool } from '../types';

export function usePool(poolId: number) {
    const [pool, setPool] = useState<Pool | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPool() {
            try {
                const result = await callReadOnlyFunction({
                    contractAddress: CONTRACT_ADDRESS,
                    contractName: CONTRACT_NAME,
                    functionName: 'get-pool',
                    functionArgs: [uintCV(poolId)],
                    network,
                    senderAddress: CONTRACT_ADDRESS,
                });

                const poolData = cvToJSON(result);

                if (poolData.value) {
                    // Mapping from optimized contract keys to frontend Pool interface
                    setPool({
                        poolId,
                        creator: poolData.value.cr.value,
                        coverageType: poolData.value.ct.value,
                        totalFunds: parseInt(poolData.value.tf.value),
                        minContribution: parseInt(poolData.value.mc.value),
                        maxCoverage: parseInt(poolData.value.mx.value),
                        createdAt: parseInt(poolData.value.ca.value),
                        status: parseInt(poolData.value.st.value),
                        contributorCount: parseInt(poolData.value.cc.value),
                    });
                }

                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch pool');
                setLoading(false);
            }
        }

        fetchPool();
    }, [poolId]);

    return { pool, loading, error };
}
