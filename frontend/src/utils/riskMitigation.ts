/**
 * Risk Mitigation Strategies
 * Provides actionable strategies to reduce pool risk
 */

import { type RiskScore } from './riskScoring';

export interface MitigationStrategy {
    id: string;
    category: 'liquidity' | 'concentration' | 'volatility' | 'claims' | 'governance';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'high' | 'medium' | 'low';
    timeframe: string;
    steps: string[];
}

/**
 * Get mitigation strategies based on risk breakdown
 */
export function getMitigationStrategies(riskScore: RiskScore): MitigationStrategy[] {
    const strategies: MitigationStrategy[] = [];

    // Liquidity risk strategies
    if (riskScore.breakdown.liquidity > 50) {
        strategies.push({
            id: 'increase-liquidity',
            category: 'liquidity',
            title: 'Increase Pool Liquidity',
            description: 'Attract more contributions to improve liquidity ratio',
            impact: 'high',
            effort: 'medium',
            timeframe: '2-4 weeks',
            steps: [
                'Launch liquidity mining campaign',
                'Offer bonus rewards for new contributors',
                'Reduce withdrawal fees temporarily',
                'Partner with other protocols for liquidity'
            ]
        });
    }

    // Concentration risk strategies
    if (riskScore.breakdown.concentration > 50) {
        strategies.push({
            id: 'diversify-contributors',
            category: 'concentration',
            title: 'Diversify Contributor Base',
            description: 'Reduce dependence on large contributors',
            impact: 'high',
            effort: 'high',
            timeframe: '4-8 weeks',
            steps: [
                'Set maximum contribution limits per address',
                'Incentivize smaller contributors with bonuses',
                'Launch community outreach campaign',
                'Create tiered reward structure'
            ]
        });
    }

    // Volatility risk strategies
    if (riskScore.breakdown.volatility > 50) {
        strategies.push({
            id: 'hedge-volatility',
            category: 'volatility',
            title: 'Implement Volatility Hedging',
            description: 'Reduce exposure to price fluctuations',
            impact: 'medium',
            effort: 'high',
            timeframe: '1-2 weeks',
            steps: [
                'Allocate portion of pool to stablecoins',
                'Use options or derivatives for hedging',
                'Implement dynamic rebalancing',
                'Set volatility-based contribution limits'
            ]
        });
    }

    // Claims risk strategies
    if (riskScore.breakdown.claims > 50) {
        strategies.push({
            id: 'optimize-claims',
            category: 'claims',
            title: 'Optimize Claims Process',
            description: 'Reduce claim frequency and improve validation',
            impact: 'high',
            effort: 'medium',
            timeframe: '2-3 weeks',
            steps: [
                'Implement stricter claim validation',
                'Increase evidence requirements',
                'Add fraud detection mechanisms',
                'Adjust coverage limits based on risk'
            ]
        });
    }

    // Governance risk strategies
    if (riskScore.breakdown.governance > 50) {
        strategies.push({
            id: 'improve-governance',
            category: 'governance',
            title: 'Strengthen Governance',
            description: 'Improve participation and decision-making',
            impact: 'medium',
            effort: 'low',
            timeframe: '1-2 weeks',
            steps: [
                'Increase voting rewards',
                'Simplify proposal creation process',
                'Add governance tutorials',
                'Implement delegation features'
            ]
        });
    }

    return strategies;
}

/**
 * Calculate strategy priority score
 */
export function calculateStrategyPriority(strategy: MitigationStrategy): number {
    const impactScores = { high: 3, medium: 2, low: 1 };
    const effortScores = { high: 1, medium: 2, low: 3 };

    const impactScore = impactScores[strategy.impact];
    const effortScore = effortScores[strategy.effort];

    return (impactScore * 2 + effortScore) / 3;
}

/**
 * Get quick wins (high impact, low effort)
 */
export function getQuickWins(strategies: MitigationStrategy[]): MitigationStrategy[] {
    return strategies.filter(
        s => s.impact === 'high' && (s.effort === 'low' || s.effort === 'medium')
    );
}
