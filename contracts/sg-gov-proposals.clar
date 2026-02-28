;; SatGuard Governance Proposals
(define-map proposals {id: uint} {t: (string-ascii 50), cr: principal, v: uint, a: uint, st: uint})
(define-data-var p-ct uint u0)
(define-read-only (get-proposal (id uint)) (map-get? proposals {id: id}))
(define-read-only (get-count) (var-get p-ct))
(define-public (create-proposal (t (string-ascii 50)))
  (let ((nid (+ (var-get p-ct) u1)))
    (map-set proposals {id: nid} {t: t, cr: tx-sender, v: u0, a: u0, st: u0})
    (var-set p-ct nid) (ok nid)))
