import type { ActivityItem } from '../hooks/useUserStats';
import { formatAmount } from '../utils/constants';

interface ActivityTimelineProps {
    activities: ActivityItem[];
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
    if (activities.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No activity yet
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {activities.map((activity) => (
                <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'contribution' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                        {activity.type === 'contribution' ? '💰' : '📋'}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-medium text-black">
                                    {activity.type === 'contribution' ? 'Contribution' : 'Claim Submitted'}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Pool #{activity.poolId} • {formatAmount(activity.amount)} STX
                                </p>
                            </div>
                            <span className="text-xs text-gray-500">
                                {new Date(activity.timestamp * 1000).toLocaleDateString()}
                            </span>
                        </div>
                        {activity.status !== undefined && (
                            <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                                activity.status === 1 ? 'bg-green-100 text-green-800' :
                                activity.status === 2 ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                                {activity.status === 1 ? 'Approved' : 
                                 activity.status === 2 ? 'Rejected' : 'Pending'}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
