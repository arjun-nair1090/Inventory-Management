package com.inventory.api.model;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class DashboardStats {
    private Integer totalItems;
    private Integer lowStockAlerts;
    private BigDecimal inventoryValue;
}
