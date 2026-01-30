# On-Chain Activity Generation Guide

## Purpose

This script generates on-chain activity by making multiple transactions to your deployed SatGuard contract. This is useful for:
- Testing contract functionality
- Creating transaction history
- Demonstrating the protocol
- Populating the blockchain with sample data

## Prerequisites

1. ✅ Contract deployed to testnet
2. ✅ Test STX in your wallet (get from faucet)
3. ✅ Your contract address

## What It Does

The script automatically creates 6 transactions:

1. **Create Pool #1**: "Exchange Hack Protection"
   - Min contribution: 0.1 sBTC
   - Max coverage: 1.0 sBTC

2. **Create Pool #2**: "Rug Pull Protection"
   - Min contribution: 0.2 sBTC
   - Max coverage: 2.0 sBTC

3. **Contribute to Pool #1**: 0.15 sBTC

4. **Contribute to Pool #2**: 0.25 sBTC

5. **Submit Claim**: Request 0.5 sBTC from Pool #1

6. **Vote on Claim**: Approve the submitted claim

## How to Use

### Step 1: Deploy Your Contract

First, deploy your contract to testnet:
```bash
npm run deploy:testnet
```

Save the contract address from the output (e.g., `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM`)

### Step 2: Wait for Deployment Confirmation

Check the explorer link and wait for your deployment to confirm (~10-20 minutes).

### Step 3: Generate Activity

Run the activity generator with your contract address:
```bash
npm run activity YOUR_CONTRACT_ADDRESS
```

Example:
```bash
npm run activity ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
```

### Step 4: Monitor Transactions

The script will output explorer links for each transaction. Monitor them to see confirmations.

## Expected Output

```
============================================================
SatGuard Protocol - On-Chain Activity Generator
============================================================

📍 Your Address: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
📍 Contract: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.insurance-pool

🚀 Starting on-chain activity generation...

1️⃣  Creating Pool #1: Exchange Hack Protection...
   ✅ Success! TX: 0x123...
   🔍 https://explorer.stacks.co/txid/0x123...?chain=testnet

2️⃣  Creating Pool #2: Rug Pull Protection...
   ✅ Success! TX: 0x456...
   🔍 https://explorer.stacks.co/txid/0x456...?chain=testnet

... (continues for all 6 transactions)

============================================================
✅ Activity generation complete!

📊 Summary:
   - 2 pools created
   - 2 contributions made
   - 1 claim submitted
   - 1 vote cast

⏳ Transactions will confirm in 10-20 minutes.
```

## Customization

You can modify `generate-activity.js` to:
- Create more pools
- Make different contribution amounts
- Submit multiple claims
- Add more voters
- Test different scenarios

## Troubleshooting

### "Insufficient balance" error
- Get more test STX from the faucet
- Wait for previous transactions to confirm

### "Contract not found" error
- Verify your contract address is correct
- Ensure deployment transaction confirmed

### "Function not found" error
- Check contract deployment was successful
- Verify contract name matches

## Cost Estimate

On testnet (FREE):
- Each transaction: ~0.001-0.01 test STX
- Total for 6 transactions: ~0.06 test STX
- Get free test STX from faucet

## Next Steps

After generating activity:
1. Check all transactions on explorer
2. Query contract state to see pools, contributions, claims
3. Test additional functionality
4. Prepare for mainnet deployment

---

**Ready to generate activity?**
```bash
npm run activity YOUR_CONTRACT_ADDRESS
```
