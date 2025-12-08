package com.example.lunebackend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class ReservationController {

    private final ReservationRepository reservationRepository;

    @Autowired
    public ReservationController(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    // GET /api/reserve  -> list all reservations
    @GetMapping("/reserve")
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    // POST /api/reserve -> create new reservation
    @PostMapping("/reserve")
    public ResponseEntity<?> reserve(@RequestBody Reservation reservation) {
        if (reservation.getName() == null ||
                reservation.getPhone() == null ||
                reservation.getTableNumber() == 0) {
            return ResponseEntity
                    .badRequest()
                    .body("Missing data");
        }

        // prevent double booking of same table
        if (reservationRepository.findByTableNumber(reservation.getTableNumber()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Table already reserved");
        }

        Reservation saved = reservationRepository.save(reservation);
        return ResponseEntity.ok(saved);
    }

    // PUT /api/reserve/{id} -> edit reservation
    @PutMapping("/reserve/{id}")
    public ResponseEntity<?> updateReservation(@PathVariable Long id,
                                               @RequestBody Reservation updated) {
        return reservationRepository.findById(id)
                .map(existing -> {
                    existing.setName(updated.getName());
                    existing.setPhone(updated.getPhone());
                    existing.setTableNumber(updated.getTableNumber());
                    Reservation saved = reservationRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE /api/reserve/{id} -> delete reservation
    @DeleteMapping("/reserve/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        if (!reservationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        reservationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
