/**
 * Risk Scoring Algorithm
 * Calculates comprehensive risk scores for pools and claims
 */

export interface RiskScore {
    overall: number; // 0-100 (0 = lowest risk, 100 = highest risk)
    breakdown: {
        liquidity: number;
        concentration: number;
        volatility: number;
        claims: number;
        governance: number;
    };
    level: 'very-low' | 'low' | 'medium' | 'high' | 'very-high';
    color: string;
}

export interface PoolRiskData {
    totalValue: number;
    liquidityRatio: number; // Available / Total
    topContributorPercentage: number; // Largest contributor %
    claimFrequency: number; // Claims per month
    averageClaimSize: number;
    poolAge: number; // in days
    activeContributors: number;
    priceVolatility: number; // 0-100
}

/**
 * Calculate overall risk score for a pool
 */
export function calculatePoolRiskScore(data: PoolRiskData): RiskScore {
    // Liquidity risk (0-100)
    const liquidityRisk = calculateLiquidityRisk(data.liquidityRatio);

    // Concentration risk (0-100)
    const concentrationRisk = calculateConcentrationRisk(
        data.topContributorPercentage,
        data.activeContributors
    );

    // Volatility risk (0-100)
    const volatilityRisk = data.priceVolatility;

    // Claims risk (0-100)
    const claimsRisk = calculateClaimsRisk(
        data.claimFrequency,
        data.averageClaimSize,
        data.totalValue
    );

    // Governance risk (0-100)
    const governanceRisk = calculateGovernanceRisk(data.poolAge, data.activeContributors);

    // Weighted average
    const overall = Math.round(
        liquidityRisk * 0.25 +
        concentrationRisk * 0.20 +
        volatilityRisk * 0.20 +
        claimsRisk * 0.25 +
        governanceRisk * 0.10
    );

    return {
        overall,
        breakdown: {
            liquidity: liquidityRisk,
            concentration: concentrationRisk,
            volatility: volatilityRisk,
            claims: claimsRisk,
            governance: governanceRisk
        },
        level: getRiskLevel(overall),
        color: getRiskColor(overall)
    };
}

/**
 * Calculate liquidity risk
 */
function calculateLiquidityRisk(liquidityRatio: number): number {
    if (liquidityRatio >= 0.8) return 10; // Very low risk
    if (liquidityRatio >= 0.6) return 25; // Low risk
    if (liquidityRatio >= 0.4) return 50; // Medium risk
    if (liquidityRatio >= 0.2) return 75; // High risk
    return 95; // Very high risk
}

/**
 * Calculate concentration risk
 */
function calculateConcentrationRisk(
    topContributorPercentage: number,
    activeContributors: number
): number {
    let risk = 0;

    // Single contributor dominance
    if (topContributorPercentage >= 50) risk += 50;
    else if (topContributorPercentage >= 30) risk += 30;
    else if (topContributorPercentage >= 20) risk += 15;

    // Contributor diversity
    if (activeContributors < 5) risk += 40;
    else if (activeContributors < 10) risk += 25;
    else if (activeContributors < 20) risk += 10;

    return Math.min(risk, 100);
}

/**
 * Calculate claims risk
 */
function calculateClaimsRisk(
    claimFrequency: number,
    averageClaimSize: number,
    totalValue: number
): number {
    let risk = 0;

    // Claim frequency risk
    if (claimFrequency > 10) risk += 40;
    else if (claimFrequency > 5) risk += 25;
    else if (claimFrequency > 2) risk += 10;

    // Claim size risk
    const claimRatio = totalValue > 0 ? averageClaimSize / totalValue : 0;
    if (claimRatio > 0.3) risk += 50;
    else if (claimRatio > 0.2) risk += 30;
    else if (claimRatio > 0.1) risk += 15;

    return Math.min(risk, 100);
}

/**
 * Calculate governance risk
 */
function calculateGovernanceRisk(poolAge: number, activeContributors: number): number {
    let risk = 0;

    // New pool risk
    if (poolAge < 7) risk += 40;
    else if (poolAge < 30) risk += 20;
    else if (poolAge < 90) risk += 10;

    // Governance participation
    if (activeContributors < 3) risk += 50;
    else if (activeContributors < 10) risk += 25;

    return Math.min(risk, 100);
}

/**
 * Get risk level from score
 */
export function getRiskLevel(score: number): RiskScore['level'] {
    if (score >= 80) return 'very-high';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    if (score >= 20) return 'low';
    return 'very-low';
}

/**
 * Get risk color
 */
export function getRiskColor(score: number): string {
    if (score >= 80) return '#dc2626'; // Red
    if (score >= 60) return '#f59e0b'; // Orange
    if (score >= 40) return '#eab308'; // Yellow
    if (score >= 20) return '#3b82f6'; // Blue
    return '#10b981'; // Green
}

/**
 * Get risk recommendations
 */
export function getRiskRecommendations(riskScore: RiskScore): string[] {
    const recommendations: string[] = [];

    if (riskScore.breakdown.liquidity > 60) {
        recommendations.push('Increase pool liquidity to reduce withdrawal risk');
    }

    if (riskScore.breakdown.concentration > 60) {
        recommendations.push('Diversify contributor base to reduce concentration risk');
    }

    if (riskScore.breakdown.volatility > 60) {
        recommendations.push('Consider hedging strategies to manage price volatility');
    }

    if (riskScore.breakdown.claims > 60) {
        recommendations.push('Review claim patterns and adjust coverage limits');
    }

    if (riskScore.breakdown.governance > 60) {
        recommendations.push('Improve governance participation and pool maturity');
    }

    return recommendations;
}
