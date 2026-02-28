;; SatGuard Event Logger
(define-data-var event-count uint u0)
(define-map events uint {sender: principal, event-type: uint, data: uint, height: uint})
(define-read-only (get-event (id uint)) (map-get? events id))
(define-read-only (get-count) (var-get event-count))
(define-public (log-event (event-type uint) (data uint))
  (let ((id (var-get event-count)))
    (map-set events id {sender: tx-sender, event-type: event-type, data: data, height: block-height})
    (var-set event-count (+ id u1)) (ok id)))
