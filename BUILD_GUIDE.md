# SatGuard Protocol - Complete Build Guide

## Project Overview

**SatGuard Protocol** is a Bitcoin-backed micro-insurance protocol built on Stacks blockchain. It enables users to pool sBTC to insure against specific events including exchange hacks, rug pulls, and Bitcoin volatility.

**Deployment Target**: Stacks Mainnet  
**Minimum Commits**: 30+ commits across 5 branches  
**Tech Stack**: Clarity smart contracts, React frontend, Stacks.js

---

## Phase 1: Project Setup & Architecture

### Branch: `setup`

#### Commit 1: Initialize project structure

Set up the foundational project structure with proper directory organization and version control.

```bash
mkdir satguard-protocol
cd satguard-protocol

git init
git checkout -b setup

mkdir -p contracts tests scripts frontend docs

cat > .gitignore << 'EOF'
# Clarity
.cache/
settings/
history.txt

# Node
node_modules/
dist/
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
EOF

cat > README.md << 'EOF'
# SatGuard Protocol

A Bitcoin-backed micro-insurance protocol on Stacks blockchain.

## Overview

SatGuard enables users to pool sBTC and collectively insure against crypto-related risks including exchange hacks, rug pulls, and market volatility.

## Features

- Decentralized insurance pools
- Community-driven claim voting
- sBTC-backed coverage
- Transparent payout mechanism

## Status

Under Development

## License

MIT
EOF

git add .
git commit -m "chore: initialize project structure with base files"
```

---

#### Commit 2: Set up Clarinet configuration

Initialize the Clarity development environment with proper configuration.

```bash
clarinet new satguard-protocol .

cat > Clarinet.toml << 'EOF'
[project]
name = "satguard-protocol"
description = "Bitcoin-backed micro-insurance protocol"
authors = ["Your Name"]
telemetry = false
cache_dir = "./.cache"
requirements = []

[contracts.insurance-pool]
path = "contracts/insurance-pool.clar"
clarity_version = 2
epoch = 2.5

[contracts.sbtc-token]
path = "contracts/sbtc-token.clar"
clarity_version = 2
epoch = 2.5
EOF

git add .
git commit -m "chore: configure Clarinet for Clarity smart contract development"
```

---

#### Commit 3: Add documentation structure

Create comprehensive documentation framework for the project.

```bash
cat > docs/ARCHITECTURE.md << 'EOF'
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
EOF

cat > docs/DEPLOYMENT.md << 'EOF'
# Deployment Guide

## Prerequisites

- Stacks wallet with sufficient STX for deployment
- Clarinet CLI installed
- Node.js 18+ installed

## Testnet Deployment

1. Configure testnet settings
2. Deploy contracts using Clarinet
3. Verify contract deployment
4. Initialize frontend configuration

## Mainnet Deployment

1. Audit smart contracts
2. Test thoroughly on testnet
3. Deploy to mainnet
4. Verify and announce contract addresses

## Post-Deployment

- Monitor contract activity
- Set up block explorer verification
- Update frontend with mainnet addresses
EOF

cat > docs/CONTRIBUTING.md << 'EOF'
# Contributing Guidelines

## Development Workflow

1. Fork the repository
2. Create feature branch from `main`
3. Make changes with clear commits
4. Write tests for new functionality
5. Submit pull request

## Commit Convention

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `test:` Test additions/modifications
- `chore:` Maintenance tasks

## Code Standards

- Comment complex logic
- Follow Clarity best practices
- Write comprehensive tests
- Update documentation
EOF

git add docs/
git commit -m "docs: add architecture, deployment, and contribution documentation"
```

---

#### Commit 4: Configure development environment

Set up development and deployment configurations.

