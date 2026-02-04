/**
 * Risk-Based Pricing
 * Calculates premiums based on risk assessment
 */

import { calculatePoolRiskScore, type PoolRiskData } from './riskScoring';

export interface PricingTier {
    name: string;
    riskRange: [number, number]; // [min, max] risk score
    baseRate: number; // Base premium rate (%)
    multiplier: number;
}

export interface RiskBasedPremium {
    basePremium: number;
    riskAdjustment: number;
    finalPremium: number;
    tier: PricingTier;
    breakdown: {
        coverage: number;
        riskMultiplier: number;
        poolFee: number;
    };
}

/**
 * Pricing tiers based on risk levels
 */
export const PRICING_TIERS: PricingTier[] = [
    {
        name: 'Very Low Risk',
        riskRange: [0, 20],
        baseRate: 0.5,
        multiplier: 1.0
    },
    {
        name: 'Low Risk',
        riskRange: [20, 40],
        baseRate: 1.0,
        multiplier: 1.2
    },
    {
        name: 'Medium Risk',
        riskRange: [40, 60],
        baseRate: 2.0,
        multiplier: 1.5
    },
    {
        name: 'High Risk',
        riskRange: [60, 80],
        baseRate: 4.0,
        multiplier: 2.0
    },
    {
        name: 'Very High Risk',
        riskRange: [80, 100],
        baseRate: 8.0,
        multiplier: 3.0
    }
];

/**
 * Calculate risk-based premium
 */
export function calculateRiskBasedPremium(
    coverageAmount: number,
    poolData: PoolRiskData,
    duration: number = 30 // days
): RiskBasedPremium {
    const riskScore = calculatePoolRiskScore(poolData);
    const tier = getPricingTier(riskScore.overall);

    // Base premium calculation
    const basePremium = (coverageAmount * tier.baseRate) / 100;

    // Risk adjustment based on specific factors
    const riskAdjustment = calculateRiskAdjustment(
        basePremium,
        riskScore.breakdown,
        tier.multiplier
    );

    // Duration adjustment
    const durationMultiplier = duration / 30; // Normalize to monthly

    // Final premium
    const finalPremium = (basePremium + riskAdjustment) * durationMultiplier;

    // Breakdown
    const breakdown = {
        coverage: basePremium * durationMultiplier,
        riskMultiplier: riskAdjustment * durationMultiplier,
        poolFee: finalPremium * 0.05 // 5% pool fee
    };

    return {
        basePremium,
        riskAdjustment,
        finalPremium: finalPremium + breakdown.poolFee,
        tier,
        breakdown
    };
}

/**
 * Get pricing tier for risk score
 */
function getPricingTier(riskScore: number): PricingTier {
    return PRICING_TIERS.find(
        tier => riskScore >= tier.riskRange[0] && riskScore < tier.riskRange[1]
    ) || PRICING_TIERS[PRICING_TIERS.length - 1];
}

/**
 * Calculate risk adjustment
 */
function calculateRiskAdjustment(
    basePremium: number,
    riskBreakdown: Record<string, number>,
    multiplier: number
): number {
    let adjustment = 0;

    // Liquidity risk adjustment
    if (riskBreakdown.liquidity > 60) {
        adjustment += basePremium * 0.3;
    } else if (riskBreakdown.liquidity > 40) {
        adjustment += basePremium * 0.15;
    }

    // Concentration risk adjustment
    if (riskBreakdown.concentration > 60) {
        adjustment += basePremium * 0.25;
    } else if (riskBreakdown.concentration > 40) {
        adjustment += basePremium * 0.1;
    }

    // Claims risk adjustment
    if (riskBreakdown.claims > 60) {
        adjustment += basePremium * 0.4;
    } else if (riskBreakdown.claims > 40) {
        adjustment += basePremium * 0.2;
    }

    return adjustment * multiplier;
}

/**
 * Calculate premium discount for good risk management
 */
export function calculateDiscount(
    poolData: PoolRiskData,
    hasInsuranceHistory: boolean,
    loyaltyMonths: number
): number {
    let discount = 0;

    // Low risk discount
    const riskScore = calculatePoolRiskScore(poolData);
    if (riskScore.overall < 20) {
        discount += 10; // 10% discount
    } else if (riskScore.overall < 40) {
        discount += 5; // 5% discount
    }

    // No claims history discount
    if (hasInsuranceHistory && poolData.claimFrequency === 0) {
        discount += 15; // 15% discount
    }

    // Loyalty discount
    if (loyaltyMonths >= 12) {
        discount += 10;
    } else if (loyaltyMonths >= 6) {
        discount += 5;
    }

    return Math.min(discount, 30); // Max 30% discount
}

/**
 * Format premium for display
 */
export function formatPremium(amount: number): string {
    return `${amount.toFixed(2)} STX`;
}
