interface QuickActionButtonProps {
    icon: string;
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'danger';
}

export default function QuickActionButton({ icon, label, onClick, variant = 'primary' }: QuickActionButtonProps) {
    const variants = {
        primary: 'bg-stacks-orange hover:bg-opacity-90 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-black',
        success: 'bg-green-500 hover:bg-green-600 text-white',
        danger: 'bg-red-500 hover:bg-red-600 text-white',
    };

    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-6 rounded-lg transition-all hover:scale-105 ${variants[variant]}`}
        >
            <span className="text-3xl mb-2">{icon}</span>
            <span className="text-sm font-medium">{label}</span>
        </button>
    );
}
