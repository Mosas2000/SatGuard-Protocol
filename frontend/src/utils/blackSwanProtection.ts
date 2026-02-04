/**
 * Black Swan Protection
 * Strategies and mechanisms for extreme tail risk events
 */

export interface BlackSwanProtection {
    coverage: number; // Protection amount
    premium: number; // Cost of protection
    triggers: BlackSwanTrigger[];
    payoutStructure: PayoutTier[];
    recommendations: string[];
}

export interface BlackSwanTrigger {
    event: string;
    probability: number; // Annual probability (%)
    severity: 'catastrophic' | 'severe' | 'major';
    threshold: number;
}

export interface PayoutTier {
    lossRange: [number, number]; // [min, max] percentage loss
    payoutMultiplier: number;
}

/**
 * Predefined black swan triggers
 */
export const BLACK_SWAN_TRIGGERS: BlackSwanTrigger[] = [
    {
        event: 'Market Crash (>70% drop)',
        probability: 0.5,
        severity: 'catastrophic',
        threshold: 70
    },
    {
        event: 'Protocol Exploit',
        probability: 1.0,
        severity: 'severe',
        threshold: 50
    },
    {
        event: 'Regulatory Shutdown',
        probability: 0.3,
        severity: 'catastrophic',
        threshold: 90
    },
    {
        event: 'Smart Contract Bug',
        probability: 2.0,
        severity: 'major',
        threshold: 30
    },
    {
        event: 'Oracle Failure',
        probability: 1.5,
        severity: 'severe',
        threshold: 40
    }
];

/**
 * Calculate black swan protection premium
 */
export function calculateBlackSwanPremium(
    coverageAmount: number,
    poolValue: number,
    riskProfile: 'conservative' | 'moderate' | 'aggressive'
): BlackSwanProtection {
    const baseRate = {
        conservative: 0.02, // 2%
        moderate: 0.015, // 1.5%
        aggressive: 0.01 // 1%
    }[riskProfile];

    const premium = coverageAmount * baseRate;

    // Define payout structure
    const payoutStructure: PayoutTier[] = [
        { lossRange: [0, 30], payoutMultiplier: 0 }, // No payout for small losses
        { lossRange: [30, 50], payoutMultiplier: 0.5 }, // 50% payout
        { lossRange: [50, 70], payoutMultiplier: 1.0 }, // 100% payout
        { lossRange: [70, 100], payoutMultiplier: 1.5 } // 150% payout for catastrophic
    ];

    const recommendations = generateBlackSwanRecommendations(poolValue, coverageAmount);

    return {
        coverage: coverageAmount,
        premium,
        triggers: BLACK_SWAN_TRIGGERS,
        payoutStructure,
        recommendations
    };
}

/**
 * Calculate expected loss from black swan events
 */
export function calculateExpectedBlackSwanLoss(
    poolValue: number,
    triggers: BlackSwanTrigger[]
): number {
    return triggers.reduce((total, trigger) => {
        const annualProbability = trigger.probability / 100;
        const expectedLoss = poolValue * (trigger.threshold / 100);
        return total + (annualProbability * expectedLoss);
    }, 0);
}

/**
 * Generate black swan protection recommendations
 */
function generateBlackSwanRecommendations(
    poolValue: number,
    coverageAmount: number
): string[] {
    const recommendations: string[] = [];
    const coverageRatio = coverageAmount / poolValue;

    if (coverageRatio < 0.3) {
        recommendations.push('Consider increasing coverage to at least 30% of pool value');
    }

    recommendations.push('Maintain emergency liquidity buffer (20%+ of pool value)');
    recommendations.push('Implement circuit breakers for extreme volatility');
    recommendations.push('Diversify across uncorrelated assets');
    recommendations.push('Regular stress testing for tail risk scenarios');

    return recommendations;
}

/**
 * Assess black swan vulnerability
 */
export function assessBlackSwanVulnerability(
    poolData: any
): {
    vulnerabilityScore: number; // 0-100
    criticalRisks: string[];
    protectionGap: number;
} {
    let vulnerabilityScore = 0;
    const criticalRisks: string[] = [];

    // Check liquidity buffer
    if (poolData.liquidityRatio < 0.2) {
        vulnerabilityScore += 30;
        criticalRisks.push('Insufficient liquidity buffer for extreme events');
    }

    // Check concentration
    if (poolData.topContributorPercentage > 40) {
        vulnerabilityScore += 25;
        criticalRisks.push('High concentration increases vulnerability to single-point failures');
    }

    // Check volatility
    if (poolData.priceVolatility > 70) {
        vulnerabilityScore += 20;
        criticalRisks.push('High volatility increases tail risk exposure');
    }

    // Check pool age (newer pools more vulnerable)
    if (poolData.poolAge < 30) {
        vulnerabilityScore += 15;
        criticalRisks.push('New pool lacks historical stress test data');
    }

    // Check governance
    if (poolData.activeContributors < 5) {
        vulnerabilityScore += 10;
        criticalRisks.push('Limited governance participation reduces crisis response capability');
    }

    // Calculate protection gap
    const expectedLoss = calculateExpectedBlackSwanLoss(poolData.totalValue, BLACK_SWAN_TRIGGERS);
    const currentBuffer = poolData.totalValue * poolData.liquidityRatio;
    const protectionGap = Math.max(0, expectedLoss - currentBuffer);

    return {
        vulnerabilityScore: Math.min(100, vulnerabilityScore),
        criticalRisks,
        protectionGap
    };
}

/**
 * Get vulnerability level
 */
export function getVulnerabilityLevel(score: number): {
    level: string;
    color: string;
} {
    if (score >= 70) return { level: 'Critical', color: '#dc2626' };
    if (score >= 50) return { level: 'High', color: '#f59e0b' };
    if (score >= 30) return { level: 'Medium', color: '#eab308' };
    if (score >= 15) return { level: 'Low', color: '#3b82f6' };
    return { level: 'Very Low', color: '#10b981' };
}
