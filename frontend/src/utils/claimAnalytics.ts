import type { Claim } from '../types';

export const calculateClaimSuccessRate = (claims: Claim[]): number => {
    if (claims.length === 0) return 0;
    const approved = claims.filter((c) => c.status === 1).length;
    return (approved / claims.length) * 100;
};

export const calculateAverageProcessingTime = (claims: Claim[]): number => {
    const processedClaims = claims.filter((c) => c.status !== 0);
    if (processedClaims.length === 0) return 0;
    
    // Assuming 7 days average for demo
    return 7;
};

export const getTotalClaimsValue = (claims: Claim[]): number => {
    return claims.reduce((sum, claim) => sum + claim.amount, 0);
};

export const getClaimsByStatus = (claims: Claim[]) => {
    return {
        pending: claims.filter((c) => c.status === 0),
        approved: claims.filter((c) => c.status === 1),
        rejected: claims.filter((c) => c.status === 2),
    };
};