```bash
cat > .env.example << 'EOF'
# Network Configuration
STACKS_NETWORK=testnet
STACKS_API_URL=https://api.testnet.hiro.so

# Contract Deployment
DEPLOYER_PRIVATE_KEY=your_private_key_here
CONTRACT_DEPLOYER_ADDRESS=your_stacks_address_here

# Frontend Configuration
VITE_STACKS_NETWORK=testnet
VITE_CONTRACT_ADDRESS=
VITE_CONTRACT_NAME=insurance-pool
EOF

cat > scripts/deploy.js << 'EOF'
// Deployment script for SatGuard Protocol

const network = process.env.STACKS_NETWORK || 'testnet';

console.log(`Preparing deployment to ${network}...`);

// Contract deployment logic to be implemented
EOF

mkdir -p settings
cat > settings/Devnet.toml << 'EOF'
[network]
name = "devnet"

[accounts.deployer]
mnemonic = "your mnemonic here"
balance = 100000000000000

[accounts.wallet_1]
mnemonic = "your mnemonic here"
balance = 100000000000000

[accounts.wallet_2]
mnemonic = "your mnemonic here"
balance = 100000000000000
EOF

git add .
git commit -m "chore: configure development environment and deployment templates"
```

---

## Phase 2: Core Smart Contract Development

### Branch: `core-contracts`

```bash
git checkout -b core-contracts
```

---

#### Commit 5: Create insurance pool core contract

Implement foundational pool contract structure.

```bash
cat > contracts/insurance-pool.clar << 'EOF'
;; SatGuard Protocol - Insurance Pool Contract
;; Enables creation and management of Bitcoin-backed insurance pools

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-unauthorized (err u102))
(define-constant err-invalid-amount (err u103))
(define-constant err-pool-closed (err u104))
(define-constant err-insufficient-funds (err u105))

;; Data Variables
(define-data-var pool-nonce uint u0)

;; Pool status enum
(define-constant POOL-STATUS-ACTIVE u1)
(define-constant POOL-STATUS-CLOSED u2)

;; Data Maps
(define-map pools
  { pool-id: uint }
  {
    creator: principal,
    coverage-type: (string-ascii 50),
    total-funds: uint,
    min-contribution: uint,
    max-coverage: uint,
    created-at: uint,
    status: uint,
    contributor-count: uint
  }
)

;; Read-only functions
(define-read-only (get-pool (pool-id uint))
  (map-get? pools { pool-id: pool-id })
)

(define-read-only (get-pool-count)
  (var-get pool-nonce)
)

;; Public functions
(define-public (create-pool 
  (coverage-type (string-ascii 50))
  (min-contribution uint)
  (max-coverage uint))
  (let
    (
      (new-pool-id (+ (var-get pool-nonce) u1))
    )
    ;; Validate inputs
    (asserts! (> min-contribution u0) err-invalid-amount)
    (asserts! (> max-coverage u0) err-invalid-amount)
    
    ;; Create pool
    (map-set pools
      { pool-id: new-pool-id }
      {
        creator: tx-sender,
        coverage-type: coverage-type,
        total-funds: u0,
        min-contribution: min-contribution,
        max-coverage: max-coverage,
        created-at: block-height,
        status: POOL-STATUS-ACTIVE,
        contributor-count: u0
      }
    )
    
    ;; Update pool nonce
    (var-set pool-nonce new-pool-id)
    
    ;; Print event
    (print {
      event: "pool-created",
      pool-id: new-pool-id,
      creator: tx-sender,
      coverage-type: coverage-type
    })
    
    (ok new-pool-id)
  )
)
EOF

git add contracts/insurance-pool.clar
git commit -m "feat: implement core insurance pool creation logic"
```

---

#### Commit 6: Add contribution mechanism

Enable users to contribute sBTC to pools.

