/**
 * Vote Privacy System
 * Implements private voting with reveal mechanisms
 */

export interface PrivateVote {
    voteId: string;
    voter: string;
    commitment: string; // Hash of vote + secret
    revealed: boolean;
    revealedAt?: Date;
    actualVote?: 'for' | 'against' | 'abstain';
}

/**
 * Create vote commitment (hash)
 */
export function createVoteCommitment(
    vote: 'for' | 'against' | 'abstain',
    secret: string
): string {
    // In production, use proper cryptographic hash
    const combined = `${vote}-${secret}`;
    return btoa(combined); // Base64 encoding as simple example
}

/**
 * Verify vote reveal
 */
export function verifyVoteReveal(
    commitment: string,
    vote: 'for' | 'against' | 'abstain',
    secret: string
): boolean {
    const expectedCommitment = createVoteCommitment(vote, secret);
    return commitment === expectedCommitment;
}

/**
 * Generate random secret
 */
export function generateVoteSecret(): string {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}

/**
 * Check if voting period allows reveals
 */
export function canRevealVote(
    votingEndTime: Date,
    revealPeriodHours: number = 24
): { canReveal: boolean; timeRemaining?: number } {
    const now = new Date();
    const revealEndTime = new Date(votingEndTime);
    revealEndTime.setHours(revealEndTime.getHours() + revealPeriodHours);

    if (now < votingEndTime) {
        return { canReveal: false };
    }

    if (now > revealEndTime) {
        return { canReveal: false };
    }

    const timeRemaining = revealEndTime.getTime() - now.getTime();
    return { canReveal: true, timeRemaining };
}

/**
 * Calculate privacy score
 */
export function calculatePrivacyScore(
    totalVoters: number,
    revealedVotes: number
): {
    score: number; // 0-100
    level: 'low' | 'medium' | 'high';
} {
    const revealRate = totalVoters > 0 ? revealedVotes / totalVoters : 0;
    const score = (1 - revealRate) * 100;

    let level: 'low' | 'medium' | 'high';
    if (score >= 70) level = 'high';
    else if (score >= 40) level = 'medium';
    else level = 'low';

    return { score, level };
}

/**
 * Get privacy benefits
 */
export function getPrivacyBenefits(): string[] {
    return [
        'Prevents vote buying and coercion',
        'Reduces strategic voting',
        'Protects voter identity during voting',
        'Allows for unbiased decision making',
        'Reveals results only after voting ends'
    ];
}

/**
 * Format reveal time remaining
 */
export function formatRevealTimeRemaining(milliseconds: number): string {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}
