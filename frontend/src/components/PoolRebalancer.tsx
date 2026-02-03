import { useState } from 'react';
import { calculatePoolHealth, PoolHealthMetrics, needsRebalancing, getRebalancingActions } from '../utils/poolHealthScoring';

interface PoolRebalancerProps {
    poolId: number;
    metrics: PoolHealthMetrics;
    onRebalanceComplete?: () => void;
}

interface RebalanceAction {
    id: string;
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    automated: boolean;
    completed: boolean;
}

export default function PoolRebalancer({ poolId, metrics, onRebalanceComplete }: PoolRebalancerProps) {
    const [selectedActions, setSelectedActions] = useState<string[]>([]);
    const [executing, setExecuting] = useState(false);
    const [progress, setProgress] = useState(0);

    const health = calculatePoolHealth(metrics);
    const needsAction = needsRebalancing(health);
    const recommendations = getRebalancingActions(metrics, health);

    // Define rebalancing actions
    const actions: RebalanceAction[] = [
        {
            id: 'increase-liquidity',
            title: 'Increase Pool Liquidity',
            description: 'Launch incentive campaign to attract new contributors',
            impact: 'high',
            automated: false,
            completed: false
        },
        {
            id: 'adjust-premiums',
            title: 'Adjust Premium Rates',
            description: 'Recalculate premiums based on current risk factors',
            impact: 'medium',
            automated: true,
            completed: false
        },
        {
            id: 'pause-claims',
            title: 'Temporarily Pause New Claims',
            description: 'Prevent new claims until liquidity improves',
            impact: 'high',
            automated: true,
            completed: false
        },
        {
            id: 'reduce-coverage',
            title: 'Reduce Maximum Coverage',
            description: 'Lower max coverage limits to reduce risk exposure',
            impact: 'medium',
            automated: true,
            completed: false
        },
        {
            id: 'merge-suggestion',
            title: 'Suggest Pool Merger',
            description: 'Notify owner about merger opportunities',
            impact: 'high',
            automated: false,
            completed: false
        },
        {
            id: 'contributor-outreach',
            title: 'Contributor Outreach',
            description: 'Send notifications to inactive contributors',
            impact: 'low',
            automated: true,
            completed: false
        }
    ];

    const toggleAction = (actionId: string) => {
        setSelectedActions(prev =>
            prev.includes(actionId)
                ? prev.filter(id => id !== actionId)
                : [...prev, actionId]
        );
    };

    const executeRebalancing = async () => {
        setExecuting(true);
        setProgress(0);

        const selectedActionObjects = actions.filter(a => selectedActions.includes(a.id));
        const totalSteps = selectedActionObjects.length;

        for (let i = 0; i < totalSteps; i++) {
            const action = selectedActionObjects[i];

            // Simulate execution
            await new Promise(resolve => setTimeout(resolve, 1500));

            setProgress(((i + 1) / totalSteps) * 100);
            console.log(`Executed: ${action.title}`);
        }

        setExecuting(false);
        alert('Rebalancing completed successfully!');
        onRebalanceComplete?.();
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Pool Rebalancer</h2>
            <p className="text-gray-600 mb-6">Optimize pool health through automated and manual actions</p>

            {/* Health Status */}
            <div className={`rounded-lg p-6 mb-6 ${needsAction ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'}`}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Pool Health Status</h3>
                        <p className="text-sm text-gray-600">Pool #{poolId}</p>
                    </div>
                    <div className="text-right">
                        <div className={`text-4xl font-bold ${needsAction ? 'text-orange-600' : 'text-green-600'}`}>
                            {health.overall}
                        </div>
                        <div className="text-sm uppercase font-semibold">{health.status}</div>
                    </div>
                </div>

                {needsAction && (
                    <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Recommended Actions:</h4>
                        <ul className="list-disc list-inside space-y-1">
                            {recommendations.map((rec, idx) => (
                                <li key={idx} className="text-sm text-gray-700">{rec}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Rebalancing Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Available Rebalancing Actions</h3>
                <div className="space-y-3">
                    {actions.map(action => (
                        <div
                            key={action.id}
                            onClick={() => toggleAction(action.id)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition ${selectedActions.includes(action.id)
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <input
                                            type="checkbox"
                                            checked={selectedActions.includes(action.id)}
                                            onChange={() => { }}
                                            className="w-5 h-5"
                                        />
                                        <h4 className="font-semibold text-gray-900">{action.title}</h4>
                                        {action.automated && (
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                                                AUTO
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 ml-7">{action.description}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${action.impact === 'high' ? 'bg-red-100 text-red-800' :
                                        action.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'
                                    }`}>
                                    {action.impact.toUpperCase()} IMPACT
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Execution Progress */}
            {executing && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-blue-900 mb-3">Executing Rebalancing...</h3>
                    <div className="bg-white rounded-full h-4 overflow-hidden mb-2">
                        <div
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="text-sm text-blue-800 text-center">{Math.round(progress)}% Complete</div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={executeRebalancing}
                    disabled={selectedActions.length === 0 || executing}
                    className={`flex-1 py-3 rounded-lg font-bold transition ${selectedActions.length > 0 && !executing
                            ? 'bg-orange-600 text-white hover:bg-orange-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {executing ? 'Executing...' : `Execute ${selectedActions.length} Action${selectedActions.length !== 1 ? 's' : ''}`}
                </button>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">💡 About Rebalancing</h4>
                <p className="text-sm text-blue-800">
                    Automated actions execute immediately. Manual actions require additional steps or governance approval.
                    Select multiple actions to execute them in sequence.
                </p>
            </div>
        </div>
    );
}
