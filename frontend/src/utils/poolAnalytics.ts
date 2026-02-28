import type { Pool } from '../types';

export interface PoolAnalytics {
    averageFunds: number;
    averageContributors: number;
    totalLiquidity: number;
    activePoolsPercentage: number;
    mostPopularCoverageType: string;
    largestPool: Pool | null;
    newestPool: Pool | null;
}

export const calculatePoolAnalytics = (pools: Pool[]): PoolAnalytics => {
    if (pools.length === 0) {
        return {
            averageFunds: 0,
            averageContributors: 0,
            totalLiquidity: 0,
            activePoolsPercentage: 0,
            mostPopularCoverageType: 'N/A',
            largestPool: null,
            newestPool: null,
        };
    }

    const totalFunds = pools.reduce((sum, pool) => sum + pool.totalFunds, 0);
    const totalContributors = pools.reduce((sum, pool) => sum + pool.contributorCount, 0);
    const activePools = pools.filter(p => p.status === 1);

    // Find most popular coverage type
    const coverageTypeCounts = pools.reduce((acc, pool) => {
        acc[pool.coverageType] = (acc[pool.coverageType] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const mostPopularCoverageType = Object.entries(coverageTypeCounts)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';

    // Find largest pool
    const largestPool = pools.reduce((largest, pool) => 
        pool.totalFunds > (largest?.totalFunds || 0) ? pool : largest
    , pools[0]);

    // Find newest pool
    const newestPool = pools.reduce((newest, pool) => 
        pool.createdAt > (newest?.createdAt || 0) ? pool : newest
    , pools[0]);

    return {
        averageFunds: totalFunds / pools.length,
        averageContributors: totalContributors / pools.length,
        totalLiquidity: totalFunds,
        activePoolsPercentage: (activePools.length / pools.length) * 100,
        mostPopularCoverageType,
        largestPool,
        newestPool,
    };
};

export const getPoolHealthScore = (pool: Pool): number => {
    let score = 0;
    
    // Active status
    if (pool.status === 1) score += 30;
    
    // Contributor count (max 30 points)
    score += Math.min(pool.contributorCount * 3, 30);
    
    // Funds relative to max coverage (max 20 points)
    const fundingRatio = pool.totalFunds / pool.maxCoverage;
    score += Math.min(fundingRatio * 20, 20);
    
    // Age (newer pools get bonus, max 20 points)
    const ageInDays = (Date.now() / 1000 - pool.createdAt) / 86400;
    if (ageInDays < 30) score += 20;
    else if (ageInDays < 90) score += 10;
    
    return Math.min(score, 100);
};
