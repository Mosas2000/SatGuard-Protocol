#!/usr/bin/env node

/**
 * SatGuard Protocol - Mainnet Deployment Script
 * 
 * ⚠️ WARNING: This deploys to MAINNET using REAL STX tokens!
 * 
 * This script deploys the insurance-pool contract to Stacks mainnet.
 * It reads the mnemonic from settings/Mainnet.toml
 */

import { makeContractDeploy, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';
import * as fs from 'fs';
import * as path from 'path';
import toml from 'toml';
import * as readline from 'readline';

// Configuration
const NETWORK = new StacksMainnet();
const CONTRACT_NAME = 'insurance-pool';

console.log('='.repeat(70));
console.log('⚠️  SatGuard Protocol - MAINNET Deployment ⚠️');
console.log('='.repeat(70));

async function askConfirmation(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
        });
    });
}

async function deployContract() {
    try {
        console.log('\n⚠️  WARNING: MAINNET DEPLOYMENT USES REAL MONEY! ⚠️\n');
        console.log('This deployment will:');
        console.log('  • Use REAL STX tokens (not test tokens)');
        console.log('  • Cost approximately 0.5-1.5 STX (~$0.50-$1.50 USD)');
        console.log('  • Be IRREVERSIBLE once broadcast');
        console.log('  • Deploy to production mainnet\n');

        // Read Mainnet.toml configuration
        const configPath = path.join(process.cwd(), '..', 'settings', 'Mainnet.toml');

        if (!fs.existsSync(configPath)) {
            console.error('❌ Error: settings/Mainnet.toml not found');
            console.log('\nPlease create settings/Mainnet.toml with your MAINNET mnemonic.');
            process.exit(1);
        }

        const configFile = fs.readFileSync(configPath, 'utf8');
        const config = toml.parse(configFile);

        // Get mnemonic from config
        const mnemonic = config.accounts?.deployer?.mnemonic;

        if (!mnemonic || mnemonic === 'YOUR_MAINNET_MNEMONIC_HERE') {
            console.error('❌ Error: Please set your MAINNET mnemonic in settings/Mainnet.toml');
            console.log('\nEdit settings/Mainnet.toml and replace:');
            console.log('  mnemonic = "YOUR_MAINNET_MNEMONIC_HERE"');
            console.log('with your actual 24-word MAINNET mnemonic phrase.');
            console.log('\n⚠️  IMPORTANT: Use MAINNET mnemonic (SP... address), not testnet!');
            process.exit(1);
        }

        // Generate wallet from mnemonic
        console.log('🔑 Deriving private key from mnemonic...');
        const wallet = await generateWallet({
            secretKey: mnemonic,
            password: '',
        });

        const account = wallet.accounts[0];
        const privateKey = account.stxPrivateKey;
        const address = getStxAddress({ account, transactionVersion: 0x16 }); // 0x16 for mainnet

        console.log(`\n📍 Deployer Address: ${address}`);
        console.log(`📍 Network: MAINNET (production)`);
        console.log(`📍 Contract will be: ${address}.${CONTRACT_NAME}`);

        // Read contract source
        const contractPath = path.join(process.cwd(), '..', 'contracts', `${CONTRACT_NAME}.clar`);
        const codeBody = fs.readFileSync(contractPath, 'utf8');

        console.log(`\n📄 Contract: ${CONTRACT_NAME}`);
        console.log(`📏 Contract size: ${codeBody.length} bytes`);
        console.log(`💰 Estimated cost: 0.5-1.5 STX`);

        // Final confirmation
        console.log('\n' + '='.repeat(70));
        console.log('⚠️  FINAL CONFIRMATION REQUIRED ⚠️');
        console.log('='.repeat(70));
        console.log('\nBefore proceeding, confirm:');
        console.log('  ✓ You have 1-2 STX in your mainnet wallet');
        console.log('  ✓ Your address above is correct (starts with SP)');
        console.log('  ✓ You understand this uses REAL money');
        console.log('  ✓ You have tested thoroughly on testnet');
        console.log('  ✓ You are ready to deploy to production\n');

        const confirmed = await askConfirmation('Type "yes" to deploy to MAINNET with REAL STX: ');

        if (!confirmed) {
            console.log('\n❌ Deployment cancelled by user.');
            console.log('   No charges incurred.\n');
            process.exit(0);
        }

        console.log('\n🚀 Deploying contract to MAINNET...\n');

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
            if (broadcastResponse.reason_data) {
                console.error('Details:', JSON.stringify(broadcastResponse.reason_data, null, 2));
            }
            process.exit(1);
        }

        console.log('✅ Transaction broadcast successful!');
        console.log(`\n📋 Transaction ID: ${broadcastResponse.txid}`);
        console.log(`📍 Contract Address: ${address}.${CONTRACT_NAME}`);
        console.log(`\n🔍 View on MAINNET explorer:`);
        console.log(`   https://explorer.stacks.co/txid/${broadcastResponse.txid}?chain=mainnet`);
        console.log('\n⏳ Waiting for confirmation (this may take 10-20 minutes)...');
        console.log('   Check the explorer link above for status updates.');
        console.log('\n' + '='.repeat(70));
        console.log('✅ MAINNET deployment initiated successfully!');
        console.log(`\n📝 SAVE THIS CONTRACT ADDRESS: ${address}.${CONTRACT_NAME}`);
        console.log('   You\'ll need it to interact with your contract.');
        console.log('\n💡 Next steps:');
        console.log('   1. Wait for transaction confirmation (~10-20 min)');
        console.log('   2. Verify contract on mainnet explorer');
        console.log('   3. Update frontend to use mainnet contract address');
        console.log('   4. Test contract functions on mainnet\n');

    } catch (error) {
        console.error('\n❌ Deployment error:', error.message);
        if (error.stack) {
            console.error('\nStack trace:', error.stack);
        }
        process.exit(1);
    }
}

deployContract();
