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
