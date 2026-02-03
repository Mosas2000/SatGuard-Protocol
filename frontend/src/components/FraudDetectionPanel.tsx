import { useState, useEffect } from 'react';
import { calculateFraudScore, FraudScore, getFraudColor } from '../utils/fraudDetection';

interface FraudDetectionPanelProps {
    claimId: number;
    claimAmount: number;
    accountAge: number;
    previousClaims: number;
    evidenceCount: number;
}

export default function FraudDetectionPanel({
    claimId,
    claimAmount,
    accountAge,
    previousClaims,
    evidenceCount
}: FraudDetectionPanelProps) {
    const [fraudScore, setFraudScore] = useState<FraudScore | null>(null);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const score = calculateFraudScore({
            amount: claimAmount,
            accountAge,
            previousClaims,
            evidenceCount,
            submissionTime: new Date()
        });
        setFraudScore(score);
    }, [claimAmount, accountAge, previousClaims, evidenceCount]);

    if (!fraudScore) return null;

    return (
        <div
            className="bg-white rounded-lg shadow-md p-6 border-l-4"
            style={{ borderLeftColor: getFraudColor(fraudScore.level) }}
        >
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Fraud Detection Analysis</h3>
                    <p className="text-sm text-gray-600">Claim #{claimId}</p>
                </div>
                <div className="text-right">
                    <div className="text-4xl font-bold" style={{ color: getFraudColor(fraudScore.level) }}>
                        {fraudScore.score}
                    </div>
                    <div className="text-xs uppercase font-semibold" style={{ color: getFraudColor(fraudScore.level) }}>
                        {fraudScore.level} RISK
                    </div>
                </div>
            </div>

            {/* Risk Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                <Indicator label="Duplicate" active={fraudScore.indicators.duplicateClaim} />
                <Indicator label="Pattern" active={fraudScore.indicators.suspiciousPattern} />
                <Indicator label="Evidence" active={fraudScore.indicators.inconsistentEvidence} />
                <Indicator label="Rapid Submissions" active={fraudScore.indicators.rapidSubmissions} />
                <Indicator label="Unusual Amount" active={fraudScore.indicators.unusualAmount} />
                <Indicator label="New Account" active={fraudScore.indicators.newAccount} />
            </div>

            {/* Recommendations */}
            {fraudScore.recommendations.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Recommendations</h4>
                    <ul className="list-disc list-inside space-y-1">
                        {fraudScore.recommendations.map((rec, idx) => (
                            <li key={idx} className="text-sm text-yellow-800">{rec}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Detailed Analysis Toggle */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center justify-center"
            >
                {expanded ? 'Hide' : 'Show'} Detailed Analysis
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
                    <DetailRow label="Account Age" value={`${accountAge} days`} />
                    <DetailRow label="Previous Claims" value={previousClaims.toString()} />
                    <DetailRow label="Evidence Files" value={evidenceCount.toString()} />
                    <DetailRow label="Claim Amount" value={`${claimAmount} sBTC`} />
                </div>
            )}
        </div>
    );
}

function Indicator({ label, active }: { label: string; active: boolean }) {
    return (
        <div className={`text-center p-2 rounded ${active ? 'bg-red-100' : 'bg-green-100'}`}>
            <div className="text-2xl mb-1">{active ? '⚠️' : '✅'}</div>
            <div className="text-xs font-medium text-gray-700">{label}</div>
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
