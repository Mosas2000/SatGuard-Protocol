/**
 * Premium Calculator Utility
 * Calculates dynamic insurance premiums based on risk factors
 */

export interface RiskFactors {
    poolUtilization: number; // 0-100%
    claimHistory: number; // Number of past claims
    poolAge: number; // Age in blocks
    totalFunds: number; // Total pool funds in micro-STX
    coverageAmount: number; // Requested coverage in micro-STX
    participantCount: number; // Number of contributors
}

export interface PremiumCalculation {
    basePremium: number;
    riskMultiplier: number;
    finalPremium: number;
    breakdown: {
        utilizationFactor: number;
        historyFactor: number;
        ageFactor: number;
        sizeFactor: number;
    };
}

/**
 * Calculate dynamic premium based on multiple risk factors
 */
export function calculateDynamicPremium(
    factors: RiskFactors,
    baseRate: number = 0.05 // 5% base rate
): PremiumCalculation {
    // Utilization factor (higher utilization = higher premium)
    const utilizationFactor = 1 + (factors.poolUtilization / 100) * 0.5;

    // Claim history factor (more claims = higher premium)
    const historyFactor = 1 + Math.min(factors.claimHistory * 0.1, 1.0);

    // Pool age factor (newer pools = higher premium)
    const ageInDays = factors.poolAge / 144; // Assuming ~144 blocks per day
    const ageFactor = Math.max(1.5 - (ageInDays / 365) * 0.5, 1.0);

    // Pool size factor (smaller pools = higher premium)
    const sizeThreshold = 100_000_000; // 100 STX in micro-STX
    const sizeFactor = factors.totalFunds < sizeThreshold
        ? 1.3
        : 1.0;

    // Calculate total risk multiplier
    const riskMultiplier = utilizationFactor * historyFactor * ageFactor * sizeFactor;

    // Calculate base premium
    const basePremium = factors.coverageAmount * baseRate;

    // Calculate final premium
    const finalPremium = Math.floor(basePremium * riskMultiplier);

    return {
        basePremium,
        riskMultiplier,
        finalPremium,
        breakdown: {
            utilizationFactor,
            historyFactor,
            ageFactor,
            sizeFactor
        }
    };
}

/**
 * Calculate optimal contribution amount based on risk tolerance
 */
export function calculateOptimalContribution(
    availableFunds: number,
    riskTolerance: 'low' | 'medium' | 'high',
    poolRiskScore: number // 0-100
): number {
    const riskMultipliers = {
        low: 0.1,
        medium: 0.3,
        high: 0.6
    };

    const multiplier = riskMultipliers[riskTolerance];
    const riskAdjustment = 1 - (poolRiskScore / 200); // Reduce for risky pools

    return Math.floor(availableFunds * multiplier * riskAdjustment);
}

/**
 * Calculate pool risk score (0-100)
 */
export function calculatePoolRiskScore(factors: RiskFactors): number {
    const weights = {
        utilization: 0.3,
        history: 0.25,
        age: 0.2,
        size: 0.15,
        participants: 0.1
    };

    // Normalize each factor to 0-100 scale
    const utilizationScore = factors.poolUtilization;
    const historyScore = Math.min(factors.claimHistory * 10, 100);
    const ageScore = Math.max(100 - (factors.poolAge / 144 / 365) * 100, 0);
    const sizeScore = factors.totalFunds < 100_000_000 ? 70 : 30;
    const participantScore = factors.participantCount < 10 ? 80 : 40;

    const totalScore =
        utilizationScore * weights.utilization +
        historyScore * weights.history +
        ageScore * weights.age +
        sizeScore * weights.size +
        participantScore * weights.participants;

    return Math.min(Math.floor(totalScore), 100);
}

/**
 * Format premium for display
 */
export function formatPremium(microStx: number): string {
    const stx = microStx / 1_000_000;
    return `${stx.toFixed(6)} STX`;
}

/**
 * Calculate annual premium rate
 */
export function calculateAnnualRate(
    premium: number,
    coverage: number
): number {
    return (premium / coverage) * 100;
}
