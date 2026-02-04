import { useState } from 'react';

interface QuickAction {
    id: string;
    label: string;
    icon: string;
    shortcut?: string;
    onClick: () => void;
}

export default function QuickActionsMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const actions: QuickAction[] = [
        {
            id: 'contribute',
            label: 'New Contribution',
            icon: '💰',
            shortcut: 'C',
            onClick: () => console.log('Contribute')
        },
        {
            id: 'claim',
            label: 'Submit Claim',
            icon: '📋',
            shortcut: 'S',
            onClick: () => console.log('Submit claim')
        },
        {
            id: 'vote',
            label: 'Vote on Proposal',
            icon: '🗳️',
            shortcut: 'V',
            onClick: () => console.log('Vote')
        },
        {
            id: 'analytics',
            label: 'View Analytics',
            icon: '📊',
            shortcut: 'A',
            onClick: () => console.log('Analytics')
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: '⚙️',
            shortcut: ',',
            onClick: () => console.log('Settings')
        }
    ];

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 flex items-center justify-center z-40"
                aria-label="Quick actions"
            >
                <span className="text-2xl">{isOpen ? '✕' : '⚡'}</span>
            </button>

            {/* Action Menu */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-30"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="fixed bottom-24 right-6 bg-white rounded-lg shadow-2xl border border-gray-200 z-40 w-64">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-900">Quick Actions</h3>
                            <p className="text-xs text-gray-600 mt-1">Press shortcuts or click</p>
                        </div>
                        <div className="p-2">
                            {actions.map(action => (
                                <button
                                    key={action.id}
                                    onClick={() => {
                                        action.onClick();
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                                >
                                    <span className="text-2xl">{action.icon}</span>
                                    <span className="flex-1 font-medium text-gray-900">{action.label}</span>
                                    {action.shortcut && (
                                        <kbd className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded font-mono">
                                            {action.shortcut}
                                        </kbd>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
