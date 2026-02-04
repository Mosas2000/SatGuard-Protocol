/**
 * Risk Diversification Metrics
 * Measures and analyzes portfolio diversification
 */

export interface DiversificationMetrics {
    herfindahlIndex: number; // 0-1 (0 = perfect diversification, 1 = no diversification)
    effectiveN: number; // Effective number of positions
    concentrationRatio: number; // Top 3 positions as % of total
    giniCoefficient: number; // 0-1 (0 = perfect equality, 1 = perfect inequality)
    diversificationScore: number; // 0-100
    recommendations: string[];
}

export interface Position {
    poolId: number;
    value: number;
    weight: number; // Percentage of total
}

/**
 * Calculate comprehensive diversification metrics
 */
export function calculateDiversificationMetrics(positions: Position[]): DiversificationMetrics {
    if (positions.length === 0) {
        return {
            herfindahlIndex: 1,
            effectiveN: 0,
            concentrationRatio: 0,
            giniCoefficient: 1,
            diversificationScore: 0,
            recommendations: ['Add positions to start building a diversified portfolio']
        };
    }

    // Calculate Herfindahl-Hirschman Index (HHI)
    const herfindahlIndex = positions.reduce((sum, p) => sum + Math.pow(p.weight / 100, 2), 0);

    // Calculate effective number of positions
    const effectiveN = 1 / herfindahlIndex;

    // Calculate concentration ratio (top 3)
    const sortedByWeight = [...positions].sort((a, b) => b.weight - a.weight);
    const concentrationRatio = sortedByWeight
        .slice(0, 3)
        .reduce((sum, p) => sum + p.weight, 0);

    // Calculate Gini coefficient
    const giniCoefficient = calculateGini(positions.map(p => p.value));

    // Calculate overall diversification score
    const diversificationScore = calculateDiversificationScore(
        herfindahlIndex,
        effectiveN,
        concentrationRatio,
        giniCoefficient
    );

    // Generate recommendations
    const recommendations = generateDiversificationRecommendations(
        herfindahlIndex,
        effectiveN,
        concentrationRatio
    );

    return {
        herfindahlIndex,
        effectiveN,
        concentrationRatio,
        giniCoefficient,
        diversificationScore,
        recommendations
    };
}

/**
 * Calculate Gini coefficient
 */
function calculateGini(values: number[]): number {
    if (values.length === 0) return 0;

    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;
    const total = sorted.reduce((sum, v) => sum + v, 0);

    if (total === 0) return 0;

    let numerator = 0;
    for (let i = 0; i < n; i++) {
        numerator += (2 * (i + 1) - n - 1) * sorted[i];
    }

    return numerator / (n * total);
}

/**
 * Calculate diversification score (0-100)
 */
function calculateDiversificationScore(
    hhi: number,
    effectiveN: number,
    concentrationRatio: number,
    gini: number
): number {
    let score = 100;

    // HHI penalty (0-40 points)
    if (hhi > 0.5) score -= 40;
    else if (hhi > 0.3) score -= 25;
    else if (hhi > 0.15) score -= 10;

    // Effective N bonus (0-30 points)
    if (effectiveN >= 10) score += 0; // Already at max
    else if (effectiveN >= 5) score -= 10;
    else if (effectiveN >= 3) score -= 20;
    else score -= 30;

    // Concentration ratio penalty (0-20 points)
    if (concentrationRatio > 75) score -= 20;
    else if (concentrationRatio > 60) score -= 10;

    // Gini penalty (0-10 points)
    if (gini > 0.6) score -= 10;
    else if (gini > 0.4) score -= 5;

    return Math.max(0, Math.min(100, score));
}

/**
 * Generate diversification recommendations
 */
function generateDiversificationRecommendations(
    hhi: number,
    effectiveN: number,
    concentrationRatio: number
): string[] {
    const recommendations: string[] = [];

    if (hhi > 0.3) {
        recommendations.push('High concentration detected - consider adding more positions');
    }

    if (effectiveN < 5) {
        recommendations.push(`Increase effective positions (currently ${effectiveN.toFixed(1)}, target: 5+)`);
    }

    if (concentrationRatio > 60) {
        recommendations.push(`Top 3 positions represent ${concentrationRatio.toFixed(1)}% - rebalance for better distribution`);
    }

    if (recommendations.length === 0) {
        recommendations.push('Portfolio is well-diversified - maintain current allocation strategy');
    }

    return recommendations;
}

/**
 * Get diversification level
 */
export function getDiversificationLevel(score: number): {
    level: string;
    color: string;
} {
    if (score >= 80) return { level: 'Excellent', color: '#10b981' };
    if (score >= 60) return { level: 'Good', color: '#3b82f6' };
    if (score >= 40) return { level: 'Fair', color: '#f59e0b' };
    if (score >= 20) return { level: 'Poor', color: '#ef4444' };
    return { level: 'Very Poor', color: '#dc2626' };
}
