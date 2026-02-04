import { useState } from 'react';

interface DashboardWidget {
    id: string;
    title: string;
    type: 'stats' | 'chart' | 'activity' | 'alerts';
    data: any;
}

export default function AdvancedUserDashboard() {
    const [activeTab, setActiveTab] = useState<'overview' | 'pools' | 'claims' | 'governance'>('overview');

    // Mock user data
    const userData = {
        totalContributions: 125000,
        activePools: 8,
        totalClaims: 3,
        votingPower: 450,
        portfolioValue: 142500,
        riskScore: 35
    };

    const recentActivity = [
        { id: 1, type: 'contribution', pool: 'DeFi Insurance Pool', amount: 5000, time: '2 hours ago' },
        { id: 2, type: 'claim', pool: 'Exchange Protection', amount: 2500, time: '1 day ago' },
        { id: 3, type: 'vote', proposal: 'Increase Coverage Limits', time: '2 days ago' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
                    <p className="text-gray-600">Welcome back! Here's your portfolio overview.</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Contributions"
                        value={`${userData.totalContributions.toLocaleString()} STX`}
                        change="+12.5%"
                        positive={true}
                        icon="💰"
                    />
                    <StatCard
                        title="Active Pools"
                        value={userData.activePools.toString()}
                        change="+2"
                        positive={true}
                        icon="🏊"
                    />
                    <StatCard
                        title="Portfolio Value"
                        value={`${userData.portfolioValue.toLocaleString()} STX`}
                        change="+8.3%"
                        positive={true}
                        icon="📈"
                    />
                    <StatCard
                        title="Risk Score"
                        value={userData.riskScore.toString()}
                        change="-5"
                        positive={true}
                        icon="⚠️"
                    />
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-lg shadow-md mb-6">
                    <div className="flex border-b">
                        {(['overview', 'pools', 'claims', 'governance'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${activeTab === tab
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Recent Activity */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                                    <div className="space-y-4">
                                        {recentActivity.map((activity) => (
                                            <ActivityItem key={activity.id} activity={activity} />
                                        ))}
                                    </div>
                                </div>

                                {/* Portfolio Breakdown */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Breakdown</h3>
                                    <div className="space-y-3">
                                        <ProgressBar label="DeFi Pools" percentage={45} color="blue" />
                                        <ProgressBar label="Exchange Protection" percentage={30} color="green" />
                                        <ProgressBar label="NFT Insurance" percentage={15} color="purple" />
                                        <ProgressBar label="Other" percentage={10} color="gray" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'pools' && (
                            <div className="text-center py-12 text-gray-600">
                                Pool management interface would be displayed here
                            </div>
                        )}

                        {activeTab === 'claims' && (
                            <div className="text-center py-12 text-gray-600">
                                Claims history and management would be displayed here
                            </div>
                        )}

                        {activeTab === 'governance' && (
                            <div className="text-center py-12 text-gray-600">
                                Governance participation and voting would be displayed here
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <QuickActionButton icon="➕" label="New Contribution" />
                    <QuickActionButton icon="📋" label="Submit Claim" />
                    <QuickActionButton icon="🗳️" label="Vote on Proposal" />
                    <QuickActionButton icon="📊" label="View Analytics" />
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, change, positive, icon }: {
    title: string;
    value: string;
    change: string;
    positive: boolean;
    icon: string;
}) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{icon}</span>
                <span className={`text-sm font-semibold ${positive ? 'text-green-600' : 'text-red-600'}`}>
                    {change}
                </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    );
}

function ActivityItem({ activity }: { activity: any }) {
    const icons = {
        contribution: '💰',
        claim: '📋',
        vote: '🗳️'
    };

    return (
        <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
            <span className="text-2xl">{icons[activity.type as keyof typeof icons]}</span>
            <div className="flex-1">
                <p className="font-semibold text-gray-900">
                    {activity.type === 'contribution' && `Contributed to ${activity.pool}`}
                    {activity.type === 'claim' && `Claimed from ${activity.pool}`}
                    {activity.type === 'vote' && `Voted on ${activity.proposal}`}
                </p>
                {activity.amount && (
                    <p className="text-sm text-gray-600">{activity.amount.toLocaleString()} STX</p>
                )}
                <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
        </div>
    );
}

function ProgressBar({ label, percentage, color }: {
    label: string;
    percentage: number;
    color: string;
}) {
    const colors = {
        blue: 'bg-blue-600',
        green: 'bg-green-600',
        purple: 'bg-purple-600',
        gray: 'bg-gray-600'
    };

    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{label}</span>
                <span className="font-semibold text-gray-900">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full ${colors[color as keyof typeof colors]}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

function QuickActionButton({ icon, label }: { icon: string; label: string }) {
    return (
        <button className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all hover:scale-105 flex flex-col items-center gap-2">
            <span className="text-3xl">{icon}</span>
            <span className="text-sm font-semibold text-gray-900">{label}</span>
        </button>
    );
}
