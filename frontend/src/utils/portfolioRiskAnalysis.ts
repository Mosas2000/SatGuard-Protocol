/**
 * Portfolio Risk Analysis
 * Analyzes risk across multiple pools and positions
 */

import { calculatePoolRiskScore, type PoolRiskData, type RiskScore } from './riskScoring';

export interface PoolPosition {
    poolId: number;
    poolName: string;
    contribution: number;
    coverage: number;
    poolData: PoolRiskData;
}

export interface PortfolioRisk {
    totalExposure: number;
    weightedRisk: number;
    diversificationScore: number; // 0-100
    positions: PositionRisk[];
    recommendations: string[];
}

export interface PositionRisk {
    poolId: number;
    poolName: string;
    allocation: number; // Percentage of portfolio
    riskScore: RiskScore;
    contribution: number;
    riskContribution: number; // How much this position contributes to portfolio risk
}

/**
 * Analyze portfolio risk across multiple positions
 */
export function analyzePortfolioRisk(positions: PoolPosition[]): PortfolioRisk {
    const totalExposure = positions.reduce((sum, p) => sum + p.contribution, 0);

    // Calculate risk for each position
    const positionRisks: PositionRisk[] = positions.map(position => {
        const riskScore = calculatePoolRiskScore(position.poolData);
        const allocation = totalExposure > 0 ? (position.contribution / totalExposure) * 100 : 0;
        const riskContribution = (allocation / 100) * riskScore.overall;

        return {
            poolId: position.poolId,
            poolName: position.poolName,
            allocation,
            riskScore,
            contribution: position.contribution,
            riskContribution
        };
    });

    // Calculate weighted average risk
    const weightedRisk = positionRisks.reduce((sum, p) => sum + p.riskContribution, 0);

    // Calculate diversification score
    const diversificationScore = calculateDiversificationScore(positionRisks);

    // Generate recommendations
    const recommendations = generatePortfolioRecommendations(
        positionRisks,
        weightedRisk,
        diversificationScore
    );

    return {
        totalExposure,
        weightedRisk,
        diversificationScore,
        positions: positionRisks,
        recommendations
    };
}

/**
 * Calculate diversification score
 */
function calculateDiversificationScore(positions: PositionRisk[]): number {
    if (positions.length === 0) return 0;
    if (positions.length === 1) return 20; // Low diversification

    // Check allocation distribution
    const maxAllocation = Math.max(...positions.map(p => p.allocation));
    const avgAllocation = 100 / positions.length;

    let score = 50; // Base score

    // Bonus for number of positions
    if (positions.length >= 10) score += 20;
    else if (positions.length >= 5) score += 10;

    // Penalty for concentration
    if (maxAllocation > 50) score -= 30;
    else if (maxAllocation > 30) score -= 15;

    // Bonus for even distribution
    const allocationVariance = positions.reduce((sum, p) => {
        return sum + Math.pow(p.allocation - avgAllocation, 2);
    }, 0) / positions.length;

    if (allocationVariance < 50) score += 15;
    else if (allocationVariance < 100) score += 5;

    return Math.max(0, Math.min(100, score));
}

/**
 * Generate portfolio recommendations
 */
function generatePortfolioRecommendations(
    positions: PositionRisk[],
    weightedRisk: number,
    diversificationScore: number
): string[] {
    const recommendations: string[] = [];

    // Overall risk recommendations
    if (weightedRisk > 60) {
        recommendations.push('Portfolio has high overall risk - consider rebalancing to lower-risk pools');
    }

    // Diversification recommendations
    if (diversificationScore < 40) {
        recommendations.push('Improve diversification by adding more pools to your portfolio');
    }

    // Concentration recommendations
    const highConcentration = positions.filter(p => p.allocation > 30);
    if (highConcentration.length > 0) {
        recommendations.push(`Reduce concentration in ${highConcentration[0].poolName} (${highConcentration[0].allocation.toFixed(1)}%)`);
    }

    // High-risk position recommendations
    const highRiskPositions = positions.filter(p => p.riskScore.overall > 70);
    if (highRiskPositions.length > 0) {
        recommendations.push(`Consider reducing exposure to high-risk pools: ${highRiskPositions.map(p => p.poolName).join(', ')}`);
    }

    // Rebalancing recommendation
    if (positions.length > 1) {
        const idealAllocation = 100 / positions.length;
        const needsRebalancing = positions.some(p => Math.abs(p.allocation - idealAllocation) > 15);
        if (needsRebalancing) {
            recommendations.push('Rebalance portfolio to achieve more even allocation across pools');
        }
    }

    return recommendations;
}

/**
 * Calculate correlation between pools
 */
export function calculatePoolCorrelation(pool1: PoolRiskData, pool2: PoolRiskData): number {
    // Simplified correlation based on risk factors
    const factors1 = [
        pool1.liquidityRatio,
        pool1.topContributorPercentage / 100,
        pool1.claimFrequency / 10,
        pool1.priceVolatility / 100
    ];

    const factors2 = [
        pool2.liquidityRatio,
        pool2.topContributorPercentage / 100,
        pool2.claimFrequency / 10,
        pool2.priceVolatility / 100
    ];

    // Calculate Pearson correlation coefficient
    const mean1 = factors1.reduce((a, b) => a + b) / factors1.length;
    const mean2 = factors2.reduce((a, b) => a + b) / factors2.length;

    let numerator = 0;
    let denom1 = 0;
    let denom2 = 0;

    for (let i = 0; i < factors1.length; i++) {
        const diff1 = factors1[i] - mean1;
        const diff2 = factors2[i] - mean2;
        numerator += diff1 * diff2;
        denom1 += diff1 * diff1;
        denom2 += diff2 * diff2;
    }

    const correlation = numerator / Math.sqrt(denom1 * denom2);
    return isNaN(correlation) ? 0 : correlation;
}

/**
 * Get portfolio risk level
 */
export function getPortfolioRiskLevel(weightedRisk: number): {
    level: string;
    color: string;
} {
    if (weightedRisk >= 70) return { level: 'Very High', color: '#dc2626' };
    if (weightedRisk >= 50) return { level: 'High', color: '#f59e0b' };
    if (weightedRisk >= 30) return { level: 'Medium', color: '#eab308' };
    if (weightedRisk >= 15) return { level: 'Low', color: '#3b82f6' };
    return { level: 'Very Low', color: '#10b981' };
}
