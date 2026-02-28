interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'warning' | ' info';
    onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500',
    };

    const icons = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ',
    };

    return (
        <div className={`${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in`}>
            <span className="text-2xl">{icons[type]}</span>
            <span className="flex-1">{message}</span>
            <button onClick={onClose} className="text-white hover:text-gray-200">✕</button>
        </div>
    );
}
