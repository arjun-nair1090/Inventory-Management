package com.inventory.api.controller;

import com.inventory.api.model.DashboardStats;
import com.inventory.api.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<DashboardStats> getStats() {
        return ResponseEntity.ok(inventoryService.getDashboardStats());
    }
}
