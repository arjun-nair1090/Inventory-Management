package com.inventory.api.controller;

import com.inventory.api.model.Role;
import com.inventory.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.stream.Collectors;
import com.inventory.api.dto.UserDto;
import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @PutMapping("/{id}/role")
    public ResponseEntity<Void> updateUserRole(
            @PathVariable Integer id,
            @RequestParam String role
    ) {
        var user = userRepository.findById(id).orElseThrow();
        user.setRole(Role.valueOf(role.toUpperCase()));
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll().stream().map(user -> 
            UserDto.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .role(user.getRole().name())
                .avatar(user.getAvatar())
                .build()
        ).collect(Collectors.toList()));
    }
}
