#!/usr/bin/env node

/**
 * Check Mainnet Contract State
 * Verifies what pools and data exist in the contract
 */

import { cvToJSON, callReadOnlyFunction, uintCV } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';

const NETWORK = new StacksMainnet();
const CONTRACT_ADDRESS = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
const CONTRACT_NAME = 'insurance-pool';

console.log('='.repeat(70));
console.log('Checking Mainnet Contract State');
console.log('='.repeat(70));
console.log(`\nContract: ${CONTRACT_ADDRESS}.${CONTRACT_NAME}\n`);

async function checkState() {
    try {
        // Check pool count
        console.log('📊 Checking pool count...');
        const poolCountResult = await callReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'get-pool-count',
            functionArgs: [],
            network: NETWORK,
            senderAddress: CONTRACT_ADDRESS,
        });

        const poolCount = cvToJSON(poolCountResult).value;
        console.log(`   Pool count: ${poolCount}\n`);

        // Check each pool
        if (poolCount > 0) {
            console.log('📦 Checking pools:\n');
            for (let i = 0; i < poolCount; i++) {
                const poolResult = await callReadOnlyFunction({
                    contractAddress: CONTRACT_ADDRESS,
                    contractName: CONTRACT_NAME,
                    functionName: 'get-pool',
                    functionArgs: [uintCV(i)],
                    network: NETWORK,
                    senderAddress: CONTRACT_ADDRESS,
                });

                const pool = cvToJSON(poolResult).value;
                if (pool) {
                    console.log(`   Pool ${i}:`);
                    console.log(`     Creator: ${pool.cr.value}`);
                    console.log(`     Type: ${pool.ct.value}`);
                    console.log(`     Total Funds: ${pool.tf.value}`);
                    console.log(`     Min Contribution: ${pool.mc.value}`);
                    console.log(`     Max Coverage: ${pool.mx.value}`);
                    console.log(`     Status: ${pool.st.value === '1' ? 'Active' : 'Closed'}`);
                    console.log(`     Contributors: ${pool.cc.value}\n`);
                }
            }
        } else {
            console.log('   ⚠️  No pools exist yet!\n');
        }

        // Check claim count
        console.log('📋 Checking claim count...');
        const claimCountResult = await callReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'get-claim-count',
            functionArgs: [],
            network: NETWORK,
            senderAddress: CONTRACT_ADDRESS,
        });

        const claimCount = cvToJSON(claimCountResult).value;
        console.log(`   Claim count: ${claimCount}\n`);

        console.log('='.repeat(70));
        console.log('✅ State check complete!\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkState();
