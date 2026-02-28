export const claimValidation = {
    minAmount: 0.1,
    maxAmount: 1000000,
    reasonMinLength: 20,
    reasonMaxLength: 500,
};

export const validateClaimAmount = (amount: number, maxCoverage: number): string | null => {
    if (amount < claimValidation.minAmount) {
        return `Amount must be at least ${claimValidation.minAmount} STX`;
    }
    if (amount > maxCoverage) {
        return `Amount cannot exceed pool max coverage of ${maxCoverage / 1000000} STX`;
    }
    return null;
};

export const validateClaimReason = (reason: string): string | null => {
    if (reason.length < claimValidation.reasonMinLength) {
        return `Reason must be at least ${claimValidation.reasonMinLength} characters`;
    }
    if (reason.length > claimValidation.reasonMaxLength) {
        return `Reason cannot exceed ${claimValidation.reasonMaxLength} characters`;
    }
    return null;
};
