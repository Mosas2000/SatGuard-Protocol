import { useState } from 'react';

interface PartialPayoutCalculatorProps {
    claimId: number;
    requestedAmount: number;
    approvalRate: number; // 0-100
    poolLiquidity: number;
    onAcceptPartial?: (amount: number) => void;
}

export default function PartialPayoutCalculator({
    claimId,
    requestedAmount,
    approvalRate,
    poolLiquidity,
    onAcceptPartial
}: PartialPayoutCalculatorProps) {
    const [customAmount, setCustomAmount] = useState(0);

    // Calculate suggested partial amounts based on approval rate
    const calculatePartialOptions = () => {
        const options = [];

        // Option 1: Proportional to approval rate
        const proportional = (requestedAmount * approvalRate) / 100;
        options.push({
            label: 'Proportional to Approval',
            amount: proportional,
            description: `${approvalRate}% of requested amount`,
            recommended: approvalRate >= 40 && approvalRate < 60
        });

        // Option 2: Conservative (50% of requested)
        const conservative = requestedAmount * 0.5;
        options.push({
            label: 'Conservative',
            amount: conservative,
            description: '50% of requested amount',
            recommended: approvalRate >= 30 && approvalRate < 50
        });

        // Option 3: Minimal (25% of requested)
        const minimal = requestedAmount * 0.25;
        options.push({
            label: 'Minimal',
            amount: minimal,
            description: '25% of requested amount',
            recommended: approvalRate < 40
        });

        // Filter out options that exceed pool liquidity
        return options.filter(opt => opt.amount <= poolLiquidity);
    };

    const partialOptions = calculatePartialOptions();

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Partial Payout Calculator</h2>
            <p className="text-gray-600 mb-8">
                Your claim didn't reach the required approval threshold. Consider accepting a partial payout.
            </p>

            {/* Current Status */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-yellow-900 mb-4">Current Claim Status</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-sm text-yellow-700">Requested Amount:</div>
                        <div className="text-2xl font-bold text-yellow-900">{requestedAmount} sBTC</div>
                    </div>
                    <div>
                        <div className="text-sm text-yellow-700">Approval Rate:</div>
                        <div className="text-2xl font-bold text-yellow-900">{approvalRate}%</div>
                    </div>
                    <div>
                        <div className="text-sm text-yellow-700">Required Threshold:</div>
                        <div className="text-lg font-semibold text-yellow-900">60%</div>
                    </div>
                    <div>
                        <div className="text-sm text-yellow-700">Pool Liquidity:</div>
                        <div className="text-lg font-semibold text-yellow-900">{poolLiquidity} sBTC</div>
                    </div>
                </div>
            </div>

            {/* Partial Payout Options */}
            <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Suggested Partial Payout Options</h3>
                {partialOptions.map((option, index) => (
                    <div
                        key={index}
                        className={`bg-white border-2 rounded-lg p-6 transition ${option.recommended
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg">{option.label}</h4>
                                <p className="text-sm text-gray-600">{option.description}</p>
                            </div>
                            {option.recommended && (
                                <span className="px-3 py-1 bg-orange-600 text-white text-xs font-semibold rounded-full">
                                    RECOMMENDED
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="text-3xl font-bold text-orange-600">
                                    {option.amount.toFixed(4)} sBTC
                                </div>
                                <div className="text-sm text-gray-600">
                                    {((option.amount / requestedAmount) * 100).toFixed(0)}% of requested
                                </div>
                            </div>
                            <button
                                onClick={() => onAcceptPartial?.(option.amount)}
                                className="px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition"
                            >
                                Accept
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom Amount */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Custom Partial Amount</h3>
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enter Custom Amount (sBTC)
                        </label>
                        <input
                            type="number"
                            step="0.0001"
                            max={Math.min(requestedAmount, poolLiquidity)}
                            value={customAmount}
                            onChange={(e) => setCustomAmount(parseFloat(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 outline-none"
                            placeholder="0.0000"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                            Max: {Math.min(requestedAmount, poolLiquidity).toFixed(4)} sBTC
                        </div>
                    </div>
                    <button
                        onClick={() => customAmount > 0 && onAcceptPartial?.(customAmount)}
                        disabled={customAmount <= 0 || customAmount > Math.min(requestedAmount, poolLiquidity)}
                        className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Accept Custom
                    </button>
                </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">💡 About Partial Payouts</h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Partial payouts allow you to receive compensation even without full approval</li>
                    <li>Accepting a partial payout closes the claim - no further appeals possible</li>
                    <li>The amount is based on community approval rate and pool liquidity</li>
                    <li>You can reject partial payout and appeal the decision instead</li>
                </ul>
            </div>
        </div>
    );
}
