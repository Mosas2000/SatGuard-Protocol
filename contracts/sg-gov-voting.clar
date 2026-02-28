;; SatGuard Governance Voting
(define-map votes {p: uint, v: principal} {s: bool, w: uint})
(define-read-only (get-vote (p uint) (v principal)) (map-get? votes {p: p, v: v}))
(define-public (cast-vote (p uint) (s bool) (w uint))
  (begin (asserts! (is-none (map-get? votes {p: p, v: tx-sender})) (err u200))
    (map-set votes {p: p, v: tx-sender} {s: s, w: w}) (ok true)))
