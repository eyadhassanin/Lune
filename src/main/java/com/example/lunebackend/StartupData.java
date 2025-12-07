package com.example.lunebackend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class StartupData implements CommandLineRunner {

    private final AppUserRepository users;

    public StartupData(AppUserRepository users) {
        this.users = users;
    }

    @Override
    public void run(String... args) {
        // create default admin if not exists
        users.findByEmail("admin@lune.com").orElseGet(() ->
                users.save(new AppUser("admin@lune.com", "admin123", "ADMIN"))
        );
    }
}
