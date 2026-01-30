#!/usr/bin/env node

/**
 * More Mainnet Activity Generator
 * Creates additional diverse on-chain activity
 */

import { makeContractCall, broadcastTransaction, AnchorMode, uintCV, stringAsciiCV, stringUtf8CV, trueCV, falseCV } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';
import * as fs from 'fs';
import * as path from 'path';
import toml from 'toml';

const NETWORK = new StacksMainnet();
const CONTRACT_ADDRESS = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
const CONTRACT_NAME = 'insurance-pool';
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

console.log('='.repeat(70));
console.log('More Mainnet Activity Generator');
console.log('='.repeat(70));

async function generateMoreActivity() {
    try {
        const configPath = path.join(process.cwd(), '..', 'settings', 'Mainnet.toml');
        const configFile = fs.readFileSync(configPath, 'utf8');
        const config = toml.parse(configFile);

        const mnemonic = config.accounts?.deployer?.mnemonic;
        const wallet = await generateWallet({ secretKey: mnemonic, password: '' });
        const account = wallet.accounts[0];
        const privateKey = account.stxPrivateKey;
        const address = getStxAddress({ account, transactionVersion: 0x16 });

        console.log(`\n📍 Address: ${address}`);
        console.log(`📍 Contract: ${CONTRACT_ADDRESS}.${CONTRACT_NAME}\n`);
        console.log('🚀 Creating diverse mainnet activity...\n');

        let successCount = 0;

        // Activity 1: Create another pool
        console.log('📦 Activity 1: Creating new insurance pool...');
        try {
            const pool = await makeContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'create-pool',
                functionArgs: [
                    stringAsciiCV('NFT Marketplace Insurance'),
                    uintCV(300000),    // 0.3 sBTC min
                    uintCV(3000000)    // 3 sBTC max
                ],
                senderKey: privateKey,
                network: NETWORK,
                anchorMode: AnchorMode.Any,
            });

            const poolRes = await broadcastTransaction(pool, NETWORK);

            if (poolRes.error) {
                console.error(`   ❌ Failed: ${poolRes.error}`);
            } else {
                console.log(`   ✅ Success! TX: ${poolRes.txid}`);
                console.log(`   🔍 https://explorer.stacks.co/txid/${poolRes.txid}?chain=mainnet\n`);
                successCount++;
                await sleep(3000);
            }
        } catch (e) {
            console.error(`   ❌ Error: ${e.message}\n`);
        }

        // Activity 2: Another contribution to Pool 1
        console.log('💰 Activity 2: Additional contribution to Pool 1...');
        try {
            const contrib = await makeContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'contribute',
                functionArgs: [uintCV(1), uintCV(400000)], // 0.4 sBTC
                senderKey: privateKey,
                network: NETWORK,
                anchorMode: AnchorMode.Any,
            });

            const contribRes = await broadcastTransaction(contrib, NETWORK);

            if (contribRes.error) {
                console.error(`   ❌ Failed: ${contribRes.error}`);
            } else {
                console.log(`   ✅ Success! TX: ${contribRes.txid}`);
                console.log(`   🔍 https://explorer.stacks.co/txid/${contribRes.txid}?chain=mainnet\n`);
                successCount++;
                await sleep(3000);
            }
        } catch (e) {
            console.error(`   ❌ Error: ${e.message}\n`);
        }

        // Activity 3: Submit claim to Pool 1
        console.log('📋 Activity 3: Submitting claim to Pool 1...');
        try {
            const claim = await makeContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'submit-claim',
                functionArgs: [
                    uintCV(1),
                    uintCV(800000), // 0.8 sBTC
                    stringUtf8CV('DeFi protocol exploit - requesting insurance payout for lost funds')
                ],
                senderKey: privateKey,
                network: NETWORK,
                anchorMode: AnchorMode.Any,
            });

            const claimRes = await broadcastTransaction(claim, NETWORK);

            if (claimRes.error) {
                console.error(`   ❌ Failed: ${claimRes.error}`);
            } else {
                console.log(`   ✅ Success! TX: ${claimRes.txid}`);
                console.log(`   🔍 https://explorer.stacks.co/txid/${claimRes.txid}?chain=mainnet\n`);
                successCount++;
                await sleep(3000);
            }
        } catch (e) {
            console.error(`   ❌ Error: ${e.message}\n`);
        }

        // Activity 4: Vote on claim
        console.log('🗳️  Activity 4: Voting to approve claim...');
        try {
            const vote = await makeContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'vote',
                functionArgs: [uintCV(0), trueCV()], // Approve claim 0
                senderKey: privateKey,
                network: NETWORK,
                anchorMode: AnchorMode.Any,
            });

            const voteRes = await broadcastTransaction(vote, NETWORK);

            if (voteRes.error) {
                console.error(`   ❌ Failed: ${voteRes.error}`);
            } else {
                console.log(`   ✅ Success! TX: ${voteRes.txid}`);
                console.log(`   🔍 https://explorer.stacks.co/txid/${voteRes.txid}?chain=mainnet\n`);
                successCount++;
                await sleep(3000);
            }
        } catch (e) {
            console.error(`   ❌ Error: ${e.message}\n`);
        }

        // Activity 5: Create one more pool
        console.log('📦 Activity 5: Creating third insurance pool...');
        try {
            const pool3 = await makeContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'create-pool',
                functionArgs: [
                    stringAsciiCV('Wallet Security Insurance'),
                    uintCV(200000),    // 0.2 sBTC min
                    uintCV(2000000)    // 2 sBTC max
                ],
                senderKey: privateKey,
                network: NETWORK,
                anchorMode: AnchorMode.Any,
            });

            const pool3Res = await broadcastTransaction(pool3, NETWORK);

            if (pool3Res.error) {
                console.error(`   ❌ Failed: ${pool3Res.error}`);
            } else {
                console.log(`   ✅ Success! TX: ${pool3Res.txid}`);
                console.log(`   🔍 https://explorer.stacks.co/txid/${pool3Res.txid}?chain=mainnet\n`);
                successCount++;
            }
        } catch (e) {
            console.error(`   ❌ Error: ${e.message}\n`);
        }

        console.log('='.repeat(70));
        console.log(`\n✅ Activity complete! ${successCount} transactions broadcast.`);
        console.log('\n⏳ Wait 10-15 minutes for all confirmations.');
        console.log(`🔍 Contract: https://explorer.stacks.co/txid/${CONTRACT_ADDRESS}.${CONTRACT_NAME}?chain=mainnet\n`);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

generateMoreActivity();
