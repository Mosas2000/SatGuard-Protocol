#!/usr/bin/env node

/**
 * SatGuard Protocol - Testnet Deployment Script
 * 
 * This script deploys the insurance-pool contract to Stacks testnet.
 */

import { makeContractDeploy, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const NETWORK = new StacksTestnet();
const CONTRACT_NAME = 'insurance-pool';

console.log('='.repeat(60));
console.log('SatGuard Protocol - Testnet Deployment');
console.log('='.repeat(60));

async function deployContract() {
    try {
        // Check for private key
        const privateKey = process.env.STACKS_PRIVATE_KEY;
        if (!privateKey) {
            console.error('\n❌ Error: STACKS_PRIVATE_KEY environment variable not set');
            console.log('\nTo deploy, you need:');
            console.log('1. A Stacks testnet wallet with test STX');
            console.log('2. Export your private key:');
            console.log('   export STACKS_PRIVATE_KEY="your-private-key-here"');
            console.log('\n💡 Get testnet STX from: https://explorer.stacks.co/sandbox/faucet?chain=testnet');
            process.exit(1);
        }

        // Read contract source
        const contractPath = path.join(process.cwd(), 'contracts', `${CONTRACT_NAME}.clar`);
        const codeBody = fs.readFileSync(contractPath, 'utf8');

        console.log(`\n📄 Contract: ${CONTRACT_NAME}`);
        console.log(`📍 Network: Testnet`);
        console.log(`📏 Contract size: ${codeBody.length} bytes`);
        console.log('\n🚀 Deploying contract...\n');

        // Create deployment transaction
        const txOptions = {
            contractName: CONTRACT_NAME,
            codeBody: codeBody,
            senderKey: privateKey,
            network: NETWORK,
            anchorMode: AnchorMode.Any,
        };

        const transaction = await makeContractDeploy(txOptions);

        // Broadcast transaction
        const broadcastResponse = await broadcastTransaction(transaction, NETWORK);

        if (broadcastResponse.error) {
            console.error('❌ Deployment failed:', broadcastResponse.error);
            if (broadcastResponse.reason) {
                console.error('Reason:', broadcastResponse.reason);
            }
            process.exit(1);
        }

        console.log('✅ Transaction broadcast successful!');
        console.log(`\n📋 Transaction ID: ${broadcastResponse.txid}`);
        console.log(`\n🔍 View on explorer:`);
        console.log(`   https://explorer.stacks.co/txid/${broadcastResponse.txid}?chain=testnet`);
        console.log('\n⏳ Waiting for confirmation (this may take a few minutes)...');
        console.log('   Check the explorer link above for status updates.');
        console.log('\n' + '='.repeat(60));

    } catch (error) {
        console.error('\n❌ Deployment error:', error.message);
        process.exit(1);
    }
}

deployContract();
