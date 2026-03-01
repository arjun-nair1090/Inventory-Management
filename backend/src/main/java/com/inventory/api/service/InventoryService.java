package com.inventory.api.service;

import com.inventory.api.model.Item;
import com.inventory.api.model.DashboardStats;
import java.util.List;
import java.util.Optional;

public interface InventoryService {
    List<Item> getAllItems();
    Optional<Item> getItemById(Long id);
    Item saveItem(Item item);
    void deleteItem(Long id);
    DashboardStats getDashboardStats();
    List<com.inventory.api.model.InventoryTransaction> getRecentTransactions();
}
