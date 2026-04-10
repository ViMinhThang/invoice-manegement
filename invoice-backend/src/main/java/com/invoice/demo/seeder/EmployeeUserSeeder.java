package com.invoice.demo.seeder;

import com.invoice.demo.user.entity.User;
import com.invoice.demo.user.entity.UserRole;
import com.invoice.demo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Order(4)
public class EmployeeUserSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String email = "employee@email.com";
        String encodedPassword = passwordEncoder.encode("employee123");

        User employeeUser = userRepository.findByEmailIgnoreCase(email)
                .map(existing -> {
                    existing.setFullName("Employee");
                    existing.setPassword(encodedPassword);
                    existing.setRole(UserRole.EMPLOYEE);
                    return existing;
                })
                .orElseGet(() -> User.builder()
                        .fullName("Employee")
                        .email(email)
                        .password(encodedPassword)
                        .role(UserRole.EMPLOYEE)
                        .build());

        userRepository.save(employeeUser);
    }
}
