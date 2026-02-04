import { useState } from 'react';

interface Widget {
    id: string;
    title: string;
    type: 'stats' | 'chart' | 'activity' | 'alerts';
    enabled: boolean;
    position: number;
}

export default function CustomizableWidgets() {
    const [widgets, setWidgets] = useState<Widget[]>([
        { id: 'portfolio', title: 'Portfolio Value', type: 'stats', enabled: true, position: 0 },
        { id: 'activity', title: 'Recent Activity', type: 'activity', enabled: true, position: 1 },
        { id: 'risk', title: 'Risk Score', type: 'chart', enabled: true, position: 2 },
        { id: 'alerts', title: 'Risk Alerts', type: 'alerts', enabled: false, position: 3 }
    ]);

    const [isCustomizing, setIsCustomizing] = useState(false);

    const toggleWidget = (id: string) => {
        setWidgets(prev =>
            prev.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w)
        );
    };

    const moveWidget = (id: string, direction: 'up' | 'down') => {
        setWidgets(prev => {
            const index = prev.findIndex(w => w.id === id);
            if (index === -1) return prev;
            if (direction === 'up' && index === 0) return prev;
            if (direction === 'down' && index === prev.length - 1) return prev;

            const newWidgets = [...prev];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            [newWidgets[index], newWidgets[targetIndex]] = [newWidgets[targetIndex], newWidgets[index]];
            return newWidgets.map((w, i) => ({ ...w, position: i }));
        });
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
                <button
                    onClick={() => setIsCustomizing(!isCustomizing)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    {isCustomizing ? 'Done' : 'Customize'}
                </button>
            </div>

            {isCustomizing && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-blue-900 mb-3">Widget Settings</h3>
                    <div className="space-y-2">
                        {widgets.map(widget => (
                            <div
                                key={widget.id}
                                className="flex items-center gap-3 bg-white p-3 rounded-lg"
                            >
                                <input
                                    type="checkbox"
                                    checked={widget.enabled}
                                    onChange={() => toggleWidget(widget.id)}
                                    className="w-5 h-5"
                                />
                                <span className="flex-1 font-medium text-gray-900">{widget.title}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => moveWidget(widget.id, 'up')}
                                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        onClick={() => moveWidget(widget.id, 'down')}
                                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                    >
                                        ↓
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Widgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {widgets
                    .filter(w => w.enabled)
                    .sort((a, b) => a.position - b.position)
                    .map(widget => (
                        <WidgetCard key={widget.id} widget={widget} />
                    ))}
            </div>
        </div>
    );
}

function WidgetCard({ widget }: { widget: Widget }) {
    const content = {
        stats: (
            <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">142,500</div>
                <div className="text-sm text-gray-600">STX</div>
            </div>
        ),
        activity: (
            <div className="space-y-3">
                <ActivityItem icon="💰" text="Contributed 5,000 STX" time="2h ago" />
                <ActivityItem icon="📋" text="Claim approved" time="1d ago" />
            </div>
        ),
        chart: (
            <div className="h-32 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-600">Chart visualization</span>
            </div>
        ),
        alerts: (
            <div className="space-y-2">
                <Alert type="warning" text="Low liquidity in Pool #3" />
                <Alert type="info" text="New proposal available" />
            </div>
        )
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{widget.title}</h3>
            {content[widget.type]}
        </div>
    );
}

function ActivityItem({ icon, text, time }: { icon: string; text: string; time: string }) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-xl">{icon}</span>
            <div className="flex-1">
                <p className="text-sm text-gray-900">{text}</p>
                <p className="text-xs text-gray-500">{time}</p>
            </div>
        </div>
    );
}

function Alert({ type, text }: { type: 'warning' | 'info'; text: string }) {
    const colors = {
        warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
        info: 'bg-blue-50 text-blue-800 border-blue-200'
    };

    return (
        <div className={`p-3 rounded-lg border ${colors[type]}`}>
            <p className="text-sm">{text}</p>
        </div>
    );
}
