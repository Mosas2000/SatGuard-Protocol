import { useState, useEffect } from 'react';
import { usePools } from './usePools';
import { callReadOnlyFunction, cvToJSON, uintCV, principalCV } from '@stacks/transactions';
import { network } from '../utils/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../utils/constants';

export interface ActivityItem {
    id: string;
    type: 'contribution' | 'claim';
    poolId: number;
    amount: number;
    timestamp: number;
    status?: number;
}

export function useUserStats(userAddress: string | null) {
    const { pools, loading: poolsLoading } = usePools();
    const [stats, setStats] = useState({
        totalContributed: 0,
        activePoolsCount: 0,
        submittedClaimsCount: 0,
        totalVotingPower: 0,
    });
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUserStats() {
            if (!userAddress || poolsLoading) return;

            try {
                let totalContributed = 0;
                let activePoolsCount = 0;
                let totalVotingPower = 0;
                const recentActivities: ActivityItem[] = [];

                // 1. Fetch contributions across all pools
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
                        const poolId = pools[index].poolId;
                        if (amount > 0) {
                            totalContributed += amount;
                            activePoolsCount += 1;
                            totalVotingPower += amount;

                            recentActivities.push({
                                id: `contrib-${poolId}-${userAddress}`,
                                type: 'contribution',
                                poolId: poolId,
                                amount: amount,
                                timestamp: parseInt(data.value.ca.value),
                            });
                        }
                    }
                });

                // 2. Fetch claims to count user's submissions
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
                let userClaimsCount = 0;

                claimResults.forEach((res, index) => {
                    const data = cvToJSON(res);
                    if (data.value && data.value.cl.value === userAddress) {
                        userClaimsCount += 1;
                        recentActivities.push({
                            id: `claim-${index + 1}`,
                            type: 'claim',
                            poolId: parseInt(data.value['p-id'].value),
                            amount: parseInt(data.value.a.value),
                            timestamp: parseInt(data.value.sa.value),
                            status: parseInt(data.value.st.value),
                        });
                    }
                });

                // Sort activities by block height (timestamp) descending
                recentActivities.sort((a, b) => b.timestamp - a.timestamp);

                setStats({
                    totalContributed,
                    activePoolsCount,
                    submittedClaimsCount: userClaimsCount,
                    totalVotingPower,
                });
                setActivities(recentActivities);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch user stats:', err);
                setLoading(false);
            }
        }

        fetchUserStats();
    }, [userAddress, pools, poolsLoading]);

    return { stats, activities, loading };
}
