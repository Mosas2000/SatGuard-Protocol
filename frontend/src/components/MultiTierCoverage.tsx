import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, PostConditionMode } from '@stacks/transactions';
import { network } from '../utils/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME, MICRO_STACKS } from '../utils/constants';
import { calculateDynamicPremium, RiskFactors } from '../utils/premiumCalculator';

interface MultiTierCoverageProps {
    poolId: number;
    poolMetrics: RiskFactors;
    onSuccess?: () => void;
}

interface CoverageTier {
    name: string;
    coverage: number; // in STX
    premium: number; // in STX
    features: string[];
    recommended?: boolean;
}

export default function MultiTierCoverage({ poolId, poolMetrics, onSuccess }: MultiTierCoverageProps) {
    const [selectedTier, setSelectedTier] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    // Define coverage tiers
    const tiers: CoverageTier[] = [
        {
            name: 'Basic',
            coverage: 0.5,
            premium: 0,
            features: [
                'Up to 0.5 sBTC coverage',
                'Standard claim processing',
                'Community voting',
                '30-day waiting period'
            ]
        },
        {
            name: 'Standard',
            coverage: 2.0,
            premium: 0,
            features: [
                'Up to 2 sBTC coverage',
                'Priority claim review',
                'Reduced waiting period (14 days)',
                'Email notifications',
                'Claim history tracking'
            ],
            recommended: true
        },
        {
            name: 'Premium',
            coverage: 5.0,
            premium: 0,
            features: [
                'Up to 5 sBTC coverage',
                'Fast-track claim processing',
                'No waiting period',
                'Dedicated support',
                'Advanced analytics',
                'Governance voting power boost'
            ]
        },
        {
            name: 'Enterprise',
            coverage: 10.0,
            premium: 0,
            features: [
                'Up to 10 sBTC coverage',
                'Instant claim processing',
                'Custom coverage terms',
                'Priority support 24/7',
                'Risk assessment reports',
                'Multi-signature support',
                'API access'
            ]
        }
    ];

    // Calculate premiums for each tier
    const tiersWithPremiums = tiers.map(tier => {
        const premium = calculateDynamicPremium(
            {
                ...poolMetrics,
                coverageAmount: tier.coverage * MICRO_STACKS
            },
            0.05 // 5% base rate
        );
        return {
            ...tier,
            premium: premium.finalPremium / MICRO_STACKS
        };
    });

    const handleSelectTier = async (tierIndex: number) => {
        const tier = tiersWithPremiums[tierIndex];
        setLoading(true);

        try {
            await openContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'contribute',
                functionArgs: [
                    uintCV(poolId),
                    uintCV(tier.premium * MICRO_STACKS)
                ],
                network,
                postConditionMode: PostConditionMode.Deny,
                onFinish: (data) => {
                    console.log('Tier selected:', data);
                    setLoading(false);
                    alert(`Successfully subscribed to ${tier.name} tier!`);
                    onSuccess?.();
                },
                onCancel: () => {
                    setLoading(false);
                    console.log('Cancelled');
                }
            });
        } catch (err) {
            console.error(err);
            setLoading(false);
            alert('Failed to select coverage tier');
        }
    };

    return (
        <div className="py-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Coverage Tier</h2>
                <p className="text-gray-600">Select the protection level that fits your needs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tiersWithPremiums.map((tier, index) => (
                    <div
                        key={index}
                        className={`relative bg-white rounded-lg shadow-lg overflow-hidden border-2 transition-all ${selectedTier === index
                                ? 'border-orange-500 transform scale-105'
                                : tier.recommended
                                    ? 'border-blue-500'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        {/* Recommended Badge */}
                        {tier.recommended && (
                            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                RECOMMENDED
                            </div>
                        )}

                        <div className="p-6">
                            {/* Tier Name */}
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>

                            {/* Coverage Amount */}
                            <div className="mb-4">
                                <div className="text-4xl font-bold text-orange-600">
                                    {tier.coverage}
                                    <span className="text-lg text-gray-600 ml-1">sBTC</span>
                                </div>
                                <div className="text-sm text-gray-500">Maximum Coverage</div>
                            </div>

                            {/* Premium */}
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <div className="text-2xl font-bold text-gray-900">
                                    {tier.premium.toFixed(4)}
                                    <span className="text-sm text-gray-600 ml-1">STX</span>
                                </div>
                                <div className="text-xs text-gray-500">Annual Premium</div>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-6">
                                {tier.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start text-sm">
                                        <svg
                                            className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Select Button */}
                            <button
                                onClick={() => {
                                    setSelectedTier(index);
                                    handleSelectTier(index);
                                }}
                                disabled={loading}
                                className={`w-full py-3 rounded-lg font-bold transition ${selectedTier === index
                                        ? 'bg-orange-600 text-white'
                                        : tier.recommended
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-900 text-white hover:bg-gray-800'
                                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading && selectedTier === index ? 'Processing...' : 'Select Tier'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Comparison Note */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">💡 How to Choose?</h4>
                <p className="text-sm text-blue-800">
                    Consider your risk exposure and asset value. Higher tiers offer faster processing and better support.
                    Premiums are calculated dynamically based on pool health and risk factors.
                </p>
            </div>
        </div>
    );
}
