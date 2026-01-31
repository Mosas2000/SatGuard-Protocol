import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

const isMainnet = import.meta.env.VITE_STACKS_NETWORK === 'mainnet';

export const network = isMainnet
    ? STACKS_MAINNET
    : STACKS_TESTNET;

export const explorerUrl = isMainnet
    ? 'https://explorer.hiro.so'
    : 'https://explorer.hiro.so/?chain=testnet';

export const getTxUrl = (txId: string): string => {
    return `${explorerUrl}/txid/${txId}`;
};

export const getAddressUrl = (address: string): string => {
    return `${explorerUrl}/address/${address}`;
};
