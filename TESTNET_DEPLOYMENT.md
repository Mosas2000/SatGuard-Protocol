# SatGuard Protocol - Testnet Deployment Guide

## Prerequisites

Before deploying to testnet, ensure you have:

1. **Node.js** v18 or higher installed
2. **Stacks Wallet** (Hiro or Xverse)
3. **Test STX** tokens for deployment fees

## Step 1: Get Testnet STX

1. Install a Stacks wallet (Hiro Wallet recommended)
2. Switch to **Testnet** mode in your wallet
3. Copy your testnet address
4. Visit the faucet: https://explorer.stacks.co/sandbox/faucet?chain=testnet
5. Request test STX (you'll need at least 1 STX for deployment)

## Step 2: Export Your Private Key

⚠️ **IMPORTANT**: Only use testnet private keys. Never share your mainnet private key!

### From Hiro Wallet:
1. Open Hiro Wallet
2. Click Settings → View Secret Key
3. Copy your 24-word seed phrase
4. Use a tool to derive your private key, or use the wallet's export feature

### Set Environment Variable:
```bash
export STACKS_PRIVATE_KEY="your-testnet-private-key-here"
```

## Step 3: Install Dependencies

```bash
cd scripts
npm install
```

## Step 4: Deploy to Testnet

```bash
npm run deploy:testnet
```

## Step 5: Verify Deployment

After deployment, you'll receive a transaction ID. Check the status:

1. Visit: `https://explorer.stacks.co/txid/YOUR_TX_ID?chain=testnet`
2. Wait for confirmation (usually 10-20 minutes)
3. Once confirmed, your contract will be live!

## Step 6: Get Your Contract Address

Your contract will be deployed at:
```
YOUR_ADDRESS.insurance-pool
```

Example: `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.insurance-pool`

## Step 7: Test Your Contract

### Using Clarinet Console:
```bash
clarinet console
```

### Using Stacks Explorer:
1. Go to: https://explorer.stacks.co/sandbox/contract-call?chain=testnet
2. Enter your contract address
3. Test calling functions

## Step 8: Update Frontend Configuration

Update your frontend to point to the testnet contract:

```typescript
// frontend/src/config.ts
export const CONTRACT_ADDRESS = 'YOUR_ADDRESS';
export const CONTRACT_NAME = 'insurance-pool';
export const NETWORK = new StacksTestnet();
```

## Troubleshooting

### "Insufficient balance" error
- Get more test STX from the faucet
- Wait for previous faucet request to confirm

### "Contract already exists" error
- The contract name is already taken by your address
- Change the contract name in `Clarinet.toml` or use a different address

### Transaction pending for too long
- Testnet can be slow during high usage
- Check explorer for status
- Transactions typically confirm within 20 minutes

## Next Steps After Deployment

1. **Test All Functions**: Create pools, contribute, submit claims
2. **Frontend Integration**: Connect your React app to the deployed contract
3. **Community Testing**: Share with beta testers
4. **Document Issues**: Track any bugs or improvements needed
5. **Iterate**: Make fixes and redeploy as needed

## Useful Links

- **Testnet Explorer**: https://explorer.stacks.co/?chain=testnet
- **Testnet Faucet**: https://explorer.stacks.co/sandbox/faucet?chain=testnet
- **Hiro Wallet**: https://wallet.hiro.so/
- **Stacks Documentation**: https://docs.stacks.co/

## Cost Estimate

Deploying to testnet is **FREE** (uses test STX), but for reference:
- Contract deployment: ~0.5-1 STX
- Function calls: ~0.001-0.01 STX each

---

**Ready to deploy? Run:**
```bash
cd scripts
npm install
npm run deploy:testnet
```
