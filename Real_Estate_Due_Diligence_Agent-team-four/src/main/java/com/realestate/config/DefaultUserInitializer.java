package com.realestate.config;

import com.realestate.entity.User;
import com.realestate.enums.Role;
import com.realestate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.dao.DataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DefaultUserInitializer {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.default-admin.email:admin@example.com}")
    private String adminEmail;

    @Value("${app.default-admin.password:admin123}")
    private String adminPassword;

    @EventListener(ApplicationReadyEvent.class)
    public void createDefaultAdmin() {
        try {
            if (userRepository.existsByEmail(adminEmail)) {
                return;
            }

            User admin = new User();
            admin.setFullName("System Administrator");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(Role.ADMINISTRATOR);

            userRepository.save(admin);
        } catch (DataAccessException ex) {
            // Keep startup available even when local PostgreSQL credentials are not configured yet.
            System.err.println("Default admin user was not initialized: " + ex.getMostSpecificCause().getMessage());
        }
    }
}
