import { useState } from 'react';

interface ProfileSettingsProps {
    currentEmail?: string;
    currentNotifications?: boolean;
    onSave: (settings: { email: string; notifications: boolean }) => void;
}

export default function ProfileSettings({ currentEmail = '', currentNotifications = true, onSave }: ProfileSettingsProps) {
    const [email, setEmail] = useState(currentEmail);
    const [notifications, setNotifications] = useState(currentNotifications);
    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ email, notifications });
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-black mb-6">Profile Settings</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Name
                    </label>
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-stacks-orange outline-none"
                        placeholder="Enter your display name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-stacks-orange outline-none"
                        placeholder="your@email.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                    </label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-stacks-orange outline-none"
                        placeholder="Tell us about yourself..."
                    />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                    <div>
                        <p className="font-medium text-black">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive updates about your pools and claims</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={notifications}
                            onChange={(e) => setNotifications(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stacks-orange"></div>
                    </label>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="flex-1 bg-stacks-orange text-white py-2 px-4 rounded font-medium hover:bg-opacity-90 transition-colors"
                    >
                        Save Changes
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
