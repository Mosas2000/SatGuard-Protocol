/**
 * Governance Token Integration
 * Manages governance token distribution and voting power
 */

export interface GovernanceToken {
    symbol: string;
    name: string;
    totalSupply: number;
    circulatingSupply: number;
    price: number; // in STX
}

export interface TokenHolder {
    address: string;
    balance: number;
    votingPower: number;
    delegatedTo?: string;
    delegatedFrom: number;
}

export interface TokenDistribution {
    category: string;
    amount: number;
    percentage: number;
    vested: boolean;
    vestingPeriod?: number; // in days
}

/**
 * Calculate governance token allocation
 */
export function calculateTokenAllocation(contributionAmount: number, totalContributions: number): number {
    const TOKEN_MULTIPLIER = 100; // 1 STX contribution = 100 governance tokens
    const baseTokens = contributionAmount * TOKEN_MULTIPLIER;

    // Bonus for early contributors (up to 20% bonus)
    const contributionPercentage = totalContributions > 0 ? (contributionAmount / totalContributions) : 0;
    const earlyBonus = contributionPercentage > 0.05 ? baseTokens * 0.2 : baseTokens * 0.1;

    return baseTokens + earlyBonus;
}

/**
 * Get token distribution breakdown
 */
export function getTokenDistribution(totalSupply: number): TokenDistribution[] {
    return [
        {
            category: 'Contributors',
            amount: totalSupply * 0.5,
            percentage: 50,
            vested: false
        },
        {
            category: 'Team & Advisors',
            amount: totalSupply * 0.2,
            percentage: 20,
            vested: true,
            vestingPeriod: 730 // 2 years
        },
        {
            category: 'Treasury',
            amount: totalSupply * 0.15,
            percentage: 15,
            vested: false
        },
        {
            category: 'Liquidity Mining',
            amount: totalSupply * 0.1,
            percentage: 10,
            vested: false
        },
        {
            category: 'Community Rewards',
            amount: totalSupply * 0.05,
            percentage: 5,
            vested: false
        }
    ];
}

/**
 * Calculate vesting schedule
 */
export function calculateVesting(
    totalAmount: number,
    vestingPeriod: number,
    elapsedDays: number
): {
    vested: number;
    locked: number;
    nextUnlock: number;
    daysUntilNextUnlock: number;
} {
    const vestedPercentage = Math.min(elapsedDays / vestingPeriod, 1);
    const vested = totalAmount * vestedPercentage;
    const locked = totalAmount - vested;

    // Assuming linear vesting
    const dailyUnlock = totalAmount / vestingPeriod;
    const nextUnlock = elapsedDays < vestingPeriod ? dailyUnlock : 0;
    const daysUntilNextUnlock = elapsedDays < vestingPeriod ? 1 : 0;

    return {
        vested,
        locked,
        nextUnlock,
        daysUntilNextUnlock
    };
}

/**
 * Format token amount
 */
export function formatTokenAmount(amount: number): string {
    if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(2)}M`;
    }
    if (amount >= 1000) {
        return `${(amount / 1000).toFixed(2)}K`;
    }
    return amount.toFixed(2);
}
