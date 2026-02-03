/**
 * Automated Claim Validation
 * Validates claims against predefined rules and criteria
 */

export interface ValidationResult {
    isValid: boolean;
    score: number; // 0-100
    checks: ValidationCheck[];
    warnings: string[];
    errors: string[];
    recommendations: string[];
}

export interface ValidationCheck {
    name: string;
    passed: boolean;
    severity: 'critical' | 'warning' | 'info';
    message: string;
}

export interface ClaimValidationData {
    amount: number;
    poolMaxCoverage: number;
    poolLiquidity: number;
    evidenceCount: number;
    accountAge: number; // in days
    previousClaims: number;
    claimReason: string;
    category: string;
}

export function validateClaim(data: ClaimValidationData): ValidationResult {
    const checks: ValidationCheck[] = [];
    const warnings: string[] = [];
    const errors: string[] = [];
    const recommendations: string[] = [];

    // Check 1: Amount within limits
    if (data.amount > data.poolMaxCoverage) {
        checks.push({
            name: 'Amount Limit Check',
            passed: false,
            severity: 'critical',
            message: `Claim amount (${data.amount}) exceeds pool maximum coverage (${data.poolMaxCoverage})`
        });
        errors.push('Claim amount exceeds pool limits');
    } else {
        checks.push({
            name: 'Amount Limit Check',
            passed: true,
            severity: 'info',
            message: 'Claim amount within pool limits'
        });
    }

    // Check 2: Pool liquidity
    if (data.amount > data.poolLiquidity) {
        checks.push({
            name: 'Liquidity Check',
            passed: false,
            severity: 'critical',
            message: `Insufficient pool liquidity (${data.poolLiquidity}) for claim amount (${data.amount})`
        });
        errors.push('Insufficient pool liquidity');
    } else if (data.amount > data.poolLiquidity * 0.8) {
        checks.push({
            name: 'Liquidity Check',
            passed: true,
            severity: 'warning',
            message: 'Claim amount is high relative to pool liquidity'
        });
        warnings.push('High liquidity utilization - may face delays');
    } else {
        checks.push({
            name: 'Liquidity Check',
            passed: true,
            severity: 'info',
            message: 'Sufficient pool liquidity available'
        });
    }

    // Check 3: Evidence requirement
    const minEvidence = data.amount > 5 ? 3 : 2;
    if (data.evidenceCount < minEvidence) {
        checks.push({
            name: 'Evidence Check',
            passed: false,
            severity: 'warning',
            message: `Insufficient evidence (${data.evidenceCount}/${minEvidence} required)`
        });
        warnings.push(`Please provide at least ${minEvidence} pieces of evidence`);
        recommendations.push('Upload additional supporting documentation');
    } else {
        checks.push({
            name: 'Evidence Check',
            passed: true,
            severity: 'info',
            message: 'Adequate evidence provided'
        });
    }

    // Check 4: Account age
    if (data.accountAge < 7) {
        checks.push({
            name: 'Account Age Check',
            passed: true,
            severity: 'warning',
            message: 'New account - additional verification may be required'
        });
        warnings.push('New account may require extended review period');
        recommendations.push('Consider waiting period for account maturity');
    } else {
        checks.push({
            name: 'Account Age Check',
            passed: true,
            severity: 'info',
            message: 'Account meets age requirements'
        });
    }

    // Check 5: Claim frequency
    if (data.previousClaims > 5) {
        checks.push({
            name: 'Claim Frequency Check',
            passed: true,
            severity: 'warning',
            message: 'High number of previous claims detected'
        });
        warnings.push('Multiple previous claims may trigger additional review');
        recommendations.push('Provide explanation for claim frequency');
    } else {
        checks.push({
            name: 'Claim Frequency Check',
            passed: true,
            severity: 'info',
            message: 'Normal claim frequency'
        });
    }

    // Check 6: Claim reason length
    if (data.claimReason.length < 50) {
        checks.push({
            name: 'Reason Detail Check',
            passed: false,
            severity: 'warning',
            message: 'Claim reason is too brief'
        });
        warnings.push('Provide more detailed explanation');
        recommendations.push('Include specific dates, amounts, and circumstances');
    } else {
        checks.push({
            name: 'Reason Detail Check',
            passed: true,
            severity: 'info',
            message: 'Adequate claim reason provided'
        });
    }

    // Check 7: Category validation
    const validCategories = ['exchange-hack', 'rug-pull', 'smart-contract', 'nft-theft', 'other'];
    if (!validCategories.includes(data.category)) {
        checks.push({
            name: 'Category Check',
            passed: false,
            severity: 'critical',
            message: 'Invalid claim category'
        });
        errors.push('Please select a valid claim category');
    } else {
        checks.push({
            name: 'Category Check',
            passed: true,
            severity: 'info',
            message: 'Valid claim category selected'
        });
    }

    // Calculate overall validation score
    const passedChecks = checks.filter(c => c.passed).length;
    const criticalFailures = checks.filter(c => !c.passed && c.severity === 'critical').length;
    const score = criticalFailures > 0 ? 0 : Math.round((passedChecks / checks.length) * 100);

    const isValid = errors.length === 0;

    return {
        isValid,
        score,
        checks,
        warnings,
        errors,
        recommendations
    };
}

export function getValidationColor(score: number): string {
    if (score >= 90) return '#10b981';
    if (score >= 70) return '#3b82f6';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
}

export function getValidationStatus(result: ValidationResult): string {
    if (!result.isValid) return 'Invalid';
    if (result.score >= 90) return 'Excellent';
    if (result.score >= 70) return 'Good';
    if (result.score >= 50) return 'Fair';
    return 'Poor';
}
