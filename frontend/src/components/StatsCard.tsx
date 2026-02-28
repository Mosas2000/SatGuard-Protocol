interface StatsCardProps {
    title: string;
    value: string | number;
    icon: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    subtitle?: string;
}

export default function StatsCard({ title, value, icon, trend, subtitle }: StatsCardProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{icon}</div>
                {trend && (
                    <span className={`text-sm font-medium ${
                        trend.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                        {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                    </span>
                )}
            </div>
            <h3 className="text-gray-600 text-sm mb-2">{title}</h3>
            <p className="text-3xl font-bold text-black mb-1">{value}</p>
            {subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
            )}
        </div>
    );
}
