/**
 * Pool Migration Utility
 * Handles migration of pools between versions and configurations
 */

export interface MigrationPlan {
    sourcePoolId: number;
    targetPoolId: number;
    migrateContributors: boolean;
    migrateClaims: boolean;
    migrateSettings: boolean;
    estimatedDuration: number; // in blocks
    risks: string[];
}

export interface MigrationStatus {
    inProgress: boolean;
    currentStep: string;
    progress: number; // 0-100
    contributorsMigrated: number;
    claimsMigrated: number;
    errors: string[];
}

/**
 * Create a migration plan for moving pool data
 */
export function createMigrationPlan(
    sourcePoolId: number,
    targetPoolId: number,
    options: {
        migrateContributors?: boolean;
        migrateClaims?: boolean;
        migrateSettings?: boolean;
    } = {}
): MigrationPlan {
    const {
        migrateContributors = true,
        migrateClaims = true,
        migrateSettings = true
    } = options;

    const risks: string[] = [];
    let estimatedDuration = 10; // Base duration

    if (migrateContributors) {
        estimatedDuration += 20;
        risks.push('Contributor balances must be accurately transferred');
    }

    if (migrateClaims) {
        estimatedDuration += 30;
        risks.push('Active claims may be delayed during migration');
    }

    if (migrateSettings) {
        estimatedDuration += 5;
        risks.push('Pool settings may need manual verification');
    }

    risks.push('Source pool will be locked during migration');
    risks.push('Ensure sufficient gas for all migration transactions');

    return {
        sourcePoolId,
        targetPoolId,
        migrateContributors,
        migrateClaims,
        migrateSettings,
        estimatedDuration,
        risks
    };
}

/**
 * Validate migration prerequisites
 */
export function validateMigration(plan: MigrationPlan): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (plan.sourcePoolId === plan.targetPoolId) {
        errors.push('Source and target pools cannot be the same');
    }

    if (plan.sourcePoolId <= 0 || plan.targetPoolId <= 0) {
        errors.push('Invalid pool IDs');
    }

    if (!plan.migrateContributors && !plan.migrateClaims && !plan.migrateSettings) {
        errors.push('At least one migration option must be selected');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Calculate migration cost estimate
 */
export function estimateMigrationCost(plan: MigrationPlan): {
    gasCost: number;
    timeCost: number;
    totalTransactions: number;
} {
    let totalTransactions = 1; // Base migration transaction

    if (plan.migrateContributors) {
        totalTransactions += 10; // Estimate 10 contributor batches
    }

    if (plan.migrateClaims) {
        totalTransactions += 5; // Estimate 5 claim batches
    }

    if (plan.migrateSettings) {
        totalTransactions += 1;
    }

    const gasCost = totalTransactions * 0.001; // 0.001 STX per transaction estimate
    const timeCost = plan.estimatedDuration;

    return {
        gasCost,
        timeCost,
        totalTransactions
    };
}

/**
 * Generate migration checklist
 */
export function getMigrationChecklist(plan: MigrationPlan): string[] {
    const checklist: string[] = [
        'Verify source pool is in valid state',
        'Verify target pool is ready to receive data',
        'Backup current pool state',
        'Notify all contributors of migration',
        'Pause source pool operations'
    ];

    if (plan.migrateContributors) {
        checklist.push('Verify all contributor balances');
        checklist.push('Prepare contributor migration batches');
    }

    if (plan.migrateClaims) {
        checklist.push('Review all active claims');
        checklist.push('Prepare claim migration data');
    }

    if (plan.migrateSettings) {
        checklist.push('Document current pool settings');
        checklist.push('Verify settings compatibility');
    }

    checklist.push('Execute migration transactions');
    checklist.push('Verify migration success');
    checklist.push('Resume pool operations');
    checklist.push('Monitor for issues');

    return checklist;
}

/**
 * Rollback migration if needed
 */
export function createRollbackPlan(plan: MigrationPlan): string[] {
    return [
        'Pause target pool immediately',
        'Restore source pool from backup',
        'Revert all migrated data',
        'Notify contributors of rollback',
        'Resume source pool operations',
        'Investigate migration failure',
        'Fix issues before retry'
    ];
}

/**
 * Format migration duration
 */
export function formatMigrationDuration(blocks: number): string {
    const minutes = Math.ceil((blocks * 10) / 60); // Assuming 10 min per block
    if (minutes < 60) {
        return `~${minutes} minutes`;
    }
    const hours = Math.ceil(minutes / 60);
    return `~${hours} hour${hours > 1 ? 's' : ''}`;
}

/**
 * Get migration status message
 */
export function getMigrationStatusMessage(status: MigrationStatus): string {
    if (!status.inProgress) {
        return 'Migration not started';
    }

    if (status.progress === 100) {
        return 'Migration completed successfully';
    }

    if (status.errors.length > 0) {
        return `Migration in progress with ${status.errors.length} error(s)`;
    }

    return `Migration in progress: ${status.currentStep}`;
}
