/**
 * Fraud Detection Panel
 * Analyzes claims for potential fraud indicators
 */

export interface FraudIndicators {
    duplicateClaim: boolean;
    suspiciousPattern: boolean;
    inconsistentEvidence: boolean;
    rapidSubmissions: boolean;
    unusualAmount: boolean;
    newAccount: boolean;
}

export interface FraudScore {
    score: number; // 0-100 (100 = highest fraud risk)
    level: 'low' | 'medium' | 'high' | 'critical';
    indicators: FraudIndicators;
    recommendations: string[];
}

export function calculateFraudScore(claimData: {
    amount: number;
    accountAge: number; // in days
    previousClaims: number;
    evidenceCount: number;
    submissionTime: Date;
}): FraudScore {
    let score = 0;
    const indicators: FraudIndicators = {
        duplicateClaim: false,
        suspiciousPattern: false,
        inconsistentEvidence: false,
        rapidSubmissions: false,
        unusualAmount: false,
        newAccount: false
    };
    const recommendations: string[] = [];

    // Check for new account
    if (claimData.accountAge < 7) {
        score += 30;
        indicators.newAccount = true;
        recommendations.push('Account less than 7 days old - requires additional verification');
    }

    // Check for rapid submissions
    if (claimData.previousClaims > 3) {
        score += 25;
        indicators.rapidSubmissions = true;
        recommendations.push('Multiple claims submitted - review claim history');
    }

    // Check for unusual amount
    if (claimData.amount > 10) {
        score += 20;
        indicators.unusualAmount = true;
        recommendations.push('High claim amount - verify evidence thoroughly');
    }

    // Check for insufficient evidence
    if (claimData.evidenceCount < 2) {
        score += 15;
        indicators.inconsistentEvidence = true;
        recommendations.push('Insufficient evidence provided - request additional documentation');
    }

    // Check for suspicious patterns (simplified)
    const hour = claimData.submissionTime.getHours();
    if (hour >= 2 && hour <= 5) {
        score += 10;
        indicators.suspiciousPattern = true;
        recommendations.push('Unusual submission time detected');
    }

    const level = getFraudLevel(score);

    return {
        score,
        level,
        indicators,
        recommendations
    };
}

function getFraudLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 75) return 'critical';
    if (score >= 50) return 'high';
    if (score >= 25) return 'medium';
    return 'low';
}

export function getFraudColor(level: string): string {
    const colors = {
        low: '#10b981',
        medium: '#f59e0b',
        high: '#ef4444',
        critical: '#dc2626'
    };
    return colors[level as keyof typeof colors] || '#6b7280';
}
