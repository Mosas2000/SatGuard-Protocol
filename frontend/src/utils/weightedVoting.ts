/**
 * Weighted Voting System
 * Calculates voting power based on contribution amount and other factors
 */

export interface VotingPower {
    baseVotes: number;
    contributionWeight: number;
    reputationBonus: number;
    timeBonus: number;
    totalVotes: number;
    percentage: number;
}

export interface VoterProfile {
    address: string;
    contributionAmount: number; // in STX
    accountAge: number; // in days
    reputationScore: number; // 0-100
    previousVotes: number;
}

/**
 * Calculate weighted voting power for a voter
 */
export function calculateVotingPower(
    voter: VoterProfile,
    totalPoolContributions: number
): VotingPower {
    // Base votes = contribution amount
    const baseVotes = voter.contributionAmount;

    // Contribution weight (percentage of pool)
    const contributionWeight = totalPoolContributions > 0
        ? (voter.contributionAmount / totalPoolContributions) * 100
        : 0;

    // Reputation bonus (up to 20% boost)
    const reputationBonus = (voter.reputationScore / 100) * baseVotes * 0.2;

    // Time bonus for long-term contributors (up to 10% boost)
    const timeMultiplier = Math.min(voter.accountAge / 365, 1); // Max at 1 year
    const timeBonus = baseVotes * timeMultiplier * 0.1;

    // Total voting power
    const totalVotes = baseVotes + reputationBonus + timeBonus;

    // Calculate percentage of total voting power
    const percentage = totalPoolContributions > 0
        ? (totalVotes / (totalPoolContributions * 1.3)) * 100 // 1.3 accounts for bonuses
        : 0;

    return {
        baseVotes,
        contributionWeight,
        reputationBonus,
        timeBonus,
        totalVotes,
        percentage
    };
}

/**
 * Calculate quorum requirement
 */
export function calculateQuorum(totalVotingPower: number): number {
    // Quorum is 30% of total voting power
    return totalVotingPower * 0.3;
}

/**
 * Calculate approval threshold
 */
export function getApprovalThreshold(proposalType: 'standard' | 'critical' | 'emergency'): number {
    const thresholds = {
        standard: 60, // 60% approval
        critical: 75, // 75% approval
        emergency: 90 // 90% approval
    };
    return thresholds[proposalType];
}

/**
 * Check if vote passes
 */
export function checkVoteResult(
    votesFor: number,
    votesAgainst: number,
    totalVotingPower: number,
    proposalType: 'standard' | 'critical' | 'emergency' = 'standard'
): {
    passed: boolean;
    quorumMet: boolean;
    approvalRate: number;
    requiredApproval: number;
    requiredQuorum: number;
} {
    const totalVotes = votesFor + votesAgainst;
    const quorum = calculateQuorum(totalVotingPower);
    const quorumMet = totalVotes >= quorum;

    const approvalRate = totalVotes > 0 ? (votesFor / totalVotes) * 100 : 0;
    const requiredApproval = getApprovalThreshold(proposalType);

    const passed = quorumMet && approvalRate >= requiredApproval;

    return {
        passed,
        quorumMet,
        approvalRate,
        requiredApproval,
        requiredQuorum: quorum
    };
}

/**
 * Format voting power for display
 */
export function formatVotingPower(votes: number): string {
    if (votes >= 1000000) {
        return `${(votes / 1000000).toFixed(2)}M`;
    }
    if (votes >= 1000) {
        return `${(votes / 1000).toFixed(2)}K`;
    }
    return votes.toFixed(2);
}

/**
 * Get voting power tier
 */
export function getVotingPowerTier(percentage: number): {
    tier: 'whale' | 'major' | 'standard' | 'minor';
    label: string;
    color: string;
} {
    if (percentage >= 10) {
        return { tier: 'whale', label: 'Whale Voter', color: '#8b5cf6' };
    }
    if (percentage >= 5) {
        return { tier: 'major', label: 'Major Voter', color: '#3b82f6' };
    }
    if (percentage >= 1) {
        return { tier: 'standard', label: 'Standard Voter', color: '#10b981' };
    }
    return { tier: 'minor', label: 'Minor Voter', color: '#6b7280' };
}
