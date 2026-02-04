/**
 * Time-Locked Voting System
 * Implements time delays and lock periods for governance decisions
 */

export interface TimeLock {
    proposalId: number;
    executionTime: Date;
    lockPeriod: number; // in hours
    status: 'pending' | 'ready' | 'executed' | 'cancelled';
    queuedAt: Date;
}

/**
 * Calculate execution time for a proposal
 */
export function calculateExecutionTime(
    votingEndTime: Date,
    lockPeriod: number // in hours
): Date {
    const executionTime = new Date(votingEndTime);
    executionTime.setHours(executionTime.getHours() + lockPeriod);
    return executionTime;
}

/**
 * Get time lock period based on proposal type
 */
export function getTimeLockPeriod(proposalType: 'standard' | 'critical' | 'emergency'): number {
    const periods = {
        standard: 48, // 48 hours (2 days)
        critical: 168, // 168 hours (7 days)
        emergency: 24 // 24 hours (1 day)
    };
    return periods[proposalType];
}

/**
 * Check if proposal is ready for execution
 */
export function isReadyForExecution(timeLock: TimeLock): boolean {
    const now = new Date();
    return timeLock.status === 'ready' ||
        (timeLock.status === 'pending' && now >= timeLock.executionTime);
}

/**
 * Calculate time remaining until execution
 */
export function getTimeRemaining(executionTime: Date): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number; // in milliseconds
} {
    const now = new Date();
    const total = executionTime.getTime() - now.getTime();

    if (total <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((total % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, total };
}

/**
 * Format time remaining for display
 */
export function formatTimeRemaining(executionTime: Date): string {
    const remaining = getTimeRemaining(executionTime);

    if (remaining.total <= 0) {
        return 'Ready for execution';
    }

    if (remaining.days > 0) {
        return `${remaining.days}d ${remaining.hours}h`;
    }
    if (remaining.hours > 0) {
        return `${remaining.hours}h ${remaining.minutes}m`;
    }
    return `${remaining.minutes}m ${remaining.seconds}s`;
}

/**
 * Validate time lock cancellation
 */
export function canCancelTimeLock(
    timeLock: TimeLock,
    userRole: 'owner' | 'admin' | 'user'
): { allowed: boolean; reason?: string } {
    if (timeLock.status === 'executed') {
        return { allowed: false, reason: 'Proposal already executed' };
    }

    if (timeLock.status === 'cancelled') {
        return { allowed: false, reason: 'Proposal already cancelled' };
    }

    if (userRole === 'user') {
        return { allowed: false, reason: 'Insufficient permissions' };
    }

    return { allowed: true };
}

/**
 * Get time lock status color
 */
export function getTimeLockStatusColor(status: TimeLock['status']): string {
    const colors = {
        pending: '#f59e0b',
        ready: '#10b981',
        executed: '#6b7280',
        cancelled: '#ef4444'
    };
    return colors[status];
}
