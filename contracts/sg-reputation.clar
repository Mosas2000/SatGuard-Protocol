;; SatGuard Reputation System
(define-map rep {u: principal} {s: uint, r: uint})
(define-read-only (get-rep (u principal)) (default-to {s: u0, r: u0} (map-get? rep {u: u})))
(define-public (add-rep (u principal) (pts uint))
  (let ((cur (get-rep u)))
    (map-set rep {u: u} {s: (+ (get s cur) pts), r: (+ (get r cur) u1)})
    (ok true)))
