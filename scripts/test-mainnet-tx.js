#!/usr/bin/env node

/**
 * Simple Mainnet Transaction Test
 * Tests one transaction at a time to identify issues
 */

import { makeContractCall, broadcastTransaction, AnchorMode, uintCV, stringAsciiCV, stringUtf8CV, trueCV, cvToJSON, callReadOnlyFunction, principalCV } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';
import * as fs from 'fs';
import * as path from 'path';
import toml from 'toml';

const NETWORK = new StacksMainnet();
const CONTRACT_ADDRESS = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
const CONTRACT_NAME = 'insurance-pool';

console.log('='.repeat(70));
console.log('Simple Mainnet Transaction Test');
console.log('='.repeat(70));

async function testTransaction() {
    try {
        // Read configuration
        const configPath = path.join(process.cwd(), '..', 'settings', 'Mainnet.toml');
        const configFile = fs.readFileSync(configPath, 'utf8');
        const config = toml.parse(configFile);

        const mnemonic = config.accounts?.deployer?.mnemonic;
        const wallet = await generateWallet({ secretKey: mnemonic, password: '' });
        const account = wallet.accounts[0];
        const privateKey = account.stxPrivateKey;
        const address = getStxAddress({ account, transactionVersion: 0x16 });

        console.log(`\n📍 Your Address: ${address}`);
        console.log(`📍 Contract: ${CONTRACT_ADDRESS}.${CONTRACT_NAME}\n`);

        // Check pool 0
        console.log('🔍 Checking Pool 0...');
        const poolResult = await callReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'get-pool',
            functionArgs: [uintCV(0)],
            network: NETWORK,
            senderAddress: address,
        });

        const pool = cvToJSON(poolResult);
        console.log('Pool 0 data:', JSON.stringify(pool, null, 2));

        if (!pool.value) {
            console.log('\n❌ Pool 0 does not exist!');
            console.log('   Creating pool first...\n');

            const createPool = await makeContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'create-pool',
                functionArgs: [
                    stringAsciiCV('Test Pool'),
                    uintCV(100000),    // 0.1 sBTC min
                    uintCV(1000000)    // 1 sBTC max
                ],
                senderKey: privateKey,
                network: NETWORK,
                anchorMode: AnchorMode.Any,
            });

            const createRes = await broadcastTransaction(createPool, NETWORK);
            console.log('Create pool result:', createRes);
            return;
        }

        console.log('\n✅ Pool 0 exists!');
        console.log(`   Min contribution: ${pool.value.mc.value}`);
        console.log(`   Max coverage: ${pool.value.mx.value}`);
        console.log(`   Total funds: ${pool.value.tf.value}`);
        console.log(`   Status: ${pool.value.st.value}\n`);

        // Check if we've already contributed
        console.log('🔍 Checking your contribution...');
        const contribResult = await callReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'get-contrib',
            functionArgs: [uintCV(0), principalCV(address)],
            network: NETWORK,
            senderAddress: address,
        });

        const contrib = cvToJSON(contribResult);
        console.log('Your contribution:', JSON.stringify(contrib, null, 2));

        if (!contrib.value) {
            console.log('\n📝 You have not contributed yet.');
            console.log('   Attempting to contribute 0.6 sBTC...\n');

            const contribute = await makeContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'contribute',
                functionArgs: [
                    uintCV(0),
                    uintCV(600000)
                ],
                senderKey: privateKey,
                network: NETWORK,
                anchorMode: AnchorMode.Any,
            });

            const contribRes = await broadcastTransaction(contribute, NETWORK);

            if (contribRes.error) {
                console.error('❌ Contribution failed:', contribRes.error);
                console.error('   Reason:', contribRes.reason);
                if (contribRes.reason_data) {
                    console.error('   Details:', JSON.stringify(contribRes.reason_data, null, 2));
                }
            } else {
                console.log('✅ Contribution broadcast!');
                console.log(`   TX: ${contribRes.txid}`);
                console.log(`   Explorer: https://explorer.stacks.co/txid/${contribRes.txid}?chain=mainnet`);
            }
        } else {
            console.log(`\n✅ You have already contributed: ${contrib.value.a.value} micro-sBTC`);
            console.log('   Skipping contribution step.\n');
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
    }
}

testTransaction();
