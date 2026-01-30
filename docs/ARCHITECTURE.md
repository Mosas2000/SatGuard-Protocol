# SatGuard Protocol Architecture

## System Components

### Smart Contracts

1. **insurance-pool.clar** - Core insurance pool logic
2. **sbtc-token.clar** - sBTC token interface

### Contract Design

#### Data Structures

- **Pools**: Store pool metadata (id, creator, type, total-funds, status)
- **Contributors**: Track user contributions per pool
- **Claims**: Store claim data (id, pool-id, claimant, amount, status)
- **Votes**: Track voting records per claim

#### Key Functions

- Pool Management: create, close, fund
- Claim Lifecycle: submit, vote, process
- User Actions: contribute, withdraw, claim

## Security Considerations

- Reentrancy protection
- Integer overflow prevention
- Access control validation
- Time-lock mechanisms