```bash
cat >> contracts/insurance-pool.clar << 'EOF'

;; Contributor tracking
(define-map contributors
  { pool-id: uint, contributor: principal }
  {
    amount: uint,
    contributed-at: uint
  }
)

;; Read-only function to get contribution
(define-read-only (get-contribution (pool-id uint) (contributor principal))
  (map-get? contributors { pool-id: pool-id, contributor: contributor })
)

;; Contribute to pool
(define-public (contribute-to-pool (pool-id uint) (amount uint))
  (let
    (
      (pool (unwrap! (get-pool pool-id) err-not-found))
      (existing-contribution (default-to { amount: u0, contributed-at: u0 }
        (map-get? contributors { pool-id: pool-id, contributor: tx-sender })))
    )
    ;; Validate pool is active
    (asserts! (is-eq (get status pool) POOL-STATUS-ACTIVE) err-pool-closed)
    
    ;; Validate contribution amount
    (asserts! (>= amount (get min-contribution pool)) err-invalid-amount)
    
    ;; Update or create contribution record
    (map-set contributors
      { pool-id: pool-id, contributor: tx-sender }
      {
        amount: (+ (get amount existing-contribution) amount),
        contributed-at: block-height
      }
    )
    
    ;; Update pool total funds
    (map-set pools
      { pool-id: pool-id }
      (merge pool {
        total-funds: (+ (get total-funds pool) amount),
        contributor-count: (if (is-eq (get amount existing-contribution) u0)
          (+ (get contributor-count pool) u1)
          (get contributor-count pool))
      })
    )
    
    ;; Print contribution event
    (print {
      event: "contribution-made",
      pool-id: pool-id,
      contributor: tx-sender,
      amount: amount
    })
    
    (ok true)
  )
)
EOF

git add contracts/insurance-pool.clar
git commit -m "feat: add contribution mechanism with validation and tracking"
```

---

#### Commit 7: Implement claim submission system

Create claim submission and tracking functionality.

```bash
cat >> contracts/insurance-pool.clar << 'EOF'

;; Claim tracking
(define-data-var claim-nonce uint u0)

;; Claim status constants
(define-constant CLAIM-STATUS-PENDING u1)
(define-constant CLAIM-STATUS-APPROVED u2)
(define-constant CLAIM-STATUS-REJECTED u3)
(define-constant CLAIM-STATUS-PAID u4)

(define-map claims
  { claim-id: uint }
  {
    pool-id: uint,
    claimant: principal,
    amount: uint,
    reason: (string-utf8 500),
    submitted-at: uint,
    status: uint,
    votes-for: uint,
    votes-against: uint
  }
)

;; Read-only function to get claim
(define-read-only (get-claim (claim-id uint))
  (map-get? claims { claim-id: claim-id })
)

(define-read-only (get-claim-count)
  (var-get claim-nonce)
)

;; Submit claim
(define-public (submit-claim 
  (pool-id uint)
  (amount uint)
  (reason (string-utf8 500)))
  (let
    (
      (pool (unwrap! (get-pool pool-id) err-not-found))
      (contribution (unwrap! (get-contribution pool-id tx-sender) err-unauthorized))
      (new-claim-id (+ (var-get claim-nonce) u1))
    )
    ;; Validate pool is active
    (asserts! (is-eq (get status pool) POOL-STATUS-ACTIVE) err-pool-closed)
    
    ;; Validate claimant is a contributor
    (asserts! (> (get amount contribution) u0) err-unauthorized)
    
    ;; Validate claim amount
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (<= amount (get max-coverage pool)) err-invalid-amount)
    (asserts! (<= amount (get total-funds pool)) err-insufficient-funds)
    
    ;; Create claim
    (map-set claims
      { claim-id: new-claim-id }
      {
        pool-id: pool-id,
        claimant: tx-sender,
        amount: amount,
        reason: reason,
        submitted-at: block-height,
        status: CLAIM-STATUS-PENDING,
        votes-for: u0,
        votes-against: u0
      }
    )
    
    ;; Update claim nonce
    (var-set claim-nonce new-claim-id)
    
    ;; Print claim event
    (print {
      event: "claim-submitted",
      claim-id: new-claim-id,
      pool-id: pool-id,
      claimant: tx-sender,
      amount: amount
    })
    
    (ok new-claim-id)
  )
)
EOF

git add contracts/insurance-pool.clar
git commit -m "feat: implement claim submission system with validation"
```

---

#### Commit 8: Build claim voting mechanism

Enable pool members to vote on claims.

