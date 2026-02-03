/**
 * Pool Health Scoring System
 * Monitors and scores insurance pool health metrics
 */

import { RiskFactors, calculatePoolRiskScore } from './premiumCalculator';

export interface PoolHealthMetrics {
    poolId: number;
    totalFunds: number;
    utilization: number;
    claimCount: number;
    contributorCount: number;
    avgClaimSize: number;
    poolAge: number;
    lastActivityBlock: number;
}

export interface HealthScore {
    overall: number; // 0-100 (100 = healthiest)
    liquidity: number;
    activity: number;
    diversification: number;
    stability: number;
    status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    warnings: string[];
    recommendations: string[];
}

/**
 * Calculate comprehensive pool health score
 */
export function calculatePoolHealth(metrics: PoolHealthMetrics): HealthScore {
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Liquidity Score (0-100)
    const liquidityScore = calculateLiquidityScore(metrics, warnings, recommendations);

    // Activity Score (0-100)
    const activityScore = calculateActivityScore(metrics, warnings, recommendations);

    // Diversification Score (0-100)
    const diversificationScore = calculateDiversificationScore(metrics, warnings, recommendations);

    // Stability Score (0-100)
    const stabilityScore = calculateStabilityScore(metrics, warnings, recommendations);

    // Overall weighted score
    const overall = Math.floor(
        liquidityScore * 0.35 +
        activityScore * 0.25 +
        diversificationScore * 0.25 +
        stabilityScore * 0.15
    );

    const status = getHealthStatus(overall);

    return {
        overall,
        liquidity: liquidityScore,
        activity: activityScore,
        diversification: diversificationScore,
        stability: stabilityScore,
        status,
        warnings,
        recommendations
    };
}

function calculateLiquidityScore(
    metrics: PoolHealthMetrics,
    warnings: string[],
    recommendations: string[]
): number {
    const utilizationRate = metrics.utilization;

    let score = 100;

    // Penalize high utilization
    if (utilizationRate > 90) {
        score -= 40;
        warnings.push('Critical: Pool utilization above 90%');
        recommendations.push('Encourage new contributions to increase liquidity');
    } else if (utilizationRate > 75) {
        score -= 25;
        warnings.push('High utilization detected');
        recommendations.push('Monitor pool closely for liquidity issues');
    } else if (utilizationRate > 60) {
        score -= 10;
    }

    // Penalize low liquidity
    const minLiquidity = 50_000_000; // 50 STX
    if (metrics.totalFunds < minLiquidity) {
        score -= 30;
        warnings.push('Low total liquidity');
        recommendations.push('Increase pool size through marketing or incentives');
    }

    return Math.max(score, 0);
}

function calculateActivityScore(
    metrics: PoolHealthMetrics,
    warnings: string[],
    recommendations: string[]
): number {
    const currentBlock = 100000; // Would be fetched from chain
    const blocksSinceActivity = currentBlock - metrics.lastActivityBlock;
    const daysSinceActivity = blocksSinceActivity / 144; // ~144 blocks/day

    let score = 100;

    if (daysSinceActivity > 30) {
        score -= 50;
        warnings.push('No activity in over 30 days');
        recommendations.push('Consider pool merger or closure');
    } else if (daysSinceActivity > 14) {
        score -= 30;
        warnings.push('Low activity detected');
        recommendations.push('Engage community to increase participation');
    } else if (daysSinceActivity > 7) {
        score -= 15;
    }

    // Bonus for consistent activity
    if (daysSinceActivity < 1) {
        score = Math.min(score + 10, 100);
    }

    return Math.max(score, 0);
}

function calculateDiversificationScore(
    metrics: PoolHealthMetrics,
    warnings: string[],
    recommendations: string[]
): number {
    let score = 100;

    // Check contributor count
    if (metrics.contributorCount < 5) {
        score -= 40;
        warnings.push('Low contributor diversification');
        recommendations.push('Attract more contributors to reduce concentration risk');
    } else if (metrics.contributorCount < 10) {
        score -= 20;
        recommendations.push('Increase contributor base for better risk distribution');
    } else if (metrics.contributorCount > 50) {
        score = Math.min(score + 10, 100);
    }

    // Check average claim size vs total funds
    if (metrics.avgClaimSize > metrics.totalFunds * 0.5) {
        score -= 30;
        warnings.push('Average claim size too large relative to pool');
        recommendations.push('Consider lowering maximum coverage limits');
    }

    return Math.max(score, 0);
}

function calculateStabilityScore(
    metrics: PoolHealthMetrics,
    warnings: string[],
    recommendations: string[]
): number {
    let score = 100;

    // Pool age factor (mature pools are more stable)
    const ageInDays = metrics.poolAge / 144;
    if (ageInDays < 7) {
        score -= 30;
        recommendations.push('New pool - monitor closely during initial period');
    } else if (ageInDays < 30) {
        score -= 15;
    } else if (ageInDays > 180) {
        score = Math.min(score + 10, 100);
    }

    // Claim frequency
    const claimRate = metrics.claimCount / Math.max(ageInDays, 1);
    if (claimRate > 1) {
        score -= 25;
        warnings.push('High claim frequency detected');
        recommendations.push('Review claim approval process and risk assessment');
    } else if (claimRate > 0.5) {
        score -= 10;
    }

    return Math.max(score, 0);
}

function getHealthStatus(score: number): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'fair';
    if (score >= 40) return 'poor';
    return 'critical';
}

/**
 * Check if pool needs rebalancing
 */
export function needsRebalancing(health: HealthScore): boolean {
    return health.overall < 60 || health.liquidity < 50;
}

/**
 * Generate rebalancing recommendations
 */
export function getRebalancingActions(
    metrics: PoolHealthMetrics,
    health: HealthScore
): string[] {
    const actions: string[] = [];

    if (health.liquidity < 50) {
        actions.push('Increase pool liquidity through contributor incentives');
        actions.push('Consider temporary pause on new claims');
    }

    if (health.diversification < 50) {
        actions.push('Launch contributor recruitment campaign');
        actions.push('Reduce maximum coverage to attract smaller contributors');
    }

    if (health.activity < 50) {
        actions.push('Engage community through governance proposals');
        actions.push('Review and adjust premium rates');
    }

    if (health.stability < 50) {
        actions.push('Implement stricter claim verification');
        actions.push('Adjust risk parameters');
    }

    return actions;
}

/**
 * Format health score for display
 */
export function formatHealthScore(score: number): string {
    return `${score}/100`;
}

/**
 * Get color code for health status
 */
export function getHealthColor(status: string): string {
    const colors = {
        excellent: '#10b981',
        good: '#3b82f6',
        fair: '#f59e0b',
        poor: '#ef4444',
        critical: '#dc2626'
    };
    return colors[status as keyof typeof colors] || '#6b7280';
}
