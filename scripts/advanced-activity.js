#!/usr/bin/env node

/**
 * SatGuard Protocol - Advanced Activity Generator
 * 
 * Creates diverse on-chain activity with multiple scenarios:
 * - Various pool types and sizes
 * - Different contribution amounts
 * - Multiple claims with different outcomes
 * - Diverse voting patterns
 * - Pool lifecycle (create, use, close)
 */

import { makeContractCall, broadcastTransaction, AnchorMode, uintCV, stringAsciiCV, stringUtf8CV, trueCV, falseCV } from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';
import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';
import * as fs from 'fs';
import * as path from 'path';
import toml from 'toml';

const NETWORK = new StacksTestnet();
const CONTRACT_NAME = 'insurance-pool';
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

console.log('='.repeat(70));
console.log('SatGuard Protocol - Advanced Activity Generator');
console.log('='.repeat(70));

async function generateAdvancedActivity() {
    try {
        // Read configuration
        const configPath = path.join(process.cwd(), '..', 'settings', 'Testnet.toml');
        const configFile = fs.readFileSync(configPath, 'utf8');
        const config = toml.parse(configFile);

        const mnemonic = config.accounts?.deployer?.mnemonic;
        if (!mnemonic || mnemonic === 'YOUR_TESTNET_MNEMONIC_HERE') {
            console.error('\n❌ Error: Please set your testnet mnemonic in settings/Testnet.toml');
            process.exit(1);
        }

        let contractInput = process.argv[2];
        if (!contractInput) {
            console.error('\n❌ Error: Please provide your contract address');
            console.log('\nUsage: npm run advanced-activity YOUR_CONTRACT_ADDRESS');
            process.exit(1);
        }

        const contractAddress = contractInput.includes('.') ? contractInput.split('.')[0] : contractInput;

        const wallet = await generateWallet({ secretKey: mnemonic, password: '' });
        const account = wallet.accounts[0];
        const privateKey = account.stxPrivateKey;
        const address = getStxAddress({ account, transactionVersion: 0x80 });

        console.log(`\n📍 Your Address: ${address}`);
        console.log(`📍 Contract: ${contractAddress}.${CONTRACT_NAME}`);
        console.log('\n🎯 Generating diverse on-chain activity...\n');

        let txCount = 0;

        // Scenario 1: DeFi Protocol Insurance
        console.log('📦 Scenario 1: DeFi Protocol Insurance Pool');
        const pool1 = await makeContractCall({
            contractAddress, contractName: CONTRACT_NAME, functionName: 'create-pool',
            functionArgs: [stringAsciiCV('DeFi Protocol Exploit'), uintCV(500000), uintCV(5000000)],
            senderKey: privateKey, network: NETWORK, anchorMode: AnchorMode.Any,
        });
        const pool1Res = await broadcastTransaction(pool1, NETWORK);
        if (!pool1Res.error) {
            console.log(`   ✅ Pool created - TX: ${pool1Res.txid.substring(0, 16)}...`);
            txCount++;
        }
        await sleep(3000);

        // Scenario 2: NFT Marketplace Insurance
        console.log('📦 Scenario 2: NFT Marketplace Insurance Pool');
        const pool2 = await makeContractCall({
            contractAddress, contractName: CONTRACT_NAME, functionName: 'create-pool',
            functionArgs: [stringAsciiCV('NFT Marketplace Fraud'), uintCV(300000), uintCV(3000000)],
            senderKey: privateKey, network: NETWORK, anchorMode: AnchorMode.Any,
        });
        const pool2Res = await broadcastTransaction(pool2, NETWORK);
        if (!pool2Res.error) {
            console.log(`   ✅ Pool created - TX: ${pool2Res.txid.substring(0, 16)}...`);
            txCount++;
        }
        await sleep(3000);

        // Scenario 3: Wallet Security Insurance
        console.log('📦 Scenario 3: Wallet Security Insurance Pool');
        const pool3 = await makeContractCall({
            contractAddress, contractName: CONTRACT_NAME, functionName: 'create-pool',
            functionArgs: [stringAsciiCV('Wallet Compromise'), uintCV(150000), uintCV(1500000)],
            senderKey: privateKey, network: NETWORK, anchorMode: AnchorMode.Any,
        });
        const pool3Res = await broadcastTransaction(pool3, NETWORK);
        if (!pool3Res.error) {
            console.log(`   ✅ Pool created - TX: ${pool3Res.txid.substring(0, 16)}...`);
            txCount++;
        }
        await sleep(3000);

        // Multiple contributions with varying amounts
        console.log('\n💰 Making diverse contributions...');
        const contributions = [
            { poolId: 0, amount: 600000, desc: '0.6 sBTC to DeFi Pool' },
            { poolId: 0, amount: 800000, desc: '0.8 sBTC to DeFi Pool' },
            { poolId: 1, amount: 400000, desc: '0.4 sBTC to NFT Pool' },
            { poolId: 1, amount: 500000, desc: '0.5 sBTC to NFT Pool' },
            { poolId: 2, amount: 200000, desc: '0.2 sBTC to Wallet Pool' },
            { poolId: 2, amount: 350000, desc: '0.35 sBTC to Wallet Pool' },
        ];

        for (const contrib of contributions) {
            const tx = await makeContractCall({
                contractAddress, contractName: CONTRACT_NAME, functionName: 'contribute-to-pool',
                functionArgs: [uintCV(contrib.poolId), uintCV(contrib.amount)],
                senderKey: privateKey, network: NETWORK, anchorMode: AnchorMode.Any,
            });
            const res = await broadcastTransaction(tx, NETWORK);
            if (!res.error) {
                console.log(`   ✅ ${contrib.desc} - TX: ${res.txid.substring(0, 16)}...`);
                txCount++;
            }
            await sleep(2500);
        }

        // Submit various claims
        console.log('\n📋 Submitting diverse claims...');
        const claims = [
            { poolId: 0, amount: 2000000, reason: 'Smart contract exploit resulted in loss of funds from DeFi protocol' },
            { poolId: 1, amount: 1500000, reason: 'NFT marketplace phishing attack led to stolen assets' },
            { poolId: 2, amount: 800000, reason: 'Private key compromised, wallet drained by attacker' },
        ];

        for (const claim of claims) {
            const tx = await makeContractCall({
                contractAddress, contractName: CONTRACT_NAME, functionName: 'submit-claim',
                functionArgs: [uintCV(claim.poolId), uintCV(claim.amount), stringUtf8CV(claim.reason)],
                senderKey: privateKey, network: NETWORK, anchorMode: AnchorMode.Any,
            });
            const res = await broadcastTransaction(tx, NETWORK);
            if (!res.error) {
                console.log(`   ✅ Claim ${claim.amount / 1000000} sBTC - TX: ${res.txid.substring(0, 16)}...`);
                txCount++;
            }
            await sleep(2500);
        }

        // Vote on claims with different outcomes
        console.log('\n🗳️  Voting on claims...');
        const votes = [
            { claimId: 0, approve: true, desc: 'Approve DeFi claim' },
            { claimId: 1, approve: true, desc: 'Approve NFT claim' },
            { claimId: 2, approve: false, desc: 'Reject Wallet claim' },
        ];

        for (const vote of votes) {
            const tx = await makeContractCall({
                contractAddress, contractName: CONTRACT_NAME, functionName: 'vote-on-claim',
                functionArgs: [uintCV(vote.claimId), vote.approve ? trueCV() : falseCV()],
                senderKey: privateKey, network: NETWORK, anchorMode: AnchorMode.Any,
            });
            const res = await broadcastTransaction(tx, NETWORK);
            if (!res.error) {
                console.log(`   ✅ ${vote.desc} - TX: ${res.txid.substring(0, 16)}...`);
                txCount++;
            }
            await sleep(2500);
        }

        console.log('\n' + '='.repeat(70));
        console.log('✅ Advanced activity generation complete!');
        console.log(`\n📊 Summary:`);
        console.log(`   - ${txCount} total transactions broadcast`);
        console.log(`   - 3 insurance pools created (DeFi, NFT, Wallet)`);
        console.log(`   - 6 contributions made with varying amounts`);
        console.log(`   - 3 claims submitted with detailed reasons`);
        console.log(`   - 3 votes cast (2 approve, 1 reject)`);
        console.log('\n⏳ Transactions will confirm in 10-20 minutes.');
        console.log('   Check explorer for status updates.\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

generateAdvancedActivity();
