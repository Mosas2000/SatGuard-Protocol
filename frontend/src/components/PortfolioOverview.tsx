import StatsCard from './StatsCard';
import { formatAmount } from '../utils/constants';

interface PortfolioOverviewProps {
    totalContributed: number;
    activePoolsCount: number;
    pendingClaims: number;
    totalCoverageValue: number;
}

export default function PortfolioOverview({
    totalContributed,
    activePoolsCount,
    pendingClaims,
    totalCoverageValue
}: PortfolioOverviewProps) {
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-6">Portfolio Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Contributed"
                    value={`${formatAmount(totalContributed)} STX`}
                    icon="💰"
                    subtitle="Across all pools"
                />
                <StatsCard
                    title="Active Pools"
                    value={activePoolsCount}
                    icon="🏊"
                    subtitle="Currently participating"
                />
                <StatsCard
                    title="Pending Claims"
                    value={pendingClaims}
                    icon="⏳"
                    subtitle="Awaiting decision"
                />
                <StatsCard
                    title="Coverage Value"
                    value={`${formatAmount(totalCoverageValue)} STX`}
                    icon="🛡️"
                    subtitle="Total protection"
                />
            </div>
        </div>
    );
}
