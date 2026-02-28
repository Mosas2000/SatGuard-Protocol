;; SatGuard Risk Tiers
(define-map tiers {id: uint} {n: (string-ascii 20), r: uint, m: uint})
(define-data-var tier-ct uint u0)
(define-read-only (get-tier (id uint)) (map-get? tiers {id: id}))
(define-read-only (get-tier-count) (var-get tier-ct))
(define-public (add-tier (n (string-ascii 20)) (r uint) (m uint))
  (let ((nid (+ (var-get tier-ct) u1)))
    (map-set tiers {id: nid} {n: n, r: r, m: m})
    (var-set tier-ct nid) (ok nid)))
