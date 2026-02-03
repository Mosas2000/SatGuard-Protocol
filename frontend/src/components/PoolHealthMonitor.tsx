import { useState, useEffect } from 'react';
import { calculatePoolHealth, HealthScore, PoolHealthMetrics, getHealthColor, needsRebalancing, getRebalancingActions } from '../utils/poolHealthScoring';

interface PoolHealthMonitorProps {
    poolId: number;
    metrics: PoolHealthMetrics;
    onRebalanceClick?: () => void;
}

export default function PoolHealthMonitor({ poolId, metrics, onRebalanceClick }: PoolHealthMonitorProps) {
    const [health, setHealth] = useState<HealthScore | null>(null);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const healthScore = calculatePoolHealth(metrics);
        setHealth(healthScore);
    }, [metrics]);

    if (!health) return null;

    const needsAction = needsRebalancing(health);
    const actions = needsAction ? getRebalancingActions(metrics, health) : [];

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: getHealthColor(health.status) }}>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Pool Health Monitor</h3>
                    <p className="text-sm text-gray-500">Pool #{poolId}</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold" style={{ color: getHealthColor(health.status) }}>
                        {health.overall}
                    </div>
                    <div className="text-xs uppercase font-semibold" style={{ color: getHealthColor(health.status) }}>
                        {health.status}
                    </div>
                </div>
            </div>

            {/* Health Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <HealthMetric label="Liquidity" score={health.liquidity} />
                <HealthMetric label="Activity" score={health.activity} />
                <HealthMetric label="Diversification" score={health.diversification} />
                <HealthMetric label="Stability" score={health.stability} />
            </div>

            {/* Warnings */}
            {health.warnings.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Warnings
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                        {health.warnings.map((warning, idx) => (
                            <li key={idx} className="text-sm text-red-700">{warning}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Recommendations */}
            {health.recommendations.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Recommendations
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                        {health.recommendations.map((rec, idx) => (
                            <li key={idx} className="text-sm text-blue-700">{rec}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Rebalancing Actions */}
            {needsAction && actions.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-orange-800 mb-2">Rebalancing Required</h4>
                    <ul className="list-disc list-inside space-y-1 mb-3">
                        {actions.map((action, idx) => (
                            <li key={idx} className="text-sm text-orange-700">{action}</li>
                        ))}
                    </ul>
                    {onRebalanceClick && (
                        <button
                            onClick={onRebalanceClick}
                            className="w-full py-2 bg-orange-600 text-white font-semibold rounded hover:bg-orange-700 transition"
                        >
                            Start Rebalancing Process
                        </button>
                    )}
                </div>
            )}

            {/* Detailed Metrics Toggle */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center justify-center"
            >
                {expanded ? 'Hide' : 'Show'} Detailed Metrics
                <svg
                    className={`w-4 h-4 ml-1 transform transition-transform ${expanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Expanded Details */}
            {expanded && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    <DetailRow label="Total Funds" value={`${(metrics.totalFunds / 1_000_000).toFixed(2)} STX`} />
                    <DetailRow label="Utilization" value={`${metrics.utilization.toFixed(1)}%`} />
                    <DetailRow label="Contributors" value={metrics.contributorCount.toString()} />
                    <DetailRow label="Total Claims" value={metrics.claimCount.toString()} />
                    <DetailRow label="Avg Claim Size" value={`${(metrics.avgClaimSize / 1_000_000).toFixed(2)} STX`} />
                    <DetailRow label="Pool Age" value={`${Math.floor(metrics.poolAge / 144)} days`} />
                </div>
            )}
        </div>
    );
}

function HealthMetric({ label, score }: { label: string; score: number }) {
    const getColor = (s: number) => {
        if (s >= 80) return '#10b981';
        if (s >= 60) return '#3b82f6';
        if (s >= 40) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="text-center">
            <div className="text-2xl font-bold mb-1" style={{ color: getColor(score) }}>
                {score}
            </div>
            <div className="text-xs text-gray-600 uppercase font-medium">{label}</div>
            <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${score}%`, backgroundColor: getColor(score) }}
                />
            </div>
        </div>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">{label}:</span>
            <span className="font-semibold text-gray-900">{value}</span>
        </div>
    );
}
