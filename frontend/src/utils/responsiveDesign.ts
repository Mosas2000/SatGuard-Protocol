/**
 * Mobile Responsive Design Utilities
 * Provides hooks and utilities for responsive design
 */

import { useState, useEffect } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

export interface BreakpointConfig {
    mobile: number;
    tablet: number;
    desktop: number;
    wide: number;
}

export const BREAKPOINTS: BreakpointConfig = {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    wide: 1280
};

/**
 * Hook to detect current breakpoint
 */
export function useBreakpoint(): Breakpoint {
    const [breakpoint, setBreakpoint] = useState<Breakpoint>(getBreakpoint());

    useEffect(() => {
        const handleResize = () => {
            setBreakpoint(getBreakpoint());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return breakpoint;
}

function getBreakpoint(): Breakpoint {
    const width = window.innerWidth;
    if (width < BREAKPOINTS.mobile) return 'mobile';
    if (width < BREAKPOINTS.tablet) return 'tablet';
    if (width < BREAKPOINTS.desktop) return 'desktop';
    return 'wide';
}

/**
 * Hook to detect if mobile
 */
export function useIsMobile(): boolean {
    const breakpoint = useBreakpoint();
    return breakpoint === 'mobile';
}

/**
 * Hook to detect if tablet or smaller
 */
export function useIsTablet(): boolean {
    const breakpoint = useBreakpoint();
    return breakpoint === 'mobile' || breakpoint === 'tablet';
}

/**
 * Responsive grid columns
 */
export function getResponsiveColumns(breakpoint: Breakpoint): number {
    const columns = {
        mobile: 1,
        tablet: 2,
        desktop: 3,
        wide: 4
    };
    return columns[breakpoint];
}

/**
 * Responsive padding
 */
export function getResponsivePadding(breakpoint: Breakpoint): string {
    const padding = {
        mobile: 'p-4',
        tablet: 'p-6',
        desktop: 'p-8',
        wide: 'p-10'
    };
    return padding[breakpoint];
}

/**
 * Responsive font sizes
 */
export const responsiveFontSizes = {
    h1: {
        mobile: 'text-2xl',
        tablet: 'text-3xl',
        desktop: 'text-4xl',
        wide: 'text-5xl'
    },
    h2: {
        mobile: 'text-xl',
        tablet: 'text-2xl',
        desktop: 'text-3xl',
        wide: 'text-4xl'
    },
    body: {
        mobile: 'text-sm',
        tablet: 'text-base',
        desktop: 'text-base',
        wide: 'text-lg'
    }
};

/**
 * Touch-friendly button sizes
 */
export function getTouchFriendlySize(isMobile: boolean): string {
    return isMobile ? 'min-h-[44px] min-w-[44px]' : 'min-h-[36px] min-w-[36px]';
}
