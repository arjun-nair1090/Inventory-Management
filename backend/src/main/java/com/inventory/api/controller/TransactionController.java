package com.inventory.api.controller;

import com.inventory.api.model.InventoryTransaction;
import com.inventory.api.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<InventoryTransaction>> getRecentTransactions() {
        return ResponseEntity.ok(inventoryService.getRecentTransactions());
    }
}
