#!/usr/bin/env node

/**
 * SatGuard Protocol - Careful Mainnet Activity Generator
 * 
 * ⚠️ WARNING: Uses REAL STX on MAINNET!
 * 
 * This script carefully generates on-chain activity with:
 * - Sequential transaction execution
 * - Confirmation waiting between steps
 * - Error handling and validation
 * - Cost tracking
 */

import { makeContractCall, broadcastTransaction, AnchorMode, uintCV, stringAsciiCV, stringUtf8CV, trueCV, cvToJSON, callReadOnlyFunction } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';
import * as fs from 'fs';
import * as path from 'path';
import toml from 'toml';

const NETWORK = new StacksMainnet();
const CONTRACT_NAME = 'insurance-pool';
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

console.log('='.repeat(70));
console.log('⚠️  SatGuard - Careful Mainnet Activity Generator ⚠️');
console.log('='.repeat(70));

async function waitForConfirmation(txid, description) {
    console.log(`\n⏳ Waiting for "${description}" to confirm...`);
    console.log(`   TX: ${txid.substring(0, 16)}...`);
    console.log(`   Explorer: https://explorer.stacks.co/txid/${txid}?chain=mainnet`);
    console.log(`   Waiting 3 minutes for confirmation...\n`);

    // Wait 3 minutes for transaction to confirm
    await sleep(180000); // 3 minutes
}

async function checkPoolExists(contractAddress, poolId) {
    try {
        const result = await callReadOnlyFunction({
            contractAddress,
            contractName: CONTRACT_NAME,
            functionName: 'get-pool',
            functionArgs: [uintCV(poolId)],
            network: NETWORK,
            senderAddress: contractAddress,
        });

        const jsonResult = cvToJSON(result);
        return jsonResult.value !== null;
    } catch (e) {
        return false;
    }
}

