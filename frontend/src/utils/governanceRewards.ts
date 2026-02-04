/**
 * Governance Rewards System
 * Calculates and distributes rewards for governance participation
 */

export interface GovernanceReward {
    type: 'voting' | 'proposal' | 'delegation' | 'participation';
    amount: number;
    multiplier: number;
    earned: Date;
}

export interface RewardTier {
    name: string;
    minActivity: number;
    multiplier: number;
    benefits: string[];
}

/**
 * Calculate voting rewards
 */
export function calculateVotingReward(
    votesParticipated: number,
    totalProposals: number,
    baseReward: number = 10
): number {
    const participationRate = totalProposals > 0 ? votesParticipated / totalProposals : 0;
    const multiplier = 1 + (participationRate * 0.5); // Up to 1.5x for 100% participation
    return baseReward * votesParticipated * multiplier;
}

/**
 * Calculate proposal creation rewards
 */
export function calculateProposalReward(
    proposalsCreated: number,
    approvedProposals: number,
    baseReward: number = 50
): number {
    const approvalRate = proposalsCreated > 0 ? approvedProposals / proposalsCreated : 0;
    const qualityBonus = approvalRate * 0.5; // Up to 50% bonus for high approval rate
    return baseReward * proposalsCreated * (1 + qualityBonus);
}

/**
 * Calculate delegation rewards
 */
export function calculateDelegationReward(
    delegatedPower: number,
    votesExecuted: number,
    baseReward: number = 5
): number {
    // Delegates earn rewards based on power delegated to them and votes executed
    return (delegatedPower / 100) * votesExecuted * baseReward;
}

/**
 * Get reward tier based on activity
 */
export function getRewardTier(activityScore: number): RewardTier {
    if (activityScore >= 1000) {
        return {
            name: 'Diamond',
            minActivity: 1000,
            multiplier: 2.0,
            benefits: ['2x rewards', 'Priority support', 'Exclusive proposals', 'Early access']
        };
    }
    if (activityScore >= 500) {
        return {
            name: 'Platinum',
            minActivity: 500,
            multiplier: 1.5,
            benefits: ['1.5x rewards', 'Priority voting', 'Proposal templates']
        };
    }
    if (activityScore >= 100) {
        return {
            name: 'Gold',
            minActivity: 100,
            multiplier: 1.25,
            benefits: ['1.25x rewards', 'Voting analytics']
        };
    }
    return {
        name: 'Silver',
        minActivity: 0,
        multiplier: 1.0,
        benefits: ['Base rewards']
    };
}

/**
 * Calculate total governance rewards
 */
export function calculateTotalRewards(
    votingRewards: number,
    proposalRewards: number,
    delegationRewards: number,
    tierMultiplier: number
): {
    baseRewards: number;
    bonusRewards: number;
    totalRewards: number;
} {
    const baseRewards = votingRewards + proposalRewards + delegationRewards;
    const bonusRewards = baseRewards * (tierMultiplier - 1);
    const totalRewards = baseRewards * tierMultiplier;

    return {
        baseRewards,
        bonusRewards,
        totalRewards
    };
}

/**
 * Calculate activity score
 */
export function calculateActivityScore(
    votesParticipated: number,
    proposalsCreated: number,
    delegatedPower: number
): number {
    return (votesParticipated * 10) + (proposalsCreated * 50) + (delegatedPower / 10);
}

/**
 * Format reward amount
 */
export function formatRewardAmount(amount: number): string {
    if (amount >= 1000) {
        return `${(amount / 1000).toFixed(2)}K`;
    }
    return amount.toFixed(2);
}

/**
 * Get next tier progress
 */
export function getNextTierProgress(currentScore: number): {
    currentTier: RewardTier;
    nextTier: RewardTier | null;
    progress: number; // 0-100
    scoreNeeded: number;
} {
    const currentTier = getRewardTier(currentScore);

    let nextTier: RewardTier | null = null;
    let scoreNeeded = 0;

    if (currentScore < 100) {
        nextTier = getRewardTier(100);
        scoreNeeded = 100 - currentScore;
    } else if (currentScore < 500) {
        nextTier = getRewardTier(500);
        scoreNeeded = 500 - currentScore;
    } else if (currentScore < 1000) {
        nextTier = getRewardTier(1000);
        scoreNeeded = 1000 - currentScore;
    }

    const progress = nextTier
        ? ((currentScore - currentTier.minActivity) / (nextTier.minActivity - currentTier.minActivity)) * 100
        : 100;

    return {
        currentTier,
        nextTier,
        progress: Math.min(progress, 100),
        scoreNeeded
    };
}
