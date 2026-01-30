# SatGuard Protocol - Developer Documentation

## Contract API Reference

### Insurance Pool Contract

Contract: `insurance-pool.clar`

#### Public Functions

##### create-pool
Creates a new insurance pool.

```clarity
(create-pool 
  (coverage-type (string-ascii 50))
  (min-contribution uint)
  (max-coverage uint))
```

**Parameters:**
- `coverage-type`: Description of what the pool insures against
- `min-contribution`: Minimum amount users can contribute (micro-units)
- `max-coverage`: Maximum claim payout amount (micro-units)

**Returns:** `(ok pool-id)` or error

---

##### contribute-to-pool
Add funds to an existing pool.

```clarity
(contribute-to-pool 
  (pool-id uint)
  (amount uint))
```

**Parameters:**
- `pool-id`: ID of the pool to contribute to
- `amount`: Contribution amount in micro-units

**Returns:** `(ok true)` or error

---

##### submit-claim
Submit an insurance claim.

```clarity
(submit-claim 
  (pool-id uint)
  (amount uint)
  (reason (string-utf8 500)))
```

**Parameters:**
- `pool-id`: Pool to claim from
- `amount`: Claim amount (must be ≤ max-coverage)
- `reason`: Detailed explanation of the loss

**Returns:** `(ok claim-id)` or error

---

##### vote-on-claim
Vote to approve or reject a claim.

```clarity
(vote-on-claim 
  (claim-id uint)
  (approve bool))
```

**Parameters:**
- `claim-id`: ID of the claim to vote on
- `approve`: true to approve, false to reject

**Returns:** `(ok true)` or error

---

##### process-claim-payout
Process a claim after voting completes.

```clarity
(process-claim-payout (claim-id uint))
```

**Parameters:**
- `claim-id`: ID of the claim to process

**Returns:** `(ok true)` if approved, `(ok false)` if rejected

**Requirements:**
- At least 50% of pool funds voted
- 60% approval threshold for payout

---

##### close-pool
Close a pool (creator only).

```clarity
(close-pool (pool-id uint))
```

---

##### withdraw-from-pool
Withdraw funds from a closed pool.

```clarity
(withdraw-from-pool (pool-id uint))
```

---

#### Read-Only Functions

##### get-pool
```clarity
(get-pool (pool-id uint))
```

Returns pool details or none.

##### get-pool-count
```clarity
(get-pool-count)
```

Returns total number of pools created.

##### get-contribution
```clarity
(get-contribution (pool-id uint) (contributor principal))
```

Returns contributor's amount and timestamp.

##### get-claim
```clarity
(get-claim (claim-id uint))
```

Returns claim details or none.

##### get-claim-count
```clarity
(get-claim-count)
```

Returns total number of claims submitted.

##### get-vote
```clarity
(get-vote (claim-id uint) (voter principal))
```

Returns vote details or none.

---

## Error Codes

- `u100`: `err-owner-only` - Only contract owner can perform this action
- `u101`: `err-not-found` - Resource not found
- `u102`: `err-unauthorized` - User not authorized for this action
- `u103`: `err-invalid-amount` - Invalid amount provided
- `u104`: `err-pool-closed` - Pool is closed
- `u105`: `err-insufficient-funds` - Insufficient funds in pool

---

## Frontend Integration

### Using Stacks.js

```typescript
import { openContractCall } from '@stacks/connect';
import { uintCV, stringAsciiCV } from '@stacks/transactions';

// Create a pool
await openContractCall({
  contractAddress: 'SP...',
  contractName: 'insurance-pool',
  functionName: 'create-pool',
  functionArgs: [
    stringAsciiCV('Exchange Hack Protection'),
    uintCV(100000),
    uintCV(1000000)
  ],
  // ... other options
});
```

---

## Testing

Run the test suite:
```bash
clarinet test
```

Run specific test file:
```bash
clarinet test tests/insurance-pool_test.ts
```

---

## Local Development

1. Install Clarinet
2. Clone the repository
3. Run `clarinet check` to verify contracts
4. Run `clarinet console` for interactive testing

---

## Security Considerations

- All amounts are in micro-units (1 sBTC = 1,000,000 micro-units)
- Voting power is proportional to contribution
- Claims require community approval
- Pool creators can close pools but cannot withdraw others' funds
- Withdrawals only allowed from closed pools