async function generateCarefulActivity() {
    try {
        console.log('\n⚠️  WARNING: THIS USES REAL STX ON MAINNET! ⚠️\n');
        console.log('This script will carefully create transactions with confirmation waits:');
        console.log('  1. Create insurance pool (~0.01 STX)');
        console.log('  2. Wait for confirmation (3 min)');
        console.log('  3. Contribute to pool (~0.01 STX)');
        console.log('  4. Wait for confirmation (3 min)');
        console.log('  5. Submit claim (~0.01 STX)');
        console.log('  6. Wait for confirmation (3 min)');
        console.log('  7. Vote on claim (~0.01 STX)\n');
        console.log('Total cost: ~0.04 STX (~$0.04 USD)');
        console.log('Total time: ~12-15 minutes\n');

        // Read configuration
        const configPath = path.join(process.cwd(), '..', 'settings', 'Mainnet.toml');
        const configFile = fs.readFileSync(configPath, 'utf8');
        const config = toml.parse(configFile);

        const mnemonic = config.accounts?.deployer?.mnemonic;
        if (!mnemonic || mnemonic === 'YOUR_MAINNET_MNEMONIC_HERE') {
            console.error('❌ Error: Please set your mainnet mnemonic in settings/Mainnet.toml');
            process.exit(1);
        }

        let contractInput = process.argv[2];
        if (!contractInput) {
            console.error('❌ Error: Please provide your contract address');
            console.log('\nUsage: npm run careful-mainnet SP_YOUR_CONTRACT_ADDRESS');
            process.exit(1);
        }

        const contractAddress = contractInput.includes('.') ? contractInput.split('.')[0] : contractInput;

        const wallet = await generateWallet({ secretKey: mnemonic, password: '' });
        const account = wallet.accounts[0];
        const privateKey = account.stxPrivateKey;
        const address = getStxAddress({ account, transactionVersion: 0x16 }); // mainnet

        console.log(`📍 Your Address: ${address}`);
        console.log(`📍 Contract: ${contractAddress}.${CONTRACT_NAME}`);
        console.log(`📍 Network: MAINNET\n`);
        console.log('🚀 Starting careful activity generation...\n');
        console.log('='.repeat(70));

        let totalCost = 0;
        let successCount = 0;

        // Step 1: Create Pool
        console.log('\n📦 STEP 1: Creating Insurance Pool');
        console.log('   Pool: "DeFi Security Insurance"');
        console.log('   Min Contribution: 0.5 sBTC');
        console.log('   Max Coverage: 5 sBTC\n');

        try {
            const pool1 = await makeContractCall({
                contractAddress,
                contractName: CONTRACT_NAME,
                functionName: 'create-pool',
                functionArgs: [
                    stringAsciiCV('DeFi Security Insurance'),
                    uintCV(500000),    // 0.5 sBTC min
                    uintCV(5000000)    // 5 sBTC max
                ],
                senderKey: privateKey,
                network: NETWORK,
                anchorMode: AnchorMode.Any,
            });

            const pool1Res = await broadcastTransaction(pool1, NETWORK);

            if (pool1Res.error) {
                console.error(`   ❌ Failed: ${pool1Res.error}`);
                if (pool1Res.reason) console.error(`   Reason: ${pool1Res.reason}`);
                process.exit(1);
            }

            console.log(`   ✅ Success! Pool creation broadcast`);
            console.log(`   TX: ${pool1Res.txid}`);
            successCount++;
            totalCost += 0.01;

            await waitForConfirmation(pool1Res.txid, 'Pool Creation');

        } catch (error) {
            console.error(`   ❌ Error: ${error.message}`);
            process.exit(1);
        }

        // Step 2: Contribute to Pool
        console.log('='.repeat(70));
        console.log('\n💰 STEP 2: Contributing to Pool');
        console.log('   Pool ID: 0');
        console.log('   Amount: 0.6 sBTC\n');

        try {
            const contrib = await makeContractCall({
                contractAddress,
                contractName: CONTRACT_NAME,
                functionName: 'contribute',
                functionArgs: [
                    uintCV(0),         // pool-id
                    uintCV(600000)     // 0.6 sBTC
                ],
                senderKey: privateKey,
                network: NETWORK,
                anchorMode: AnchorMode.Any,
            });

            const contribRes = await broadcastTransaction(contrib, NETWORK);

            if (contribRes.error) {
                console.error(`   ❌ Failed: ${contribRes.error}`);
                if (contribRes.reason) console.error(`   Reason: ${contribRes.reason}`);
                console.log('\n⚠️  Continuing to next step...\n');
            } else {
                console.log(`   ✅ Success! Contribution broadcast`);
                console.log(`   TX: ${contribRes.txid}`);
                successCount++;
                totalCost += 0.01;

                await waitForConfirmation(contribRes.txid, 'Contribution');
            }

        } catch (error) {
            console.error(`   ❌ Error: ${error.message}`);
            console.log('\n⚠️  Continuing to next step...\n');
        }

        // Step 3: Submit Claim
        console.log('='.repeat(70));
        console.log('\n📋 STEP 3: Submitting Claim');
        console.log('   Pool ID: 0');
        console.log('   Amount: 1 sBTC');
        console.log('   Reason: "Smart contract exploit on DeFi protocol"\n');

        try {
            const claim = await makeContractCall({
                contractAddress,
                contractName: CONTRACT_NAME,
                functionName: 'submit-claim',
                functionArgs: [
                    uintCV(0),         // pool-id
                    uintCV(1000000),   // 1 sBTC
                    stringUtf8CV('Smart contract exploit on DeFi protocol resulted in loss of funds')
                ],
                senderKey: privateKey,
                network: NETWORK,
                anchorMode: AnchorMode.Any,
            });

            const claimRes = await broadcastTransaction(claim, NETWORK);

            if (claimRes.error) {
                console.error(`   ❌ Failed: ${claimRes.error}`);
                if (claimRes.reason) console.error(`   Reason: ${claimRes.reason}`);
                console.log('\n⚠️  Continuing to next step...\n');
            } else {
                console.log(`   ✅ Success! Claim broadcast`);
                console.log(`   TX: ${claimRes.txid}`);
                successCount++;
                totalCost += 0.01;

                await waitForConfirmation(claimRes.txid, 'Claim Submission');
            }

        } catch (error) {
            console.error(`   ❌ Error: ${error.message}`);
            console.log('\n⚠️  Continuing to next step...\n');
        }

        // Step 4: Vote on Claim
        console.log('='.repeat(70));
        console.log('\n🗳️  STEP 4: Voting on Claim');
        console.log('   Claim ID: 0');
        console.log('   Vote: APPROVE\n');

        try {
            const vote = await makeContractCall({
                contractAddress,
                contractName: CONTRACT_NAME,
                functionName: 'vote',
                functionArgs: [
                    uintCV(0),         // claim-id
                    trueCV()           // approve
                ],
                senderKey: privateKey,
                network: NETWORK,
                anchorMode: AnchorMode.Any,
            });

            const voteRes = await broadcastTransaction(vote, NETWORK);

            if (voteRes.error) {
                console.error(`   ❌ Failed: ${voteRes.error}`);
                if (voteRes.reason) console.error(`   Reason: ${voteRes.reason}`);
            } else {
                console.log(`   ✅ Success! Vote broadcast`);
                console.log(`   TX: ${voteRes.txid}`);
                successCount++;
                totalCost += 0.01;

                console.log(`\n⏳ Final transaction confirming...`);
                console.log(`   Check: https://explorer.stacks.co/txid/${voteRes.txid}?chain=mainnet\n`);
            }

        } catch (error) {
            console.error(`   ❌ Error: ${error.message}`);
        }

        // Summary
        console.log('='.repeat(70));
        console.log('\n✅ Activity generation complete!\n');
        console.log(`📊 Summary:`);
        console.log(`   - ${successCount} transactions successful`);
        console.log(`   - ~${totalCost.toFixed(2)} STX spent`);
        console.log(`   - All transactions on MAINNET`);
        console.log('\n⏳ Wait 10-15 minutes for all confirmations.');
        console.log('   Then check your contract on the explorer!\n');
        console.log(`🔍 Contract: https://explorer.stacks.co/txid/${contractAddress}.${CONTRACT_NAME}?chain=mainnet\n`);

    } catch (error) {
        console.error('\n❌ Fatal error:', error.message);
        process.exit(1);
    }
}

generateCarefulActivity();
