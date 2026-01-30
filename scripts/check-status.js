#!/usr/bin/env node

/**
 * Check Testnet Balance and Contract Status
 */

import { StacksTestnet } from '@stacks/network';
import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';
import * as fs from 'fs';
import * as path from 'path';
import toml from 'toml';

const NETWORK = new StacksTestnet();

async function checkStatus() {
    try {
        // Read configuration
        const configPath = path.join(process.cwd(), '..', 'settings', 'Testnet.toml');
        const configFile = fs.readFileSync(configPath, 'utf8');
        const config = toml.parse(configFile);

        const mnemonic = config.accounts?.deployer?.mnemonic;
        if (!mnemonic || mnemonic === 'YOUR_TESTNET_MNEMONIC_HERE') {
            console.error('❌ Please set your testnet mnemonic in settings/Testnet.toml');
            process.exit(1);
        }

        // Generate wallet
        const wallet = await generateWallet({
            secretKey: mnemonic,
            password: '',
        });

        const account = wallet.accounts[0];
        const address = getStxAddress({ account, transactionVersion: 0x80 });

        console.log('='.repeat(60));
        console.log('SatGuard Protocol - Testnet Status Check');
        console.log('='.repeat(60));
        console.log(`\n📍 Your Address: ${address}`);

        // Check balance
        const balanceUrl = `${NETWORK.coreApiUrl}/extended/v1/address/${address}/balances`;
        console.log(`\n🔍 Checking balance...`);

        const balanceResponse = await fetch(balanceUrl);
        const balanceData = await balanceResponse.json();

        const stxBalance = parseInt(balanceData.stx.balance) / 1000000; // Convert from micro-STX
        const locked = parseInt(balanceData.stx.locked) / 1000000;

        console.log(`\n💰 STX Balance: ${stxBalance} STX`);
        console.log(`🔒 Locked: ${locked} STX`);
        console.log(`✅ Available: ${stxBalance - locked} STX`);

        if (stxBalance < 0.1) {
            console.log(`\n⚠️  Low balance! Get test STX from:`);
            console.log(`   https://explorer.stacks.co/sandbox/faucet?chain=testnet`);
        }

        // Check for contracts
        const contractAddress = process.argv[2];
        if (contractAddress) {
            console.log(`\n🔍 Checking contract: ${contractAddress}.insurance-pool`);
            const contractUrl = `${NETWORK.coreApiUrl}/v2/contracts/interface/${contractAddress}/insurance-pool`;

            const contractResponse = await fetch(contractUrl);
            if (contractResponse.ok) {
                console.log(`✅ Contract deployed and accessible!`);
            } else {
                console.log(`❌ Contract not found or not deployed yet`);
                console.log(`   Make sure to deploy first: npm run deploy:testnet`);
            }
        }

        console.log('\n' + '='.repeat(60));

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

checkStatus();
