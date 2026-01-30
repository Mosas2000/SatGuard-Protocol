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

