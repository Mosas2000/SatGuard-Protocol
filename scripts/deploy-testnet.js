#!/usr/bin/env node

/**
 * SatGuard Protocol - Testnet Deployment Script
 * 
 * This script deploys the insurance-pool contract to Stacks testnet.
 * It reads the mnemonic from settings/Testnet.toml
 */

import { makeContractDeploy, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';
import { generateWallet, generateSecretKey, getStxAddress } from '@stacks/wallet-sdk';
import * as fs from 'fs';
import * as path from 'path';
import toml from 'toml';

// Configuration
const NETWORK = new StacksTestnet();
const CONTRACT_NAME = 'insurance-pool';

console.log('='.repeat(60));
console.log('SatGuard Protocol - Testnet Deployment');
console.log('='.repeat(60));

async function deployContract() {
    try {
        // Read Testnet.toml configuration
        const configPath = path.join(process.cwd(), '..', 'settings', 'Testnet.toml');

        if (!fs.existsSync(configPath)) {
            console.error('\n❌ Error: settings/Testnet.toml not found');
            console.log('\nPlease create settings/Testnet.toml with your testnet mnemonic.');
            process.exit(1);
        }

        const configFile = fs.readFileSync(configPath, 'utf8');
        const config = toml.parse(configFile);

        // Get mnemonic from config
        const mnemonic = config.accounts?.deployer?.mnemonic;

        if (!mnemonic || mnemonic === 'YOUR_TESTNET_MNEMONIC_HERE') {
            console.error('\n❌ Error: Please set your testnet mnemonic in settings/Testnet.toml');
            console.log('\nEdit settings/Testnet.toml and replace:');
            console.log('  mnemonic = "YOUR_TESTNET_MNEMONIC_HERE"');
            console.log('with your actual 24-word testnet mnemonic phrase.');
            console.log('\n💡 Get testnet STX from: https://explorer.stacks.co/sandbox/faucet?chain=testnet');
            process.exit(1);
        }

        // Generate wallet from mnemonic
        console.log('\n🔑 Deriving private key from mnemonic...');
        const wallet = await generateWallet({
            secretKey: mnemonic,
            password: '',
        });

        const account = wallet.accounts[0];
        const privateKey = account.stxPrivateKey;
        const address = getStxAddress({ account, transactionVersion: 0x80 }); // 0x80 for testnet

        console.log(`📍 Deployer Address: ${address}`);
        console.log(`📍 Network: Testnet`);

        // Read contract source
        const contractPath = path.join(process.cwd(), '..', 'contracts', `${CONTRACT_NAME}.clar`);
        const codeBody = fs.readFileSync(contractPath, 'utf8');

        console.log(`📄 Contract: ${CONTRACT_NAME}`);
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
            if (broadcastResponse.reason_data) {
                console.error('Details:', JSON.stringify(broadcastResponse.reason_data, null, 2));
            }
            process.exit(1);
        }

        console.log('✅ Transaction broadcast successful!');
        console.log(`\n📋 Transaction ID: ${broadcastResponse.txid}`);
        console.log(`📍 Contract Address: ${address}.${CONTRACT_NAME}`);
        console.log(`\n🔍 View on explorer:`);
        console.log(`   https://explorer.stacks.co/txid/${broadcastResponse.txid}?chain=testnet`);
        console.log('\n⏳ Waiting for confirmation (this may take 10-20 minutes)...');
        console.log('   Check the explorer link above for status updates.');
        console.log('\n' + '='.repeat(60));
        console.log('\n✅ Deployment initiated successfully!');
        console.log(`\n📝 Save this contract address: ${address}.${CONTRACT_NAME}`);
        console.log('   You\'ll need it to interact with your contract.\n');

    } catch (error) {
        console.error('\n❌ Deployment error:', error.message);
        if (error.stack) {
            console.error('\nStack trace:', error.stack);
        }
        process.exit(1);
    }
}

deployContract();
