import { useState } from 'react';

interface ClaimHistoryTimelineProps {
    claimId: number;
}

interface TimelineEvent {
    id: string;
    type: 'submitted' | 'evidence' | 'voting' | 'approved' | 'rejected' | 'paid' | 'appealed';
    title: string;
    description: string;
    timestamp: Date;
    actor?: string;
    metadata?: Record<string, any>;
}

export default function ClaimHistoryTimeline({ claimId }: ClaimHistoryTimelineProps) {
    // Mock timeline data - would be fetched from contract
    const [events] = useState<TimelineEvent[]>([
        {
            id: '1',
            type: 'submitted',
            title: 'Claim Submitted',
            description: 'Initial claim submission for exchange hack insurance',
            timestamp: new Date('2024-02-01T10:00:00'),
            actor: 'SP2...ABC',
            metadata: { amount: 2.5 }
        },
        {
            id: '2',
            type: 'evidence',
            title: 'Evidence Uploaded',
            description: '3 files uploaded: transaction hashes, screenshots, audit report',
            timestamp: new Date('2024-02-01T10:15:00'),
            actor: 'SP2...ABC',
            metadata: { fileCount: 3 }
        },
        {
            id: '3',
            type: 'voting',
            title: 'Voting Started',
            description: 'Community voting period initiated (14 days)',
            timestamp: new Date('2024-02-01T12:00:00'),
            metadata: { duration: 14 }
        },
        {
            id: '4',
            type: 'voting',
            title: 'Vote Cast',
            description: 'Contributor SP3...XYZ voted in favor',
            timestamp: new Date('2024-02-03T14:30:00'),
            actor: 'SP3...XYZ',
            metadata: { vote: 'approve', power: 1.5 }
        },
        {
            id: '5',
            type: 'approved',
            title: 'Claim Approved',
            description: 'Voting completed with 65% approval (threshold: 60%)',
            timestamp: new Date('2024-02-15T12:00:00'),
            metadata: { approvalRate: 65 }
        },
        {
            id: '6',
            type: 'paid',
            title: 'Payout Processed',
            description: '2.5 sBTC transferred to claimant',
            timestamp: new Date('2024-02-15T12:30:00'),
            metadata: { amount: 2.5, txHash: '0x123...abc' }
        }
    ]);

    const getEventIcon = (type: TimelineEvent['type']): string => {
        const icons = {
            submitted: '📝',
            evidence: '📎',
            voting: '🗳️',
            approved: '✅',
            rejected: '❌',
            paid: '💰',
            appealed: '⚖️'
        };
        return icons[type];
    };

    const getEventColor = (type: TimelineEvent['type']): string => {
        const colors = {
            submitted: 'bg-blue-500',
            evidence: 'bg-purple-500',
            voting: 'bg-yellow-500',
            approved: 'bg-green-500',
            rejected: 'bg-red-500',
            paid: 'bg-emerald-500',
            appealed: 'bg-orange-500'
        };
        return colors[type];
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Claim History Timeline</h2>
            <p className="text-gray-600 mb-8">Complete history of Claim #{claimId}</p>

            <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

                {/* Timeline Events */}
                <div className="space-y-8">
                    {events.map((event, index) => (
                        <div key={event.id} className="relative flex gap-6">
                            {/* Icon */}
                            <div className="relative z-10">
                                <div className={`w-16 h-16 rounded-full ${getEventColor(event.type)} flex items-center justify-center text-3xl shadow-lg`}>
                                    {getEventIcon(event.type)}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                                    <span className="text-sm text-gray-500">
                                        {event.timestamp.toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-gray-700 mb-3">{event.description}</p>

                                {/* Actor */}
                                {event.actor && (
                                    <div className="text-sm text-gray-600 mb-2">
                                        <span className="font-medium">Actor:</span> {event.actor}
                                    </div>
                                )}

                                {/* Metadata */}
                                {event.metadata && Object.keys(event.metadata).length > 0 && (
                                    <div className="bg-gray-50 rounded p-3 mt-3">
                                        <div className="text-xs font-semibold text-gray-700 mb-2">DETAILS:</div>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            {Object.entries(event.metadata).map(([key, value]) => (
                                                <div key={key} className="flex justify-between">
                                                    <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                                    <span className="font-semibold text-gray-900">{String(value)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary Stats */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4">Timeline Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Total Events" value={events.length.toString()} />
                    <StatCard label="Duration" value="14 days" />
                    <StatCard label="Participants" value="12" />
                    <StatCard label="Final Status" value="PAID" color="text-green-600" />
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, color = 'text-gray-900' }: { label: string; value: string; color?: string }) {
    return (
        <div className="text-center">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-sm text-gray-600">{label}</div>
        </div>
    );
}
