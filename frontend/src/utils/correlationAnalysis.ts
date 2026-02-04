/**
 * Correlation Analysis
 * Analyzes correlations between pools to identify systemic risks
 */

export interface CorrelationMatrix {
    pools: number[];
    matrix: number[][]; // Correlation coefficients (-1 to 1)
    averageCorrelation: number;
    highlyCorrelated: CorrelationPair[];
}

export interface CorrelationPair {
    pool1: number;
    pool2: number;
    correlation: number;
}

/**
 * Calculate correlation matrix for multiple pools
 */
export function calculateCorrelationMatrix(poolsData: any[]): CorrelationMatrix {
    const n = poolsData.length;
    const matrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
    const highlyCorrelated: CorrelationPair[] = [];

    // Calculate pairwise correlations
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i === j) {
                matrix[i][j] = 1; // Perfect correlation with itself
            } else if (i < j) {
                const correlation = calculatePairwiseCorrelation(poolsData[i], poolsData[j]);
                matrix[i][j] = correlation;
                matrix[j][i] = correlation; // Symmetric

                // Track highly correlated pairs
                if (Math.abs(correlation) > 0.7) {
                    highlyCorrelated.push({
                        pool1: poolsData[i].poolId,
                        pool2: poolsData[j].poolId,
                        correlation
                    });
                }
            }
        }
    }

    // Calculate average correlation (excluding diagonal)
    let sum = 0;
    let count = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                sum += Math.abs(matrix[i][j]);
                count++;
            }
        }
    }
    const averageCorrelation = count > 0 ? sum / count : 0;

    return {
        pools: poolsData.map(p => p.poolId),
        matrix,
        averageCorrelation,
        highlyCorrelated
    };
}

/**
 * Calculate pairwise correlation between two pools
 */
function calculatePairwiseCorrelation(pool1: any, pool2: any): number {
    // Extract risk factors
    const factors1 = [
        pool1.liquidityRatio,
        pool1.topContributorPercentage / 100,
        pool1.claimFrequency / 10,
        pool1.priceVolatility / 100,
        pool1.activeContributors / 100
    ];

    const factors2 = [
        pool2.liquidityRatio,
        pool2.topContributorPercentage / 100,
        pool2.claimFrequency / 10,
        pool2.priceVolatility / 100,
        pool2.activeContributors / 100
    ];

    return pearsonCorrelation(factors1, factors2);
}

/**
 * Calculate Pearson correlation coefficient
 */
function pearsonCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    if (n !== y.length || n === 0) return 0;

    const meanX = x.reduce((a, b) => a + b) / n;
    const meanY = y.reduce((a, b) => a + b) / n;

    let numerator = 0;
    let denomX = 0;
    let denomY = 0;

    for (let i = 0; i < n; i++) {
        const diffX = x[i] - meanX;
        const diffY = y[i] - meanY;
        numerator += diffX * diffY;
        denomX += diffX * diffX;
        denomY += diffY * diffY;
    }

    const denom = Math.sqrt(denomX * denomY);
    return denom === 0 ? 0 : numerator / denom;
}

/**
 * Identify systemic risk from correlations
 */
export function identifySystemicRisk(correlationMatrix: CorrelationMatrix): {
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    warnings: string[];
} {
    const warnings: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

    // Check average correlation
    if (correlationMatrix.averageCorrelation > 0.7) {
        riskLevel = 'critical';
        warnings.push('Critical: Very high average correlation indicates systemic risk');
    } else if (correlationMatrix.averageCorrelation > 0.5) {
        riskLevel = 'high';
        warnings.push('High correlation across pools - diversification benefits reduced');
    } else if (correlationMatrix.averageCorrelation > 0.3) {
        riskLevel = 'medium';
        warnings.push('Moderate correlation detected - monitor for systemic risk');
    }

    // Check highly correlated pairs
    if (correlationMatrix.highlyCorrelated.length > 0) {
        warnings.push(`${correlationMatrix.highlyCorrelated.length} highly correlated pool pairs detected`);
    }

    return { riskLevel, warnings };
}

/**
 * Get correlation strength description
 */
export function getCorrelationStrength(correlation: number): {
    strength: string;
    color: string;
} {
    const abs = Math.abs(correlation);
    if (abs >= 0.9) return { strength: 'Very Strong', color: '#dc2626' };
    if (abs >= 0.7) return { strength: 'Strong', color: '#f59e0b' };
    if (abs >= 0.5) return { strength: 'Moderate', color: '#eab308' };
    if (abs >= 0.3) return { strength: 'Weak', color: '#3b82f6' };
    return { strength: 'Very Weak', color: '#10b981' };
}
