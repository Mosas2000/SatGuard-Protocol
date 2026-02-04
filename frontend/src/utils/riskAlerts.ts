/**
 * Risk Alerts System
 * Monitors and alerts on risk threshold breaches
 */

export interface RiskAlert {
    id: string;
    poolId: number;
    severity: 'critical' | 'warning' | 'info';
    category: 'liquidity' | 'concentration' | 'claims' | 'volatility' | 'governance';
    title: string;
    message: string;
    threshold: number;
    currentValue: number;
    timestamp: Date;
    acknowledged: boolean;
}

export interface AlertThreshold {
    category: string;
    metric: string;
    warningLevel: number;
    criticalLevel: number;
    comparison: 'greater' | 'less';
}

/**
 * Default alert thresholds
 */
export const DEFAULT_THRESHOLDS: AlertThreshold[] = [
    {
        category: 'liquidity',
        metric: 'liquidityRatio',
        warningLevel: 0.4,
        criticalLevel: 0.2,
        comparison: 'less'
    },
    {
        category: 'concentration',
        metric: 'topContributorPercentage',
        warningLevel: 30,
        criticalLevel: 50,
        comparison: 'greater'
    },
    {
        category: 'claims',
        metric: 'claimFrequency',
        warningLevel: 5,
        criticalLevel: 10,
        comparison: 'greater'
    },
    {
        category: 'volatility',
        metric: 'priceVolatility',
        warningLevel: 60,
        criticalLevel: 80,
        comparison: 'greater'
    },
    {
        category: 'governance',
        metric: 'activeContributors',
        warningLevel: 10,
        criticalLevel: 5,
        comparison: 'less'
    }
];

/**
 * Check for risk alerts
 */
export function checkRiskAlerts(
    poolId: number,
    poolData: any,
    thresholds: AlertThreshold[] = DEFAULT_THRESHOLDS
): RiskAlert[] {
    const alerts: RiskAlert[] = [];

    thresholds.forEach(threshold => {
        const currentValue = poolData[threshold.metric];
        if (currentValue === undefined) return;

        const breachesCritical = threshold.comparison === 'greater'
            ? currentValue >= threshold.criticalLevel
            : currentValue <= threshold.criticalLevel;

        const breachesWarning = threshold.comparison === 'greater'
            ? currentValue >= threshold.warningLevel
            : currentValue <= threshold.warningLevel;

        if (breachesCritical) {
            alerts.push(createAlert(
                poolId,
                'critical',
                threshold.category as any,
                threshold.metric,
                currentValue,
                threshold.criticalLevel
            ));
        } else if (breachesWarning) {
            alerts.push(createAlert(
                poolId,
                'warning',
                threshold.category as any,
                threshold.metric,
                currentValue,
                threshold.warningLevel
            ));
        }
    });

    return alerts;
}

/**
 * Create alert
 */
function createAlert(
    poolId: number,
    severity: RiskAlert['severity'],
    category: RiskAlert['category'],
    metric: string,
    currentValue: number,
    threshold: number
): RiskAlert {
    const messages = {
        liquidity: {
            critical: `Critical liquidity shortage: ${(currentValue * 100).toFixed(1)}% (threshold: ${(threshold * 100).toFixed(1)}%)`,
            warning: `Low liquidity warning: ${(currentValue * 100).toFixed(1)}% (threshold: ${(threshold * 100).toFixed(1)}%)`
        },
        concentration: {
            critical: `Critical concentration risk: ${currentValue.toFixed(1)}% (threshold: ${threshold}%)`,
            warning: `High concentration detected: ${currentValue.toFixed(1)}% (threshold: ${threshold}%)`
        },
        claims: {
            critical: `Critical claim frequency: ${currentValue.toFixed(1)}/month (threshold: ${threshold}/month)`,
            warning: `Elevated claim frequency: ${currentValue.toFixed(1)}/month (threshold: ${threshold}/month)`
        },
        volatility: {
            critical: `Extreme volatility: ${currentValue}/100 (threshold: ${threshold}/100)`,
            warning: `High volatility: ${currentValue}/100 (threshold: ${threshold}/100)`
        },
        governance: {
            critical: `Critical: Only ${currentValue} active contributors (threshold: ${threshold})`,
            warning: `Low participation: ${currentValue} active contributors (threshold: ${threshold})`
        }
    };

    return {
        id: `${poolId}-${category}-${Date.now()}`,
        poolId,
        severity,
        category,
        title: `${category.charAt(0).toUpperCase() + category.slice(1)} ${severity === 'critical' ? 'Critical' : 'Warning'}`,
        message: messages[category][severity],
        threshold,
        currentValue,
        timestamp: new Date(),
        acknowledged: false
    };
}

/**
 * Get alert color
 */
export function getAlertColor(severity: RiskAlert['severity']): string {
    const colors = {
        critical: '#dc2626',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[severity];
}

/**
 * Sort alerts by priority
 */
export function sortAlertsByPriority(alerts: RiskAlert[]): RiskAlert[] {
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    return [...alerts].sort((a, b) => {
        if (severityOrder[a.severity] !== severityOrder[b.severity]) {
            return severityOrder[a.severity] - severityOrder[b.severity];
        }
        return b.timestamp.getTime() - a.timestamp.getTime();
    });
}

/**
 * Get unacknowledged alerts
 */
export function getUnacknowledgedAlerts(alerts: RiskAlert[]): RiskAlert[] {
    return alerts.filter(alert => !alert.acknowledged);
}
