import { useState } from 'react';

interface TutorialStep {
    id: string;
    title: string;
    description: string;
    target?: string; // CSS selector for element to highlight
    position?: 'top' | 'bottom' | 'left' | 'right';
}

const tutorials: Record<string, TutorialStep[]> = {
    'getting-started': [
        {
            id: 'welcome',
            title: 'Welcome to SatGuard',
            description: 'Let\'s take a quick tour of the platform to help you get started.'
        },
        {
            id: 'dashboard',
            title: 'Your Dashboard',
            description: 'This is your personal dashboard where you can see all your pools, claims, and activity.',
            target: '#dashboard',
            position: 'bottom'
        },
        {
            id: 'pools',
            title: 'Insurance Pools',
            description: 'Browse and contribute to insurance pools to protect your assets.',
            target: '#pools-section',
            position: 'right'
        },
        {
            id: 'claims',
            title: 'Submit Claims',
            description: 'If you experience a loss, you can submit a claim for review.',
            target: '#claims-button',
            position: 'left'
        },
        {
            id: 'governance',
            title: 'Participate in Governance',
            description: 'Vote on proposals and help shape the future of the protocol.',
            target: '#governance-section',
            position: 'top'
        }
    ],
    'contributing': [
        {
            id: 'select-pool',
            title: 'Select a Pool',
            description: 'Choose a pool that matches your risk profile and coverage needs.'
        },
        {
            id: 'enter-amount',
            title: 'Enter Amount',
            description: 'Specify how much STX you want to contribute to the pool.'
        },
        {
            id: 'confirm',
            title: 'Confirm Transaction',
            description: 'Review the details and confirm your contribution using your wallet.'
        }
    ]
};

export default function InteractiveTutorial({ tutorialId }: { tutorialId: string }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isActive, setIsActive] = useState(false);

    const steps = tutorials[tutorialId] || [];
    const step = steps[currentStep];

    const startTutorial = () => {
        setCurrentStep(0);
        setIsActive(true);
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsActive(false);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const skipTutorial = () => {
        setIsActive(false);
        localStorage.setItem(`tutorial-${tutorialId}-completed`, 'true');
    };

    if (!isActive) {
        return (
            <button
                onClick={startTutorial}
                className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
                <span>📚</span>
                <span>Start Tutorial</span>
            </button>
        );
    }

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={skipTutorial} />

            {/* Tutorial Card */}
            <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl z-50 w-96 p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                    <button
                        onClick={skipTutorial}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                <p className="text-gray-600 mb-6">{step.description}</p>

                {/* Progress Indicator */}
                <div className="flex gap-1 mb-6">
                    {steps.map((_, idx) => (
                        <div
                            key={idx}
                            className={`flex-1 h-1 rounded-full ${idx <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                        />
                    ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ← Previous
                    </button>

                    <span className="text-sm text-gray-500">
                        {currentStep + 1} / {steps.length}
                    </span>

                    <button
                        onClick={nextStep}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        {currentStep === steps.length - 1 ? 'Finish' : 'Next →'}
                    </button>
                </div>
            </div>

            {/* Highlight Target Element */}
            {step.target && (
                <div
                    className="fixed border-4 border-blue-600 rounded-lg pointer-events-none z-30"
                    style={{
                        // Position would be calculated based on target element
                    }}
                />
            )}
        </>
    );
}
