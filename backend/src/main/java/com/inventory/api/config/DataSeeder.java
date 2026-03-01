package com.inventory.api.config;

import com.inventory.api.model.Item;
import com.inventory.api.model.Role;
import com.inventory.api.model.Supplier;
import com.inventory.api.model.User;
import com.inventory.api.repository.ItemRepository;
import com.inventory.api.repository.SupplierRepository;
import com.inventory.api.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ItemRepository itemRepository;
    private final SupplierRepository supplierRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (itemRepository.count() == 0) {
            itemRepository.saveAll(List.of(
                    Item.builder().name("MacBook Pro M3").sku("LAP-001").category("Electronics").price(new BigDecimal("2499")).totalStock(100).currentStock(85).color("blue-500").build(),
                    Item.builder().name("Aeron Chair").sku("CHR-002").category("Furniture").price(new BigDecimal("1200")).totalStock(100).currentStock(40).color("teal-500").build(),
                    Item.builder().name("LaserJet Pro").sku("PRN-003").category("Office").price(new BigDecimal("450")).totalStock(100).currentStock(5).color("amber-500").build(),
                    Item.builder().name("iPhone 15 Pro").sku("PHN-042").category("Electronics").price(new BigDecimal("999")).totalStock(100).currentStock(60).color("violet-500").build()
            ));
        }
        if (supplierRepository.count() == 0) {
            supplierRepository.saveAll(List.of(
                    Supplier.builder().name("Global Tech Inc").contact("Julia Vance").status("Active").icon("Factory").color("bg-blue-500").text("text-blue-500").build(),
                    Supplier.builder().name("Apex Logistics").contact("David Low").status("Inactive").icon("Truck").color("bg-teal-500").text("text-teal-500").build(),
                    Supplier.builder().name("Nexus Supplies").contact("Sam Kent").status("Active").icon("Package").color("bg-[#7f13ec]").text("text-[#7f13ec]").build(),
                    Supplier.builder().name("Precision Lab").contact("Elena Wu").status("Active").icon("Cpu").color("bg-orange-500").text("text-orange-500").build()
            ));
        }
        
        if (userRepository.findByEmail("admin@example.com").isEmpty()) {
            User admin = User.builder()
                    .firstname("System")
                    .lastname("Admin")
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .avatar("https://ui-avatars.com/api/?name=System+Admin&background=random")
                    .build();
            userRepository.save(admin);
        }
    }
}
