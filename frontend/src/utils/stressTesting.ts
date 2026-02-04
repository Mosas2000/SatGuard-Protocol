/**
 * Stress Testing Tools
 * Simulates extreme scenarios to test pool resilience
 */

import { type PoolRiskData } from './riskScoring';

export interface StressScenario {
    name: string;
    description: string;
    severity: 'mild' | 'moderate' | 'severe' | 'extreme';
    impacts: {
        liquidityChange: number; // Percentage change
        claimSurge: number; // Multiplier
        priceVolatility: number; // New volatility level
        contributorExit: number; // Percentage of contributors leaving
    };
}

export interface StressTestResult {
    scenario: StressScenario;
    poolData: PoolRiskData;
    stressedData: PoolRiskData;
    survivability: number; // 0-100
    criticalIssues: string[];
    recommendations: string[];
}

/**
 * Predefined stress scenarios
 */
export const STRESS_SCENARIOS: StressScenario[] = [
    {
        name: 'Market Crash',
        description: '50% price drop with increased volatility',
        severity: 'severe',
        impacts: {
            liquidityChange: -30,
            claimSurge: 2.0,
            priceVolatility: 80,
            contributorExit: 20
        }
    },
    {
        name: 'Bank Run',
        description: 'Mass withdrawal event',
        severity: 'extreme',
        impacts: {
            liquidityChange: -60,
            claimSurge: 1.5,
            priceVolatility: 60,
            contributorExit: 40
        }
    },
    {
        name: 'Claim Spike',
        description: 'Sudden increase in claims',
        severity: 'moderate',
        impacts: {
            liquidityChange: -20,
            claimSurge: 5.0,
            priceVolatility: 45,
            contributorExit: 10
        }
    },
    {
        name: 'Whale Exit',
        description: 'Largest contributor withdraws',
        severity: 'moderate',
        impacts: {
            liquidityChange: -35,
            claimSurge: 1.0,
            priceVolatility: 40,
            contributorExit: 5
        }
    },
    {
        name: 'Black Swan',
        description: 'Extreme unforeseen event',
        severity: 'extreme',
        impacts: {
            liquidityChange: -70,
            claimSurge: 10.0,
            priceVolatility: 95,
            contributorExit: 50
        }
    }
];

/**
 * Run stress test on pool
 */
export function runStressTest(
    poolData: PoolRiskData,
    scenario: StressScenario
): StressTestResult {
    // Apply stress impacts
    const stressedData: PoolRiskData = {
        ...poolData,
        liquidityRatio: Math.max(0, poolData.liquidityRatio + (scenario.impacts.liquidityChange / 100)),
        claimFrequency: poolData.claimFrequency * scenario.impacts.claimSurge,
        priceVolatility: scenario.impacts.priceVolatility,
        activeContributors: Math.floor(poolData.activeContributors * (1 - scenario.impacts.contributorExit / 100)),
        totalValue: poolData.totalValue * (1 + scenario.impacts.liquidityChange / 100)
    };

    // Calculate survivability
    const survivability = calculateSurvivability(stressedData);

    // Identify critical issues
    const criticalIssues = identifyCriticalIssues(stressedData);

    // Generate recommendations
    const recommendations = generateStressRecommendations(stressedData, scenario);

    return {
        scenario,
        poolData,
        stressedData,
        survivability,
        criticalIssues,
        recommendations
    };
}

/**
 * Calculate pool survivability under stress
 */
function calculateSurvivability(stressedData: PoolRiskData): number {
    let score = 100;

    // Liquidity check
    if (stressedData.liquidityRatio < 0.1) score -= 40;
    else if (stressedData.liquidityRatio < 0.3) score -= 25;
    else if (stressedData.liquidityRatio < 0.5) score -= 10;

    // Claims sustainability
    const claimRatio = stressedData.averageClaimSize * stressedData.claimFrequency / stressedData.totalValue;
    if (claimRatio > 0.5) score -= 30;
    else if (claimRatio > 0.3) score -= 15;

    // Contributor base
    if (stressedData.activeContributors < 3) score -= 20;
    else if (stressedData.activeContributors < 5) score -= 10;

    // Volatility impact
    if (stressedData.priceVolatility > 80) score -= 10;

    return Math.max(0, score);
}

/**
 * Identify critical issues
 */
function identifyCriticalIssues(stressedData: PoolRiskData): string[] {
    const issues: string[] = [];

    if (stressedData.liquidityRatio < 0.2) {
        issues.push('Critical liquidity shortage - pool may become insolvent');
    }

    if (stressedData.activeContributors < 3) {
        issues.push('Insufficient contributor diversity - high concentration risk');
    }

    const claimRatio = stressedData.averageClaimSize * stressedData.claimFrequency / stressedData.totalValue;
    if (claimRatio > 0.4) {
        issues.push('Unsustainable claim rate - pool reserves depleting rapidly');
    }

    if (stressedData.priceVolatility > 85) {
        issues.push('Extreme volatility - unpredictable pool valuation');
    }

    return issues;
}

/**
 * Generate stress test recommendations
 */
function generateStressRecommendations(
    stressedData: PoolRiskData,
    scenario: StressScenario
): string[] {
    const recommendations: string[] = [];

    if (stressedData.liquidityRatio < 0.3) {
        recommendations.push('Maintain higher liquidity buffer (>50%) to withstand stress');
    }

    if (scenario.severity === 'extreme' || scenario.severity === 'severe') {
        recommendations.push('Implement emergency pause mechanism for extreme scenarios');
    }

    if (stressedData.activeContributors < 5) {
        recommendations.push('Diversify contributor base before crisis occurs');
    }

    recommendations.push('Consider insurance or hedging for tail risk events');

    return recommendations;
}

/**
 * Run multiple stress tests
 */
export function runMultipleStressTests(poolData: PoolRiskData): StressTestResult[] {
    return STRESS_SCENARIOS.map(scenario => runStressTest(poolData, scenario));
}