```bash
cat >> contracts/insurance-pool.clar << 'EOF'

;; Vote tracking
(define-map votes
  { claim-id: uint, voter: principal }
  {
    vote: bool,
    voting-power: uint,
    voted-at: uint
  }
)

;; Read-only function to get vote
(define-read-only (get-vote (claim-id uint) (voter principal))
  (map-get? votes { claim-id: claim-id, voter: voter })
)

;; Vote on claim
(define-public (vote-on-claim (claim-id uint) (approve bool))
  (let
    (
      (claim (unwrap! (get-claim claim-id) err-not-found))
      (pool-id (get pool-id claim))
      (pool (unwrap! (get-pool pool-id) err-not-found))
      (contribution (unwrap! (get-contribution pool-id tx-sender) err-unauthorized))
      (voting-power (get amount contribution))
      (existing-vote (map-get? votes { claim-id: claim-id, voter: tx-sender }))
    )
    ;; Validate claim is pending
    (asserts! (is-eq (get status claim) CLAIM-STATUS-PENDING) err-unauthorized)
    
    ;; Validate voter is a contributor
    (asserts! (> voting-power u0) err-unauthorized)
    
    ;; Prevent double voting
    (asserts! (is-none existing-vote) err-unauthorized)
    
    ;; Record vote
    (map-set votes
      { claim-id: claim-id, voter: tx-sender }
      {
        vote: approve,
        voting-power: voting-power,
        voted-at: block-height
      }
    )
    
    ;; Update claim vote counts
    (map-set claims
      { claim-id: claim-id }
      (merge claim {
        votes-for: (if approve 
          (+ (get votes-for claim) voting-power)
          (get votes-for claim)),
        votes-against: (if approve
          (get votes-against claim)
          (+ (get votes-against claim) voting-power))
      })
    )
    
    ;; Print vote event
    (print {
      event: "vote-cast",
      claim-id: claim-id,
      voter: tx-sender,
      approve: approve,
      voting-power: voting-power
    })
    
    (ok true)
  )
)
EOF

git add contracts/insurance-pool.clar
git commit -m "feat: build voting mechanism with voting power calculation"
```

---

#### Commit 9: Create payout distribution logic

Implement claim approval and payout processing.

```bash
cat >> contracts/insurance-pool.clar << 'EOF'

;; Process claim payout
(define-public (process-claim-payout (claim-id uint))
  (let
    (
      (claim (unwrap! (get-claim claim-id) err-not-found))
      (pool-id (get pool-id claim))
      (pool (unwrap! (get-pool pool-id) err-not-found))
      (total-votes (+ (get votes-for claim) (get votes-against claim)))
      (approval-threshold (/ (* (get total-funds pool) u60) u100))
    )
    ;; Validate claim is pending
    (asserts! (is-eq (get status claim) CLAIM-STATUS-PENDING) err-unauthorized)
    
    ;; Validate sufficient votes cast
    (asserts! (>= total-votes (/ (get total-funds pool) u2)) err-unauthorized)
    
    ;; Check if claim approved
    (if (>= (get votes-for claim) approval-threshold)
      (begin
        ;; Approve and mark as paid
        (map-set claims
          { claim-id: claim-id }
          (merge claim { status: CLAIM-STATUS-PAID })
        )
        
        ;; Update pool funds
        (map-set pools
          { pool-id: pool-id }
          (merge pool {
            total-funds: (- (get total-funds pool) (get amount claim))
          })
        )
        
        ;; Print payout event
        (print {
          event: "claim-paid",
          claim-id: claim-id,
          claimant: (get claimant claim),
          amount: (get amount claim)
        })
        
        (ok true)
      )
      (begin
        ;; Reject claim
        (map-set claims
          { claim-id: claim-id }
          (merge claim { status: CLAIM-STATUS-REJECTED })
        )
        
        ;; Print rejection event
        (print {
          event: "claim-rejected",
          claim-id: claim-id
        })
        
        (ok false)
      )
    )
  )
)
EOF

git add contracts/insurance-pool.clar
git commit -m "feat: implement claim payout processing with voting threshold"
```

---

#### Commit 10: Add pool management functions

Add pool closure and withdrawal functionality.

