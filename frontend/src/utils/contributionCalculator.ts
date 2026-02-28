export const calculateAPY = (totalFunds: number, contributors: number): number => {
    // Simplified APY calculation for demo
    const baseAPY = 5;
    const contributorBonus = Math.min(contributors * 0.1, 5);
    const liquidityBonus = Math.min((totalFunds / 1000000000) * 2, 10);
    
    return baseAPY + contributorBonus + liquidityBonus;
};

export const estimateReturns = (contributionAmount: number, durationDays: number, apy: number): number => {
    return (contributionAmount * (apy / 100) * durationDays) / 365;
};

export const calculateContributionShare = (userContribution: number, totalFunds: number): number => {
    return totalFunds > 0 ? (userContribution / totalFunds) * 100 : 0;
};
