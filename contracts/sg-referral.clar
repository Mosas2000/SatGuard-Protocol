;; SatGuard Referral System
(define-map refs {u: principal} {r: principal, ct: uint, e: uint})
(define-read-only (get-ref (u principal)) (map-get? refs {u: u}))
(define-public (set-referral (r principal))
  (begin (asserts! (is-none (map-get? refs {u: tx-sender})) (err u300))
    (map-set refs {u: tx-sender} {r: r, ct: u0, e: u0}) (ok true)))
(define-public (log-referral-use (u principal))
  (let ((ref (unwrap! (map-get? refs {u: u}) (err u301))))
    (map-set refs {u: u} (merge ref {ct: (+ (get ct ref) u1)})) (ok true)))
