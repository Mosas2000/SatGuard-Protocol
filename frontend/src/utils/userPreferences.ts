/**
 * User Preferences System
 * Manages user settings and preferences
 */

import { createContext, useContext, useState, useEffect } from 'react';

export interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: {
        email: boolean;
        push: boolean;
        claims: boolean;
        governance: boolean;
        poolUpdates: boolean;
    };
    display: {
        compactMode: boolean;
        showTutorials: boolean;
        animationsEnabled: boolean;
    };
    privacy: {
        shareAnalytics: boolean;
        publicProfile: boolean;
    };
}

const defaultPreferences: UserPreferences = {
    theme: 'auto',
    language: 'en',
    notifications: {
        email: true,
        push: true,
        claims: true,
        governance: true,
        poolUpdates: true
    },
    display: {
        compactMode: false,
        showTutorials: true,
        animationsEnabled: true
    },
    privacy: {
        shareAnalytics: false,
        publicProfile: false
    }
};

interface PreferencesContextType {
    preferences: UserPreferences;
    updatePreferences: (updates: Partial<UserPreferences>) => void;
    resetPreferences: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
    const [preferences, setPreferences] = useState<UserPreferences>(() => {
        const saved = localStorage.getItem('userPreferences');
        return saved ? JSON.parse(saved) : defaultPreferences;
    });

    useEffect(() => {
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
    }, [preferences]);

    const updatePreferences = (updates: Partial<UserPreferences>) => {
        setPreferences(prev => ({ ...prev, ...updates }));
    };

    const resetPreferences = () => {
        setPreferences(defaultPreferences);
    };

    return (
        <PreferencesContext.Provider value= {{ preferences, updatePreferences, resetPreferences }
}>
    { children }
    </PreferencesContext.Provider>
    );
}

export function usePreferences() {
    const context = useContext(PreferencesContext);
    if (!context) {
        throw new Error('usePreferences must be used within PreferencesProvider');
    }
    return context;
}

export function PreferencesPanel() {
    const { preferences, updatePreferences, resetPreferences } = usePreferences();

    return (
        <div className= "max-w-4xl mx-auto p-6" >
        <h2 className="text-3xl font-bold text-gray-900 mb-8" > Preferences </h2>

    {/* Notifications */ }
    <Section title="Notifications" >
        <Toggle
                    label="Email Notifications"
    checked = { preferences.notifications.email }
    onChange = {(checked) => updatePreferences({
        notifications: { ...preferences.notifications, email: checked }
    })
}
                />
    < Toggle
label = "Push Notifications"
checked = { preferences.notifications.push }
onChange = {(checked) => updatePreferences({
    notifications: { ...preferences.notifications, push: checked }
})}
                />
    < Toggle
label = "Claim Updates"
checked = { preferences.notifications.claims }
onChange = {(checked) => updatePreferences({
    notifications: { ...preferences.notifications, claims: checked }
})}
                />
    </Section>

{/* Display */ }
<Section title="Display" >
    <Toggle
                    label="Compact Mode"
checked = { preferences.display.compactMode }
onChange = {(checked) => updatePreferences({
    display: { ...preferences.display, compactMode: checked }
})}
                />
    < Toggle
label = "Show Tutorials"
checked = { preferences.display.showTutorials }
onChange = {(checked) => updatePreferences({
    display: { ...preferences.display, showTutorials: checked }
})}
                />
    < Toggle
label = "Animations"
checked = { preferences.display.animationsEnabled }
onChange = {(checked) => updatePreferences({
    display: { ...preferences.display, animationsEnabled: checked }
})}
                />
    </Section>

{/* Privacy */ }
<Section title="Privacy" >
    <Toggle
                    label="Share Analytics"
checked = { preferences.privacy.shareAnalytics }
onChange = {(checked) => updatePreferences({
    privacy: { ...preferences.privacy, shareAnalytics: checked }
})}
                />
    < Toggle
label = "Public Profile"
checked = { preferences.privacy.publicProfile }
onChange = {(checked) => updatePreferences({
    privacy: { ...preferences.privacy, publicProfile: checked }
})}
                />
    </Section>

    < button
onClick = { resetPreferences }
className = "mt-8 px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300"
    >
    Reset to Defaults
        </button>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className= "bg-white rounded-lg shadow-md p-6 mb-6" >
        <h3 className="text-lg font-semibold text-gray-900 mb-4" > { title } </h3>
            < div className = "space-y-4" > { children } </div>
                </div>
    );
}

function Toggle({ label, checked, onChange }: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <div className= "flex items-center justify-between" >
        <span className="text-gray-700" > { label } </span>
            < button
    onClick = {() => onChange(!checked)
}
className = {`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-300'
    }`}
            >
    <span
                    className={
    `absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'transform translate-x-6' : ''
    }`
}
                />
    </button>
    </div>
    );
}
