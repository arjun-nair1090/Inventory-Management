package com.inventory.api.service;

import com.inventory.api.model.Item;
import com.inventory.api.model.DashboardStats;
import com.inventory.api.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final ItemRepository itemRepository;
    private final com.inventory.api.repository.InventoryTransactionRepository transactionRepository;

    @Override
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    @Override
    public Optional<Item> getItemById(Long id) {
        return itemRepository.findById(id);
    }

    @Override
    public Item saveItem(Item item) {
        return itemRepository.save(item);
    }

    @Override
    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }

    @Override
    public DashboardStats getDashboardStats() {
        return DashboardStats.builder()
                .totalItems(itemRepository.getTotalCurrentStock())
                .lowStockAlerts(itemRepository.countLowStockItems())
                .inventoryValue(itemRepository.calculateTotalValue())
                .build();
    }

    @Override
    public List<com.inventory.api.model.InventoryTransaction> getRecentTransactions() {
        return transactionRepository.findTop10ByOrderByTimestampDesc();
    }
}
