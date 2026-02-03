import { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

interface PoolAnalyticsDashboardProps {
    poolId: number;
}

interface AnalyticsData {
    tvl: number[];
    claims: number[];
    contributors: number[];
    utilization: number[];
    labels: string[];
}

export default function PoolAnalyticsDashboard({ poolId }: PoolAnalyticsDashboardProps) {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

    useEffect(() => {
        // Simulate fetching analytics data
        const mockData: AnalyticsData = {
            tvl: [100, 120, 150, 180, 200, 220, 250],
            claims: [2, 3, 1, 4, 2, 3, 5],
            contributors: [10, 12, 15, 18, 20, 22, 25],
            utilization: [20, 25, 30, 35, 40, 38, 42],
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7']
        };
        setAnalytics(mockData);
    }, [poolId, timeRange]);

    if (!analytics) return <div>Loading analytics...</div>;

    const tvlChartData = {
        labels: analytics.labels,
        datasets: [
            {
                label: 'Total Value Locked (STX)',
                data: analytics.tvl,
                borderColor: 'rgb(249, 115, 22)',
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                tension: 0.4
            }
        ]
    };

    const claimsChartData = {
        labels: analytics.labels,
        datasets: [
            {
                label: 'Claims Submitted',
                data: analytics.claims,
                backgroundColor: 'rgba(59, 130, 246, 0.8)'
            }
        ]
    };

    const utilizationData = {
        labels: ['Utilized', 'Available'],
        datasets: [
            {
                data: [analytics.utilization[analytics.utilization.length - 1], 100 - analytics.utilization[analytics.utilization.length - 1]],
                backgroundColor: ['rgba(239, 68, 68, 0.8)', 'rgba(34, 197, 94, 0.8)']
            }
        ]
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Pool Analytics</h2>
                <div className="flex gap-2">
                    {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-2 rounded-lg font-medium transition ${timeRange === range
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Value Locked"
                    value={`${analytics.tvl[analytics.tvl.length - 1]} STX`}
                    change="+12.5%"
                    positive
                />
                <MetricCard
                    title="Total Claims"
                    value={analytics.claims.reduce((a, b) => a + b, 0).toString()}
                    change="+3"
                    positive={false}
                />
                <MetricCard
                    title="Contributors"
                    value={analytics.contributors[analytics.contributors.length - 1].toString()}
                    change="+15%"
                    positive
                />
                <MetricCard
                    title="Utilization Rate"
                    value={`${analytics.utilization[analytics.utilization.length - 1]}%`}
                    change="+5%"
                    positive={false}
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* TVL Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Value Locked Trend</h3>
                    <Line data={tvlChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                </div>

                {/* Claims Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Claims Activity</h3>
                    <Bar data={claimsChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                </div>

                {/* Utilization Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Pool Utilization</h3>
                    <Doughnut data={utilizationData} options={{ responsive: true, maintainAspectRatio: true }} />
                </div>

                {/* Contributors Growth */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contributor Growth</h3>
                    <Line
                        data={{
                            labels: analytics.labels,
                            datasets: [
                                {
                                    label: 'Contributors',
                                    data: analytics.contributors,
                                    borderColor: 'rgb(34, 197, 94)',
                                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                    tension: 0.4
                                }
                            ]
                        }}
                        options={{ responsive: true, maintainAspectRatio: true }}
                    />
                </div>
            </div>

            {/* Detailed Stats Table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Statistics</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Period</th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-700">TVL</th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-700">Claims</th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-700">Contributors</th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-700">Utilization</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {analytics.labels.map((label, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-900">{label}</td>
                                    <td className="px-4 py-3 text-right text-gray-700">{analytics.tvl[idx]} STX</td>
                                    <td className="px-4 py-3 text-right text-gray-700">{analytics.claims[idx]}</td>
                                    <td className="px-4 py-3 text-right text-gray-700">{analytics.contributors[idx]}</td>
                                    <td className="px-4 py-3 text-right text-gray-700">{analytics.utilization[idx]}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, change, positive }: { title: string; value: string; change: string; positive: boolean }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-sm text-gray-600 mb-1">{title}</div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{value}</div>
            <div className={`text-sm font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
                {positive ? '↑' : '↓'} {change}
            </div>
        </div>
    );
}
