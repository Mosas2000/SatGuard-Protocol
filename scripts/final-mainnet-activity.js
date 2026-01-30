#!/usr/bin/env node

/**
 * Final Mainnet Activity - After Pool Confirmation
 * Creates activity only after verifying pool exists
 */

import { makeContractCall, broadcastTransaction, AnchorMode, uintCV, stringUtf8CV, trueCV, cvToJSON, callReadOnlyFunction, principalCV } from '@stacks/transactions';
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
console.log('Final Mainnet Activity Generator');
console.log('='.repeat(70));

async function generateFinalActivity() {
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

        // Verify pool exists
        console.log('🔍 Verifying pool exists...');
        const poolResult = await callReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'get-pool',
            functionArgs: [uintCV(0)],
            network: NETWORK,
            senderAddress: address,
        });

        const pool = cvToJSON(poolResult);
        if (!pool.value) {
            console.error('\n❌ Pool 0 does not exist yet!');
            console.log('   Please wait for pool creation to confirm first.');
            console.log('   Check: https://explorer.stacks.co/txid/c4b007a2ed3bde172f05663f2886309dbf12120c7070efebc77563e8a661ea18?chain=mainnet\n');
            process.exit(1);
        }

        console.log('✅ Pool 0 confirmed!\n');

        let successCount = 0;

        // Step 1: Contribute
        console.log('💰 Step 1: Contributing 0.6 sBTC to pool...');
        try {
            const contribute = await makeContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'contribute',
                functionArgs: [uintCV(0), uintCV(600000)],
                senderKey: privateKey,
                network: NETWORK,
                anchorMode: AnchorMode.Any,
            });

            const contribRes = await broadcastTransaction(contribute, NETWORK);

            if (contribRes.error) {
                console.error(`   ❌ Failed: ${contribRes.error}`);
            } else {
                console.log(`   ✅ Success! TX: ${contribRes.txid}`);
                console.log(`   🔍 https://explorer.stacks.co/txid/${contribRes.txid}?chain=mainnet\n`);
                successCount++;
                await sleep(5000);
            }
        } catch (e) {
            console.error(`   ❌ Error: ${e.message}\n`);
        }

        // Step 2: Submit Claim
        console.log('📋 Step 2: Submitting claim...');
        try {
            const claim = await makeContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'submit-claim',
                functionArgs: [
                    uintCV(0),
                    uintCV(500000),
                    stringUtf8CV('Test claim for mainnet verification')
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
                await sleep(5000);
            }
        } catch (e) {
            console.error(`   ❌ Error: ${e.message}\n`);
        }

        // Step 3: Vote
        console.log('🗳️  Step 3: Voting on claim...');
        try {
            const vote = await makeContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'vote',
                functionArgs: [uintCV(0), trueCV()],
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
            }
        } catch (e) {
            console.error(`   ❌ Error: ${e.message}\n`);
        }

        console.log('='.repeat(70));
        console.log(`\n✅ Activity complete! ${successCount} transactions broadcast.`);
        console.log('\n⏳ Wait 10-15 minutes for confirmations.');
        console.log(`🔍 Contract: https://explorer.stacks.co/txid/${CONTRACT_ADDRESS}.${CONTRACT_NAME}?chain=mainnet\n`);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

generateFinalActivity();
