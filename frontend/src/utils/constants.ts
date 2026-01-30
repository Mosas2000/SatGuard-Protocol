export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
export const CONTRACT_NAME = import.meta.env.VITE_CONTRACT_NAME;
export const STACKS_API_URL = import.meta.env.VITE_STACKS_API_URL;

export const POOL_STATUS = {
    ACTIVE: 1,
    CLOSED: 2,
} as const;

export const CLAIM_STATUS = {
    PENDING: 1,
    APPROVED: 2,
    REJECTED: 3,
    PAID: 4,
} as const;

export const MICRO_STACKS = 1_000_000;

export const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatAmount = (amount: number): string => {
    return (amount / MICRO_STACKS).toFixed(4);
};
