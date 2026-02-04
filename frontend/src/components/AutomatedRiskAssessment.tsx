import { useState } from 'react';
import { calculatePoolRiskScore, getRiskRecommendations, type PoolRiskData } from '../utils/riskScoring';

interface AutomatedRiskAssessmentProps {
    poolId: number;
}

export default function AutomatedRiskAssessment({ poolId }: AutomatedRiskAssessmentProps) {
    const [assessmentRunning, setAssessmentRunning] = useState(false);
    const [lastAssessment, setLastAssessment] = useState<Date | null>(null);

    // Mock pool data - would be fetched from contract
    const poolData: PoolRiskData = {
        totalValue: 50000,
        liquidityRatio: 0.65,
        topContributorPercentage: 28,
        claimFrequency: 3.5,
        averageClaimSize: 2500,
        poolAge: 45,
        activeContributors: 15,
        priceVolatility: 35
    };

    const riskScore = calculatePoolRiskScore(poolData);
    const recommendations = getRiskRecommendations(riskScore);

    const runAssessment = () => {
        setAssessmentRunning(true);
        setTimeout(() => {
            setAssessmentRunning(false);
            setLastAssessment(new Date());
        }, 2000);
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Automated Risk Assessment</h2>
                    <p className="text-gray-600">Pool #{poolId} comprehensive risk analysis</p>
                </div>
                <button
                    onClick={runAssessment}
                    disabled={assessmentRunning}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {assessmentRunning ? 'Running...' : 'Run Assessment'}
                </button>
            </div>

            {lastAssessment && (
                <div className="text-sm text-gray-600 mb-6">
                    Last assessment: {lastAssessment.toLocaleString()}
                </div>
            )}

            {/* Overall Risk Score */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Risk Score</h3>
                <div className="flex items-center gap-6">
                    <div className="relative w-32 h-32">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="#e5e7eb"
                                strokeWidth="12"
                                fill="none"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke={riskScore.color}
                                strokeWidth="12"
                                fill="none"
                                strokeDasharray={`${(riskScore.overall / 100) * 352} 352`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-3xl font-bold" style={{ color: riskScore.color }}>
                                    {riskScore.overall}
                                </div>
                                <div className="text-xs text-gray-600">/ 100</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="text-2xl font-bold mb-2" style={{ color: riskScore.color }}>
                            {riskScore.level.toUpperCase().replace('-', ' ')} RISK
                        </div>
                        <div className="text-gray-600">
                            This pool has a {riskScore.level} risk profile based on multiple factors
                        </div>
                    </div>
                </div>
            </div>

            {/* Risk Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Breakdown</h3>
                <div className="space-y-4">
                    {Object.entries(riskScore.breakdown).map(([key, value]) => (
                        <div key={key}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium capitalize">{key} Risk</span>
                                <span className="font-semibold">{value}/100</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="h-3 rounded-full transition-all"
                                    style={{
                                        width: `${value}%`,
                                        backgroundColor: value >= 60 ? '#ef4444' : value >= 40 ? '#f59e0b' : '#10b981'
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">📋 Recommendations</h3>
                {recommendations.length > 0 ? (
                    <ul className="space-y-2">
                        {recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-blue-800">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>{rec}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-blue-800">No immediate actions required. Pool risk is well-managed.</p>
                )}
            </div>

            {/* Pool Metrics */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Pool Metrics</h3>
                    <div className="space-y-3">
                        <MetricRow label="Total Value" value={`${poolData.totalValue.toLocaleString()} STX`} />
                        <MetricRow label="Liquidity Ratio" value={`${(poolData.liquidityRatio * 100).toFixed(1)}%`} />
                        <MetricRow label="Pool Age" value={`${poolData.poolAge} days`} />
                        <MetricRow label="Active Contributors" value={poolData.activeContributors.toString()} />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Risk Indicators</h3>
                    <div className="space-y-3">
                        <MetricRow label="Top Contributor %" value={`${poolData.topContributorPercentage}%`} />
                        <MetricRow label="Claim Frequency" value={`${poolData.claimFrequency}/month`} />
                        <MetricRow label="Avg Claim Size" value={`${poolData.averageClaimSize} STX`} />
                        <MetricRow label="Price Volatility" value={`${poolData.priceVolatility}/100`} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{label}</span>
            <span className="font-semibold text-gray-900">{value}</span>
        </div>
    );
}
