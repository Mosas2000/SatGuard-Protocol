export interface ClaimInsight {
    totalClaims: number;
    approvedClaims: number;
    rejectedClaims: number;
    pendingClaims: number;
    totalPaidOut: number;
    averageClaimAmount: number;
    successRate: number;
}

export const generateClaimInsights = (claims: Array<{ status: number; amount: number }>): ClaimInsight => {
    const approved = claims.filter(c => c.status === 1);
    const rejected = claims.filter(c => c.status === 2);
    const pending = claims.filter(c => c.status === 0);
    
    const totalPaidOut = approved.reduce((sum, c) => sum + c.amount, 0);
    const avgAmount = claims.length > 0 ? claims.reduce((sum, c) => sum + c.amount, 0) / claims.length : 0;
    
    return {
        totalClaims: claims.length,
        approvedClaims: approved.length,
        rejectedClaims: rejected.length,
        pendingClaims: pending.length,
        totalPaidOut,
        averageClaimAmount: avgAmount,
        successRate: claims.length > 0 ? (approved.length / claims.length) * 100 : 0,
    };
};
