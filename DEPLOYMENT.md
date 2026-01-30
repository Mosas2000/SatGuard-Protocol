# SatGuard Protocol - Complete Deployment Guide

**Bitcoin-backed micro-insurance protocol on Stacks blockchain**

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Testnet Deployment](#testnet-deployment)
3. [Mainnet Deployment](#mainnet-deployment)
4. [Generating Activity](#generating-activity)
5. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites
- Node.js v18+
- Clarinet installed
- Stacks wallet (Hiro or Xverse)

### Installation
```bash
git clone https://github.com/Mosas2000/SatGuard-Protocol.git
cd SatGuard
cd scripts && npm install
```

---

## Testnet Deployment

### Step 1: Get Test STX
1. Install Hiro Wallet: https://wallet.hiro.so/
2. Switch to **Testnet** mode
3. Get free test STX: https://explorer.stacks.co/sandbox/faucet?chain=testnet

### Step 2: Configure
Edit `settings/Testnet.toml`:
```toml
[accounts.deployer]
mnemonic = "your testnet 24-word mnemonic here"
```

### Step 3: Deploy
```bash
cd scripts
npm run deploy:testnet
```

### Step 4: Generate Activity
```bash
npm run activity ST_YOUR_TESTNET_ADDRESS
# Or for more diverse activity:
npm run advanced-activity ST_YOUR_TESTNET_ADDRESS
```

---

## Mainnet Deployment

### ⚠️ Requirements
- **1-2 STX** in mainnet wallet (~$1-2 USD)
- **Mainnet mnemonic** (SP... address)
- **Testnet testing completed**

### Step 1: Configure Mainnet
Edit `settings/Mainnet.toml`:
```toml
[accounts.deployer]
mnemonic = "your MAINNET 24-word mnemonic here"
```

⚠️ **Use MAINNET mnemonic (SP address), not testnet!**

### Step 2: Deploy to Mainnet
```bash
cd scripts
npm run deploy:mainnet
```

**Costs**: ~0.5-1.5 STX (~$0.50-$1.50 USD)

The script will ask for confirmation before deploying.

### Step 3: Verify Deployment
Check transaction on mainnet explorer:
```
https://explorer.stacks.co/txid/YOUR_TX_ID?chain=mainnet
```

Wait 10-20 minutes for confirmation.

### Step 4: Generate Mainnet Activity (Optional)
```bash
npm run mainnet-activity SP_YOUR_CONTRACT_ADDRESS
```

**Costs**: ~0.03 STX for 3 transactions

---

## Generating Activity

### Basic Activity (6 transactions)
```bash
npm run activity YOUR_CONTRACT_ADDRESS
```
Creates:
- 2 insurance pools
- 2 contributions
- 1 claim
- 1 vote

### Advanced Activity (15+ transactions)
```bash
npm run advanced-activity YOUR_CONTRACT_ADDRESS
```
Creates:
- 3 diverse insurance pools (DeFi, NFT, Wallet)
- 6 varied contributions
- 3 detailed claims
- 3 votes (2 approve, 1 reject)

---

## Troubleshooting

### "Transaction rejected"
- **Testnet**: Get more test STX from faucet
- **Mainnet**: Add more STX to wallet
- Wait for previous transactions to confirm

### "Contract not found"
- Verify contract address is correct
- Ensure deployment confirmed (check explorer)
- Use correct network (ST for testnet, SP for mainnet)

### "Insufficient balance"
- **Testnet**: Visit faucet for free test STX
- **Mainnet**: Purchase STX from exchange

### "Error u101" in transactions
- Pool/claim doesn't exist yet
- Wait for pool creation to confirm
- Run activity script again after confirmation

### Mixing testnet/mainnet addresses
- **Testnet addresses**: Start with **ST**
- **Mainnet addresses**: Start with **SP**
- Don't mix networks!

---

## Cost Summary

### Testnet (FREE)
All operations use free test STX

### Mainnet (REAL STX)
| Action | Cost (STX) | Cost (USD)* |
|--------|-----------|-------------|
| Deploy contract | 0.5-1.5 | $0.50-$1.50 |
| Create pool | ~0.01 | ~$0.01 |
| Contribute | ~0.01 | ~$0.01 |
| Submit claim | ~0.01 | ~$0.01 |
| Vote | ~0.01 | ~$0.01 |

*Approximate, varies with STX price

---

## Available Scripts

```bash
npm run deploy:testnet      # Deploy to testnet
npm run deploy:mainnet      # Deploy to mainnet (REAL STX)
npm run activity            # Generate basic activity
npm run advanced-activity   # Generate diverse activity
npm run mainnet-activity    # Generate mainnet activity (REAL STX)
npm run check              # Check wallet balance and contract status
```

---

## Important Links

- **Testnet Explorer**: https://explorer.stacks.co/?chain=testnet
- **Mainnet Explorer**: https://explorer.stacks.co/?chain=mainnet
- **Testnet Faucet**: https://explorer.stacks.co/sandbox/faucet?chain=testnet
- **Hiro Wallet**: https://wallet.hiro.so/
- **GitHub**: https://github.com/Mosas2000/SatGuard-Protocol

---

## Security Warnings

1. **Never share your mainnet mnemonic**
2. **Backup your mnemonic securely**
3. **Test thoroughly on testnet first**
4. **Mainnet transactions are irreversible**
5. **Keep `settings/Mainnet.toml` private** (it's in .gitignore)

---

**Need help?** Check the docs folder or open an issue on GitHub.
