export interface Pool {
    poolId: number;
    creator: string;
    coverageType: string;
    totalFunds: number;
    minContribution: number;
    maxCoverage: number;
    createdAt: number;
    status: number;
    contributorCount: number;
}

export interface Contribution {
    amount: number;
    contributedAt: number;
}

export interface Claim {
    claimId: number;
    poolId: number;
    claimant: string;
    amount: number;
    reason: string;
    submittedAt: number;
    status: number;
    votesFor: number;
    votesAgainst: number;
}

export interface Vote {
    vote: boolean;
    votingPower: number;
    votedAt: number;
}

export interface UserSession {
    address: string | null;
    isConnected: boolean;
}
