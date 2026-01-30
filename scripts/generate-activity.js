#!/usr/bin/env node

/**
 * SatGuard Protocol - On-Chain Activity Generator
 * 
 * This script creates multiple transactions to generate on-chain activity:
 * 1. Create insurance pools
 * 2. Contribute to pools
 * 3. Submit claims
 * 4. Vote on claims
 */

import { makeContractCall, broadcastTransaction, AnchorMode, uintCV, stringAsciiCV, stringUtf8CV, trueCV, falseCV } from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';
import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';
import * as fs from 'fs';
import * as path from 'path';
import toml from 'toml';

const NETWORK = new StacksTestnet();
const CONTRACT_NAME = 'insurance-pool';

// Helper to wait between transactions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

console.log('='.repeat(60));
console.log('SatGuard Protocol - On-Chain Activity Generator');
console.log('='.repeat(60));

async function generateActivity() {
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

        // Get contract address from command line or prompt
        let contractInput = process.argv[2];
        if (!contractInput) {
            console.error('\n❌ Error: Please provide your contract address');
            console.log('\nUsage: npm run activity YOUR_CONTRACT_ADDRESS');
            console.log('Example: npm run activity ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
            process.exit(1);
        }

        // Parse contract address (handle both "ADDRESS" and "ADDRESS.contract-name" formats)
        const contractAddress = contractInput.includes('.') ? contractInput.split('.')[0] : contractInput;

        // Generate wallet
        const wallet = await generateWallet({
            secretKey: mnemonic,
            password: '',
        });

        const account = wallet.accounts[0];
        const privateKey = account.stxPrivateKey;
        const address = getStxAddress({ account, transactionVersion: 0x80 });

        console.log(`\n📍 Your Address: ${address}`);
        console.log(`📍 Contract: ${contractAddress}.${CONTRACT_NAME}`);
        console.log('\n🚀 Starting on-chain activity generation...\n');

        // Transaction 1: Create Pool #1
        console.log('1️⃣  Creating Pool #1: Exchange Hack Protection...');
        const pool1Tx = await makeContractCall({
            contractAddress,
            contractName: CONTRACT_NAME,
            functionName: 'create-pool',
            functionArgs: [
                stringAsciiCV('Exchange Hack Protection'),
                uintCV(100000), // 0.1 sBTC minimum
                uintCV(1000000), // 1.0 sBTC max coverage
            ],
            senderKey: privateKey,
            network: NETWORK,
            anchorMode: AnchorMode.Any,
        });

        const pool1Response = await broadcastTransaction(pool1Tx, NETWORK);
        if (pool1Response.error) {
            console.error('   ❌ Failed:', pool1Response.error);
            if (pool1Response.reason) {
                console.error('   📝 Reason:', pool1Response.reason);
            }
            if (pool1Response.reason_data) {
                console.error('   📊 Details:', JSON.stringify(pool1Response.reason_data, null, 2));
            }
        } else {
            console.log(`   ✅ Success! TX: ${pool1Response.txid}`);
            console.log(`   🔍 https://explorer.stacks.co/txid/${pool1Response.txid}?chain=testnet\n`);
        }

        await sleep(2000); // Wait 2 seconds between transactions

        // Transaction 2: Create Pool #2
        console.log('2️⃣  Creating Pool #2: Rug Pull Protection...');
        const pool2Tx = await makeContractCall({
            contractAddress,
            contractName: CONTRACT_NAME,
            functionName: 'create-pool',
            functionArgs: [
                stringAsciiCV('Rug Pull Protection'),
                uintCV(200000), // 0.2 sBTC minimum
                uintCV(2000000), // 2.0 sBTC max coverage
            ],
            senderKey: privateKey,
            network: NETWORK,
            anchorMode: AnchorMode.Any,
        });

        const pool2Response = await broadcastTransaction(pool2Tx, NETWORK);
        if (pool2Response.error) {
            console.error('   ❌ Failed:', pool2Response.error);
        } else {
            console.log(`   ✅ Success! TX: ${pool2Response.txid}`);
            console.log(`   🔍 https://explorer.stacks.co/txid/${pool2Response.txid}?chain=testnet\n`);
        }

        await sleep(2000);

        // Transaction 3: Contribute to Pool #1
        console.log('3️⃣  Contributing 0.15 sBTC to Pool #1...');
        const contrib1Tx = await makeContractCall({
            contractAddress,
            contractName: CONTRACT_NAME,
            functionName: 'contribute-to-pool',
            functionArgs: [
                uintCV(0), // Pool ID 0
                uintCV(150000), // 0.15 sBTC
            ],
            senderKey: privateKey,
            network: NETWORK,
            anchorMode: AnchorMode.Any,
        });

        const contrib1Response = await broadcastTransaction(contrib1Tx, NETWORK);
        if (contrib1Response.error) {
            console.error('   ❌ Failed:', contrib1Response.error);
        } else {
            console.log(`   ✅ Success! TX: ${contrib1Response.txid}`);
            console.log(`   🔍 https://explorer.stacks.co/txid/${contrib1Response.txid}?chain=testnet\n`);
        }

        await sleep(2000);

        // Transaction 4: Contribute to Pool #2
        console.log('4️⃣  Contributing 0.25 sBTC to Pool #2...');
        const contrib2Tx = await makeContractCall({
            contractAddress,
            contractName: CONTRACT_NAME,
            functionName: 'contribute-to-pool',
            functionArgs: [
                uintCV(1), // Pool ID 1
                uintCV(250000), // 0.25 sBTC
            ],
            senderKey: privateKey,
            network: NETWORK,
            anchorMode: AnchorMode.Any,
        });

        const contrib2Response = await broadcastTransaction(contrib2Tx, NETWORK);
        if (contrib2Response.error) {
            console.error('   ❌ Failed:', contrib2Response.error);
        } else {
            console.log(`   ✅ Success! TX: ${contrib2Response.txid}`);
            console.log(`   🔍 https://explorer.stacks.co/txid/${contrib2Response.txid}?chain=testnet\n`);
        }

        await sleep(2000);

        // Transaction 5: Submit a claim
        console.log('5️⃣  Submitting claim to Pool #1...');
        const claimTx = await makeContractCall({
            contractAddress,
            contractName: CONTRACT_NAME,
            functionName: 'submit-claim',
            functionArgs: [
                uintCV(0), // Pool ID 0
                uintCV(500000), // 0.5 sBTC claim amount
                stringUtf8CV('Exchange was hacked, lost funds in security breach'),
            ],
            senderKey: privateKey,
            network: NETWORK,
            anchorMode: AnchorMode.Any,
        });

        const claimResponse = await broadcastTransaction(claimTx, NETWORK);
        if (claimResponse.error) {
            console.error('   ❌ Failed:', claimResponse.error);
        } else {
            console.log(`   ✅ Success! TX: ${claimResponse.txid}`);
            console.log(`   🔍 https://explorer.stacks.co/txid/${claimResponse.txid}?chain=testnet\n`);
        }

        await sleep(2000);

        // Transaction 6: Vote on claim (approve)
        console.log('6️⃣  Voting to approve claim #0...');
        const voteTx = await makeContractCall({
            contractAddress,
            contractName: CONTRACT_NAME,
            functionName: 'vote-on-claim',
            functionArgs: [
                uintCV(0), // Claim ID 0
                trueCV(), // Approve
            ],
            senderKey: privateKey,
            network: NETWORK,
            anchorMode: AnchorMode.Any,
        });

        const voteResponse = await broadcastTransaction(voteTx, NETWORK);
        if (voteResponse.error) {
            console.error('   ❌ Failed:', voteResponse.error);
        } else {
            console.log(`   ✅ Success! TX: ${voteResponse.txid}`);
            console.log(`   🔍 https://explorer.stacks.co/txid/${voteResponse.txid}?chain=testnet\n`);
        }

        console.log('='.repeat(60));
        console.log('✅ Activity generation complete!');
        console.log('\n📊 Summary:');
        console.log('   - 2 pools created');
        console.log('   - 2 contributions made');
        console.log('   - 1 claim submitted');
        console.log('   - 1 vote cast');
        console.log('\n⏳ Transactions will confirm in 10-20 minutes.');
        console.log('   Check the explorer links above for status.\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.stack) {
            console.error('\nStack trace:', error.stack);
        }
        process.exit(1);
    }
}

generateActivity();
