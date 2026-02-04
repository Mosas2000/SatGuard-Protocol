import { useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

interface GovernanceAnalyticsProps {
    poolId: number;
}

export default function GovernanceAnalytics({ poolId }: GovernanceAnalyticsProps) {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

    // Mock data - would be fetched from contract
    const votingActivityData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
            label: 'Proposals Created',
            data: [5, 8, 6, 10],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4
        }, {
            label: 'Votes Cast',
            data: [45, 62, 58, 75],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4
        }]
    };

    const proposalOutcomesData = {
        labels: ['Approved', 'Rejected', 'Pending'],
        datasets: [{
            data: [15, 5, 3],
            backgroundColor: ['#10b981', '#ef4444', '#f59e0b']
        }]
    };

    const voterParticipationData = {
        labels: ['Active Voters', 'Inactive Voters'],
        datasets: [{
            data: [68, 32],
            backgroundColor: ['#8b5cf6', '#e5e7eb']
        }]
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Governance Analytics</h2>
                    <p className="text-gray-600">Pool #{poolId} governance metrics and insights</p>
                </div>
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="all">All Time</option>
                </select>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                <MetricCard title="Total Proposals" value="23" change="+15%" positive />
                <MetricCard title="Active Voters" value="68" change="+8%" positive />
                <MetricCard title="Avg Participation" value="72%" change="+5%" positive />
                <MetricCard title="Approval Rate" value="65%" change="-2%" positive={false} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Voting Activity Trend</h3>
                    <Line data={votingActivityData} options={{ responsive: true, maintainAspectRatio: true }} />
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Proposal Outcomes</h3>
                    <Doughnut data={proposalOutcomesData} options={{ responsive: true, maintainAspectRatio: true }} />
                </div>
            </div>

            {/* Voter Participation */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="font-bold text-gray-900 mb-4">Voter Participation</h3>
                <Doughnut data={voterParticipationData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>

            {/* Top Voters */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-4">Top Voters</h3>
                <div className="space-y-3">
                    {[
                        { address: 'SP2...ABC', votes: 45, power: 1500 },
                        { address: 'SP3...XYZ', votes: 38, power: 1200 },
                        { address: 'SP4...DEF', votes: 32, power: 980 }
                    ].map((voter, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                                    {idx + 1}
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">{voter.address}</div>
                                    <div className="text-sm text-gray-600">{voter.votes} votes cast</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-purple-600">{voter.power}</div>
                                <div className="text-xs text-gray-600">voting power</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, change, positive }: { title: string; value: string; change: string; positive: boolean }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">{title}</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
            <div className={`text-sm font-semibold ${positive ? 'text-green-600' : 'text-red-600'}`}>
                {change}
            </div>
        </div>
    );
}
