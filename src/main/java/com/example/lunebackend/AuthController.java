package com.example.lunebackend;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AppUserRepository users;

    public AuthController(AppUserRepository users) {
        this.users = users;
    }

    public static class LoginRequest {
        public String email;
        public String password;
    }

    public static class RegisterRequest {
        public String email;
        public String password;
    }

    public static class AuthResponse {
        public boolean success;
        public String message;
        public String email;
        public String role;

        public AuthResponse(boolean success, String message, String email, String role) {
            this.success = success;
            this.message = message;
            this.email = email;
            this.role = role;
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        if (req.email == null || req.password == null) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, "Email and password required", null, null));
        }

        return users.findByEmail(req.email)
                .map(user -> {
                    if (user.getPassword().equals(req.password)) {
                        return ResponseEntity.ok(
                                new AuthResponse(true, "Login successful", user.getEmail(), user.getRole())
                        );
                    } else {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(new AuthResponse(false, "Invalid credentials", null, null));
                    }
                })
                .orElseGet(() ->
                        ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(new AuthResponse(false, "Invalid credentials", null, null))
                );
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) {
        if (req.email == null || req.password == null) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, "Email and password required", null, null));
        }

        if (users.findByEmail(req.email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new AuthResponse(false, "Email already exists", null, null));
        }

        AppUser u = new AppUser(req.email, req.password, "USER");
        users.save(u);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(true, "Account created", u.getEmail(), u.getRole()));
    }
}
