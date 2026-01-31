import { useState, useEffect } from 'react';
import { usePools } from './usePools';
import { useClaims } from './useClaims';
import { callReadOnlyFunction, cvToJSON, uintCV, principalCV } from '@stacks/transactions';
import { network } from '../utils/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../utils/constants';

export function useUserStats(userAddress: string | null) {
    const { pools, loading: poolsLoading } = usePools();
    const [stats, setStats] = useState({
        totalContributed: 0,
        activePoolsCount: 0,
        submittedClaimsCount: 0,
        totalVotingPower: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUserStats() {
            if (!userAddress || poolsLoading) return;

            try {
                let totalContributed = 0;
                let activePoolsCount = 0;
                let totalVotingPower = 0;

                const contribPromises = pools.map(pool =>
                    callReadOnlyFunction({
                        contractAddress: CONTRACT_ADDRESS,
                        contractName: CONTRACT_NAME,
                        functionName: 'get-contrib',
                        functionArgs: [uintCV(pool.poolId), principalCV(userAddress)],
                        network,
                        senderAddress: userAddress,
                    })
                );

                const contribResults = await Promise.all(contribPromises);

                contribResults.forEach((result, index) => {
                    const data = cvToJSON(result);
                    if (data.value) {
                        const amount = parseInt(data.value.a.value);
                        if (amount > 0) {
                            totalContributed += amount;
                            activePoolsCount += 1;
                            totalVotingPower += amount; // Simplified: 1 sBTC = 1 VP
                        }
                    }
                });

                // Fetch claims to count user's submissions
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

                const claimResults = await Promise.all(claimPromises);
                const userClaimsCount = claimResults.filter(res => {
                    const data = cvToJSON(res);
                    return data.value && data.value.cl.value === userAddress;
                }).length;

                setStats({
                    totalContributed,
                    activePoolsCount,
                    submittedClaimsCount: userClaimsCount,
                    totalVotingPower,
                });
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch user stats:', err);
                setLoading(false);
            }
        }

        fetchUserStats();
    }, [userAddress, pools, poolsLoading]);

    return { stats, loading };
}
