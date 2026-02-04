/**
 * Quadratic Voting System
 * Implements quadratic voting to reduce whale influence
 */

export interface QuadraticVote {
    voter: string;
    votingPower: number;
    votesCast: number; // Number of votes allocated
    cost: number; // Quadratic cost
    direction: 'for' | 'against' | 'abstain';
}

/**
 * Calculate quadratic voting cost
 * Cost = votes^2
 */
export function calculateQuadraticCost(votes: number): number {
    return Math.pow(votes, 2);
}

/**
 * Calculate maximum votes possible with given voting power
 */
export function calculateMaxVotes(votingPower: number): number {
    return Math.floor(Math.sqrt(votingPower));
}

/**
 * Validate quadratic vote
 */
export function validateQuadraticVote(
    votesCast: number,
    votingPower: number
): { valid: boolean; error?: string } {
    const cost = calculateQuadraticCost(votesCast);

    if (cost > votingPower) {
        return {
            valid: false,
            error: `Insufficient voting power. Cost: ${cost}, Available: ${votingPower}`
        };
    }

    if (votesCast < 0) {
        return {
            valid: false,
            error: 'Votes must be positive'
        };
    }

    return { valid: true };
}

/**
 * Calculate quadratic voting results
 */
export function calculateQuadraticResults(votes: QuadraticVote[]): {
    totalFor: number;
    totalAgainst: number;
    totalAbstain: number;
    approvalRate: number;
    participationRate: number;
    totalVotingPower: number;
} {
    const totalFor = votes
        .filter(v => v.direction === 'for')
        .reduce((sum, v) => sum + v.votesCast, 0);

    const totalAgainst = votes
        .filter(v => v.direction === 'against')
        .reduce((sum, v) => sum + v.votesCast, 0);

    const totalAbstain = votes
        .filter(v => v.direction === 'abstain')
        .reduce((sum, v) => sum + v.votesCast, 0);

    const totalVotes = totalFor + totalAgainst;
    const approvalRate = totalVotes > 0 ? (totalFor / totalVotes) * 100 : 0;

    const totalVotingPower = votes.reduce((sum, v) => sum + v.votingPower, 0);
    const totalCost = votes.reduce((sum, v) => sum + v.cost, 0);
    const participationRate = totalVotingPower > 0 ? (totalCost / totalVotingPower) * 100 : 0;

    return {
        totalFor,
        totalAgainst,
        totalAbstain,
        approvalRate,
        participationRate,
        totalVotingPower
    };
}

/**
 * Get vote allocation suggestions
 */
export function getVoteAllocationSuggestions(votingPower: number): {
    conservative: number;
    moderate: number;
    aggressive: number;
} {
    const maxVotes = calculateMaxVotes(votingPower);

    return {
        conservative: Math.floor(maxVotes * 0.25),
        moderate: Math.floor(maxVotes * 0.5),
        aggressive: Math.floor(maxVotes * 0.75)
    };
}

/**
 * Format quadratic vote display
 */
export function formatQuadraticVote(votesCast: number, cost: number): string {
    return `${votesCast} vote${votesCast !== 1 ? 's' : ''} (cost: ${cost.toFixed(2)})`;
}
