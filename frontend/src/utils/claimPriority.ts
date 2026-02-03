/**
 * Claim Priority Calculator
 * Determines claim processing priority based on multiple factors
 */

export interface PriorityFactors {
    urgency: 'low' | 'medium' | 'high' | 'critical';
    claimAmount: number;
    evidenceQuality: number; // 0-100
    accountReputation: number; // 0-100
    waitingTime: number; // in days
    fraudScore: number; // 0-100
}

export interface PriorityScore {
    score: number; // 0-100 (100 = highest priority)
    level: 'low' | 'medium' | 'high' | 'urgent';
    estimatedProcessingTime: number; // in days
    queuePosition: number;
    factors: {
        urgencyWeight: number;
        amountWeight: number;
        evidenceWeight: number;
        reputationWeight: number;
        waitTimeWeight: number;
        fraudPenalty: number;
    };
}

export function calculateClaimPriority(factors: PriorityFactors, totalClaims: number = 10): PriorityScore {
    const weights = {
        urgency: 0.3,
        amount: 0.15,
        evidence: 0.2,
        reputation: 0.15,
        waitTime: 0.15,
        fraud: 0.05
    };

    // Urgency score
    const urgencyScores = { low: 25, medium: 50, high: 75, critical: 100 };
    const urgencyWeight = urgencyScores[factors.urgency] * weights.urgency;

    // Amount score (normalized to 0-100)
    const amountWeight = Math.min((factors.claimAmount / 10) * 100, 100) * weights.amount;

    // Evidence quality score
    const evidenceWeight = factors.evidenceQuality * weights.evidence;

    // Reputation score
    const reputationWeight = factors.accountReputation * weights.reputation;

    // Wait time score (increases over time)
    const waitTimeWeight = Math.min((factors.waitingTime / 30) * 100, 100) * weights.waitTime;

    // Fraud penalty (reduces priority)
    const fraudPenalty = factors.fraudScore * weights.fraud;

    // Calculate total score
    const score = Math.min(
        Math.max(
            urgencyWeight + amountWeight + evidenceWeight + reputationWeight + waitTimeWeight - fraudPenalty,
            0
        ),
        100
    );

    const level = getPriorityLevel(score);
    const estimatedProcessingTime = calculateProcessingTime(score);
    const queuePosition = calculateQueuePosition(score, totalClaims);

    return {
        score: Math.round(score),
        level,
        estimatedProcessingTime,
        queuePosition,
        factors: {
            urgencyWeight: Math.round(urgencyWeight),
            amountWeight: Math.round(amountWeight),
            evidenceWeight: Math.round(evidenceWeight),
            reputationWeight: Math.round(reputationWeight),
            waitTimeWeight: Math.round(waitTimeWeight),
            fraudPenalty: Math.round(fraudPenalty)
        }
    };
}

function getPriorityLevel(score: number): 'low' | 'medium' | 'high' | 'urgent' {
    if (score >= 80) return 'urgent';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
}

function calculateProcessingTime(score: number): number {
    // Higher priority = faster processing
    if (score >= 80) return 1; // 1 day
    if (score >= 60) return 3; // 3 days
    if (score >= 40) return 7; // 1 week
    return 14; // 2 weeks
}

function calculateQueuePosition(score: number, totalClaims: number): number {
    // Simplified queue position calculation
    const percentile = score / 100;
    return Math.max(1, Math.ceil(totalClaims * (1 - percentile)));
}

export function getPriorityColor(level: string): string {
    const colors = {
        low: '#6b7280',
        medium: '#3b82f6',
        high: '#f59e0b',
        urgent: '#ef4444'
    };
    return colors[level as keyof typeof colors] || '#6b7280';
}

export function formatProcessingTime(days: number): string {
    if (days === 1) return '1 day';
    if (days < 7) return `${days} days`;
    const weeks = Math.ceil(days / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''}`;
}
