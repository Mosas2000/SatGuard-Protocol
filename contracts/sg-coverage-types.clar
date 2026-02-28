;; SatGuard Coverage Types Registry
(define-map types {id: uint} {n: (string-ascii 30), d: (string-ascii 50), a: bool})
(define-data-var t-ct uint u0)
(define-read-only (get-type (id uint)) (map-get? types {id: id}))
(define-read-only (get-count) (var-get t-ct))
(define-public (add-type (n (string-ascii 30)) (d (string-ascii 50)))
  (let ((nid (+ (var-get t-ct) u1)))
    (map-set types {id: nid} {n: n, d: d, a: true})
    (var-set t-ct nid) (ok nid)))