```bash
cat >> contracts/insurance-pool.clar << 'EOF'

;; Close pool
(define-public (close-pool (pool-id uint))
  (let
    (
      (pool (unwrap! (get-pool pool-id) err-not-found))
    )
    ;; Only pool creator can close
    (asserts! (is-eq tx-sender (get creator pool)) err-owner-only)
    
    ;; Validate pool is active
    (asserts! (is-eq (get status pool) POOL-STATUS-ACTIVE) err-pool-closed)
    
    ;; Update pool status
    (map-set pools
      { pool-id: pool-id }
      (merge pool { status: POOL-STATUS-CLOSED })
    )
    
    ;; Print close event
    (print {
      event: "pool-closed",
      pool-id: pool-id,
      closer: tx-sender
    })
    
    (ok true)
  )
)

;; Withdraw from pool
(define-public (withdraw-from-pool (pool-id uint))
  (let
    (
      (pool (unwrap! (get-pool pool-id) err-not-found))
      (contribution (unwrap! (get-contribution pool-id tx-sender) err-not-found))
      (withdrawal-amount (get amount contribution))
    )
    ;; Pool must be closed for withdrawals
    (asserts! (is-eq (get status pool) POOL-STATUS-CLOSED) err-unauthorized)
    
    ;; Validate user has contribution
    (asserts! (> withdrawal-amount u0) err-invalid-amount)
    
    ;; Calculate proportional share of remaining funds
    (let
      (
        (share (/ (* withdrawal-amount (get total-funds pool)) 
                 (get total-funds pool)))
      )
      ;; Remove contribution record
      (map-delete contributors { pool-id: pool-id, contributor: tx-sender })
      
      ;; Update pool
      (map-set pools
        { pool-id: pool-id }
        (merge pool {
          total-funds: (- (get total-funds pool) share),
          contributor-count: (- (get contributor-count pool) u1)
        })
      )
      
      ;; Print withdrawal event
      (print {
        event: "withdrawal-made",
        pool-id: pool-id,
        contributor: tx-sender,
        amount: share
      })
      
      (ok share)
    )
  )
)
EOF

git add contracts/insurance-pool.clar
git commit -m "feat: add pool management with close and withdrawal functions"
```

---

## Phase 3: Testing & Security

### Branch: `testing`

```bash
git checkout -b testing
```

The testing phase would include comprehensive test files for all contract functions. Due to length constraints, I'll provide the structure for the remaining commits:

**Commits 11-17**: Testing suite implementation
- Commit 11: Initialize test framework
- Commit 12: Pool creation tests
- Commit 13: Contribution flow tests
- Commit 14: Claim submission tests
- Commit 15: Voting mechanism tests
- Commit 16: Payout processing tests
- Commit 17: Security and edge case tests

---

## Phase 4: Frontend Development

### Branch: `frontend`

**Commits 18-25**: Frontend implementation
- Commit 18: Initialize React application
- Commit 19: Wallet connection component
- Commit 20: Pool creation interface
- Commit 21: Pool browsing page
- Commit 22: Contribution flow
- Commit 23: Claim submission form
- Commit 24: Voting dashboard
- Commit 25: User dashboard

---

## Phase 5: Deployment Preparation

### Branch: `deployment`

**Commits 26-30**: Deployment readiness
- Commit 26: Mainnet deployment scripts
- Commit 27: Deployment documentation
- Commit 28: User guide
- Commit 29: Developer API documentation
- Commit 30: Final audit preparation

---

## Merge Strategy

```bash
git checkout main
git merge setup
git merge core-contracts
git merge testing
git merge frontend
git merge deployment
```

---

## Pre-Deployment Checklist

- [ ] All 30+ commits completed across 5 branches
- [ ] Comprehensive test suite passing
- [ ] Documentation complete and reviewed
- [ ] Frontend successfully connected to contracts
- [ ] Deployment scripts tested on testnet
- [ ] Security considerations documented
- [ ] README updated with contract addresses
- [ ] Environment variables configured

---

## Deployment Process

### Testnet Deployment

1. Configure testnet environment variables
2. Deploy contracts using Clarinet
3. Verify contract deployment on explorer
4. Test all contract functions
5. Deploy frontend to testnet
6. Conduct end-to-end testing

### Mainnet Deployment

1. Complete security audit
2. Address all audit findings
3. Test thoroughly on testnet
4. Deploy contracts to mainnet
5. Verify contracts on explorer
6. Update frontend configuration
7. Deploy production frontend
8. Monitor initial transactions

---

## Post-Deployment Activities

1. Monitor contract activity and gas usage
2. Set up block explorer verification
3. Create announcement materials
4. Submit to Stacks ecosystem directories
5. Engage with community for feedback
6. Plan future enhancements

---

## License

MIT
