# SatGuard Protocol - Deployment Guide

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ Clarinet installed
- ✅ Node.js v18+ installed
- ✅ Stacks wallet (Hiro or Xverse)
- ✅ Contract tested with `clarinet check` and `clarinet test`

---

## 🧪 Testnet Deployment (Recommended First)

### Step 1: Get Testnet STX

1. Install Hiro Wallet: https://wallet.hiro.so/
2. Switch to **Testnet** mode
3. Copy your testnet address
4. Visit faucet: https://explorer.stacks.co/sandbox/faucet?chain=testnet
5. Request test STX (free)

### Step 2: Configure Testnet Settings

Edit `settings/Testnet.toml`:
```toml
[accounts.deployer]
mnemonic = "your testnet 24-word mnemonic here"
```

⚠️ **Important**: Use TESTNET mnemonic only!

### Step 3: Deploy to Testnet

```bash
# Install deployment dependencies
cd scripts
npm install

# Deploy to testnet
npm run deploy:testnet
```

### Step 4: Verify Deployment

After deployment, you'll get a transaction ID. Check status:
```
https://explorer.stacks.co/txid/YOUR_TX_ID?chain=testnet
```

Wait 10-20 minutes for confirmation.

### Step 5: Test Your Contract

Once deployed, test all functions:
- Create a pool
- Contribute to pool
- Submit claims
- Vote on claims
- Process payouts

---

## 🚀 Mainnet Deployment (After Testnet Success)

### ⚠️ CRITICAL REQUIREMENTS

**DO NOT deploy to mainnet until:**
1. ✅ Testnet deployment successful
2. ✅ All functions tested on testnet
3. ✅ Security audit completed
4. ✅ Community testing done
5. ✅ All bugs fixed

### Step 1: Security Checklist

- [ ] Professional security audit completed
- [ ] Audit findings addressed
- [ ] Testnet testing completed (minimum 2 weeks)
- [ ] No critical bugs found
- [ ] Community feedback incorporated
- [ ] Emergency procedures documented

### Step 2: Get Mainnet STX

You'll need approximately **1-2 STX** for deployment:
- Contract deployment: ~0.5-1.5 STX
- Buffer for transaction fees: ~0.5 STX

Purchase STX from exchanges:
- Coinbase
- Binance
- Kraken
- OKX

### Step 3: Configure Mainnet Settings

Edit `settings/Mainnet.toml`:
```toml
[accounts.deployer]
mnemonic = "your MAINNET 24-word mnemonic here"
```

⚠️ **CRITICAL SECURITY**:
- NEVER commit Mainnet.toml with real mnemonic
- Keep this file secure and private
- Use a hardware wallet if possible
- Backup your mnemonic securely

### Step 4: Final Pre-Deployment Checks

```bash
# Verify contract syntax
clarinet check

# Run all tests
clarinet test

# Review contract one final time
cat contracts/insurance-pool.clar
```

### Step 5: Deploy to Mainnet

```bash
cd scripts
npm run deploy:mainnet
```

### Step 6: Verify Mainnet Deployment

Check transaction on mainnet explorer:
```
https://explorer.stacks.co/txid/YOUR_TX_ID?chain=mainnet
```

### Step 7: Post-Deployment

1. **Document Contract Address**: Save your deployed contract address
2. **Update Frontend**: Point frontend to mainnet contract
3. **Monitor**: Watch for any issues
4. **Announce**: Share with community
5. **Support**: Be ready to help users

---

## 📊 Deployment Costs

### Testnet (FREE)
- All operations use test STX
- No real money required

### Mainnet (REAL STX)
- Contract deployment: ~0.5-1.5 STX (~$0.50-$1.50 USD)*
- Function calls: ~0.001-0.01 STX each
- Total recommended: 2 STX for deployment + buffer

*Prices vary based on network congestion and STX price

---

## 🔧 Using Configuration Files

### Clarinet Deployment

Clarinet automatically uses the appropriate network configuration:

```bash
# Uses Testnet.toml
clarinet deploy --testnet

# Uses Mainnet.toml  
clarinet deploy --mainnet
```

### Manual Deployment Script

Our deployment scripts read from the configuration files:

```bash
# Testnet
NETWORK=testnet npm run deploy:testnet

# Mainnet
NETWORK=mainnet npm run deploy:mainnet
```

---

## 🆘 Troubleshooting

### "Insufficient balance" error
- **Testnet**: Get more test STX from faucet
- **Mainnet**: Add more STX to your wallet

### "Contract already exists" error
- Contract name already deployed by your address
- Change contract name or use different address

### Transaction stuck/pending
- **Testnet**: Can take 10-30 minutes
- **Mainnet**: Usually 10-20 minutes
- Check explorer for status

### "Invalid mnemonic" error
- Verify mnemonic is 24 words
- Check for typos
- Ensure no extra spaces

---

## 📚 Useful Resources

- **Testnet Explorer**: https://explorer.stacks.co/?chain=testnet
- **Mainnet Explorer**: https://explorer.stacks.co/?chain=mainnet
- **Testnet Faucet**: https://explorer.stacks.co/sandbox/faucet?chain=testnet
- **Hiro Wallet**: https://wallet.hiro.so/
- **Stacks Docs**: https://docs.stacks.co/

---

## ✅ Deployment Checklist

### Testnet
- [ ] Get test STX from faucet
- [ ] Configure Testnet.toml with testnet mnemonic
- [ ] Run `clarinet check`
- [ ] Run `clarinet test`
- [ ] Deploy with `npm run deploy:testnet`
- [ ] Verify on testnet explorer
- [ ] Test all contract functions
- [ ] Document any issues

### Mainnet (Only after testnet success)
- [ ] Complete security audit
- [ ] Fix all audit findings
- [ ] Complete 2+ weeks testnet testing
- [ ] Get community feedback
- [ ] Purchase 2+ STX
- [ ] Configure Mainnet.toml with mainnet mnemonic
- [ ] Secure backup of mnemonic
- [ ] Final contract review
- [ ] Deploy with `npm run deploy:mainnet`
- [ ] Verify on mainnet explorer
- [ ] Update frontend configuration
- [ ] Monitor for issues
- [ ] Announce to community

---

**Remember**: Start with testnet, test thoroughly, get audited, then deploy to mainnet! 🚀
