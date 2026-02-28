import { formatAmount } from '../utils/constants';

interface EarningsChartProps {
    data: Array<{
        month: string;
        earnings: number;
    }>;
}

export default function EarningsChart({ data }: EarningsChartProps) {
    if (data.length === 0) {
        return <div className="text-center text-gray-500 py-8">No earnings data available</div>;
    }

    const maxEarnings = Math.max(...data.map(d => d.earnings));

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-black mb-6">Earnings Overview</h3>
            <div className="space-y-4">
                {data.map((item, index) => {
                    const percentage = (item.earnings / maxEarnings) * 100;
                    return (
                        <div key={index}>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-gray-600">{item.month}</span>
                                <span className="text-sm font-semibold text-black">
                                    {formatAmount(item.earnings)} STX
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-stacks-orange h-2 rounded-full transition-all"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                    <span className="text-gray-600">Total Earnings</span>
                    <span className="font-bold text-xl text-stacks-orange">
                        {formatAmount(data.reduce((sum, d) => sum + d.earnings, 0))} STX
                    </span>
                </div>
            </div>
        </div>
    );
}
