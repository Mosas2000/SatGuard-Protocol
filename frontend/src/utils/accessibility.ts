/**
 * Accessibility Features
 * WCAG 2.1 AA compliant accessibility utilities
 */

import { useEffect, useState } from 'react';

/**
 * Skip to main content link
 */
export function SkipToMainContent() {
    return (
        <a
            href= "#main-content"
    className = "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
        >
        Skip to main content
            </a>
    );
}

/**
 * Screen reader only text
 */
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
    return <span className="sr-only" > { children } </span>;
}

/**
 * Focus trap for modals
 */
export function useFocusTrap(isActive: boolean) {
    useEffect(() => {
        if (!isActive) return;

        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        document.addEventListener('keydown', handleTab);
        firstElement?.focus();

        return () => document.removeEventListener('keydown', handleTab);
    }, [isActive]);
}

/**
 * Keyboard navigation hook
 */
export function useKeyboardNavigation(onEscape?: () => void, onEnter?: () => void) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && onEscape) {
                onEscape();
            }
            if (e.key === 'Enter' && onEnter) {
                onEnter();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onEscape, onEnter]);
}

/**
 * Announce to screen readers
 */
export function announceToScreenReader(message: string) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
}

/**
 * High contrast mode detection
 */
export function useHighContrastMode(): boolean {
    const [isHighContrast, setIsHighContrast] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-contrast: high)');
        setIsHighContrast(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setIsHighContrast(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    return isHighContrast;
}

/**
 * Reduced motion detection
 */
export function useReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    return prefersReducedMotion;
}

/**
 * ARIA live region component
 */
export function LiveRegion({ message, politeness = 'polite' }: {
    message: string;
    politeness?: 'polite' | 'assertive';
}) {
    return (
        <div
            role= "status"
    aria - live={ politeness }
    aria - atomic="true"
    className = "sr-only"
        >
        { message }
        </div>
    );
}
