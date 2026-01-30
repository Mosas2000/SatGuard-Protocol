#!/usr/bin/env node

/**
 * SatGuard Protocol - Mainnet Activity Generator
 * 
 * ⚠️ WARNING: This uses REAL STX on MAINNET!
 * 
 * Creates on-chain activity on mainnet (costs real money)
 */

import { makeContractCall, broadcastTransaction, AnchorMode, uintCV, stringAsciiCV, stringUtf8CV, trueCV } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';
import * as fs from 'fs';
import * as path from 'path';
import toml from 'toml';

const NETWORK = new StacksMainnet();
const CONTRACT_NAME = 'insurance-pool';
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

console.log('='.repeat(70));
console.log('⚠️  SatGuard Protocol - MAINNET Activity Generator ⚠️');
console.log('='.repeat(70));

async function generateMainnetActivity() {
    try {
        console.log('\n⚠️  WARNING: THIS USES REAL STX ON MAINNET! ⚠️\n');
        console.log('Each transaction costs real money (~0.001-0.01 STX each)');
        console.log('This script will create 3 transactions:\n');
        console.log('  1. Create one insurance pool');
        console.log('  2. Contribute to the pool');
        console.log('  3. Submit a test claim\n');

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
            console.log('\nUsage: npm run mainnet-activity YOUR_MAINNET_CONTRACT_ADDRESS');
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
        console.log('🚀 Generating mainnet activity...\n');

        let txCount = 0;

        // Create one pool
        console.log('1️⃣  Creating Insurance Pool...');
        const pool1 = await makeContractCall({
            contractAddress, contractName: CONTRACT_NAME, functionName: 'create-pool',
            functionArgs: [stringAsciiCV('Production Insurance Pool'), uintCV(500000), uintCV(5000000)],
            senderKey: privateKey, network: NETWORK, anchorMode: AnchorMode.Any,
        });
        const pool1Res = await broadcastTransaction(pool1, NETWORK);
        if (!pool1Res.error) {
            console.log(`   ✅ Success! TX: ${pool1Res.txid}`);
            console.log(`   🔍 https://explorer.stacks.co/txid/${pool1Res.txid}?chain=mainnet\n`);
            txCount++;
        } else {
            console.error(`   ❌ Failed:`, pool1Res.error);
        }
        await sleep(3000);

        // Contribute
        console.log('2️⃣  Contributing to Pool...');
        const contrib = await makeContractCall({
            contractAddress, contractName: CONTRACT_NAME, functionName: 'contribute-to-pool',
            functionArgs: [uintCV(0), uintCV(600000)],
            senderKey: privateKey, network: NETWORK, anchorMode: AnchorMode.Any,
        });
        const contribRes = await broadcastTransaction(contrib, NETWORK);
        if (!contribRes.error) {
            console.log(`   ✅ Success! TX: ${contribRes.txid}`);
            console.log(`   🔍 https://explorer.stacks.co/txid/${contribRes.txid}?chain=mainnet\n`);
            txCount++;
        } else {
            console.error(`   ❌ Failed:`, contribRes.error);
        }
        await sleep(3000);

        // Submit claim
        console.log('3️⃣  Submitting Test Claim...');
        const claim = await makeContractCall({
            contractAddress, contractName: CONTRACT_NAME, functionName: 'submit-claim',
            functionArgs: [uintCV(0), uintCV(1000000), stringUtf8CV('Test claim for production verification')],
            senderKey: privateKey, network: NETWORK, anchorMode: AnchorMode.Any,
        });
        const claimRes = await broadcastTransaction(claim, NETWORK);
        if (!claimRes.error) {
            console.log(`   ✅ Success! TX: ${claimRes.txid}`);
            console.log(`   🔍 https://explorer.stacks.co/txid/${claimRes.txid}?chain=mainnet\n`);
            txCount++;
        } else {
            console.error(`   ❌ Failed:`, claimRes.error);
        }

        console.log('='.repeat(70));
        console.log(`✅ Mainnet activity complete! ${txCount} transactions broadcast.`);
        console.log('\n⏳ Transactions will confirm in 10-20 minutes.');
        console.log('   Check the explorer links above for status.\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

generateMainnetActivity();
