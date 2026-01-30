# 🚀 Mainnet Deployment - Quick Start Guide

## Prerequisites Checklist

Before deploying, ensure you have:

- [ ] **1-2 STX** in your mainnet wallet
- [ ] **Mainnet mnemonic** (24 words) backed up securely  
- [ ] **Mainnet address** starts with **SP** (not ST)
- [ ] **Tested on testnet** successfully ✅

---

## Step 1: Configure Mainnet Settings

Edit `settings/Mainnet.toml`:

```toml
[accounts.deployer]
mnemonic = "your 24-word MAINNET mnemonic phrase here"
```

⚠️ **CRITICAL**: Use your **MAINNET** mnemonic (SP address), NOT testnet!

---

## Step 2: Deploy to Mainnet

```bash
cd scripts
npm run deploy:mainnet
```

The script will:
1. Show your deployer address (SP...)
2. Display estimated costs (~0.5-1.5 STX)
3. Ask for confirmation
4. Deploy contract to mainnet
5. Provide transaction ID and explorer link

**Type "yes" when prompted to confirm deployment.**

---

## Step 3: Verify Deployment

After deployment, you'll receive:
- **Transaction ID**: Check status on explorer
- **Contract Address**: `SP...ADDRESS.insurance-pool`

Visit mainnet explorer:
```
https://explorer.stacks.co/txid/YOUR_TX_ID?chain=mainnet
```

Wait 10-20 minutes for confirmation.

---

## Step 4: Generate Mainnet Activity (Optional)

After deployment confirms, create on-chain activity:

```bash
npm run mainnet-activity SP_YOUR_CONTRACT_ADDRESS
```

This creates 3 transactions (costs ~0.03 STX):
- Create insurance pool
- Contribute to pool
- Submit test claim

---

## Costs Summary

| Action | Cost (STX) | Cost (USD)* |
|--------|-----------|-------------|
| Deploy contract | 0.5-1.5 | $0.50-$1.50 |
| Create pool | ~0.01 | ~$0.01 |
| Contribute | ~0.01 | ~$0.01 |
| Submit claim | ~0.01 | ~$0.01 |
| Vote | ~0.01 | ~$0.01 |

*Approximate, varies with STX price

**Recommended balance**: 2 STX minimum

---

## ⚠️ Important Warnings

1. **Real Money**: All costs are in real STX tokens
2. **Irreversible**: Transactions cannot be undone
3. **Double Check**: Verify address and mnemonic before deploying
4. **Security**: Never share your mainnet mnemonic
5. **Backup**: Keep mnemonic backed up securely

---

## Troubleshooting

**"Insufficient balance" error**
- Add more STX to your wallet
- Check you're using mainnet address (SP...)

**"Transaction rejected" error**
- Wait for previous transactions to confirm
- Check STX balance is sufficient
- Verify contract name isn't already taken

**"Mnemonic not set" error**
- Edit `settings/Mainnet.toml`
- Add your 24-word mainnet mnemonic
- Ensure it's for mainnet (SP address)

---

## After Deployment

1. **Save contract address** - You'll need it for frontend
2. **Update frontend** - Point to mainnet contract
3. **Test functions** - Verify contract works on mainnet
4. **Monitor** - Watch for any issues
5. **Announce** - Share with community!

---

**Ready to deploy?** Run: `npm run deploy:mainnet`

**Questions?** Review the full deployment guide in `DEPLOYMENT_GUIDE.md`
