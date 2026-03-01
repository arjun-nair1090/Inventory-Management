package com.inventory.api.repository;

import com.inventory.api.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    @Query("SELECT COALESCE(SUM(i.currentStock), 0) FROM Item i")
    Integer getTotalCurrentStock();

    @Query("SELECT COUNT(i) FROM Item i WHERE i.currentStock < 10")
    Integer countLowStockItems();

    @Query("SELECT COALESCE(SUM(i.price * i.currentStock), 0) FROM Item i")
    BigDecimal calculateTotalValue();
}
