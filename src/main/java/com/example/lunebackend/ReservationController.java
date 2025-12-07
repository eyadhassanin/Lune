package com.example.lunebackend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin // allows HTML to call this backend
@RestController
@RequestMapping("/api")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    @PostMapping("/reserve")
    public Reservation reserve(@RequestBody Reservation reservation) {
        return reservationRepository.save(reservation);
    }
}
