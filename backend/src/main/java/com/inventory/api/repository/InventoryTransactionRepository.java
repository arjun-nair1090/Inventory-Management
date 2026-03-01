package com.inventory.api.repository;

import com.inventory.api.model.InventoryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {
    List<InventoryTransaction> findTop10ByOrderByTimestampDesc();
}
