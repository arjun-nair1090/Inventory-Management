  A lightweight, OOP‑centric inventory application built with Spring Boot 3.
  The system covers user authentication, role‑based access, CRUD on items, dashboards, reports, and admin‑only features.
  ---
  Table of Contents

  ┌─────────────────────────┬────────────────────────────────────┐
  │         Section         │            Description             │
  ├─────────────────────────┼────────────────────────────────────┤
  │ 1️⃣  Overview            │ What the app does & why it matters │
  ├─────────────────────────┼────────────────────────────────────┤
  │ 2️⃣  Architecture        │ Layered design & tech stack        │
  ├─────────────────────────┼────────────────────────────────────┤
  │ 3️⃣  Features            │ All core functionalities           │
  ├─────────────────────────┼────────────────────────────────────┤
  │ 4️⃣  OOP Design          │ Classes, interfaces & SOLID        │
  ├─────────────────────────┼────────────────────────────────────┤
  │ 5️⃣  Tech Stack          │ Libraries & runtime                │
  ├─────────────────────────┼────────────────────────────────────┤
  │ 6️⃣  Project Structure   │ Directory layout                   │
  ├─────────────────────────┼────────────────────────────────────┤
  │ 7️⃣  Setup               │ How to get started locally         │
  ├─────────────────────────┼────────────────────────────────────┤
  │ 8️⃣  Sample Code         │ Core entities & layers             │
  ├─────────────────────────┼────────────────────────────────────┤
  │ 9️⃣  Testing             │ Unit, integration & UI             │
  ├─────────────────────────┼────────────────────────────────────┤
  │ 🔟  Future Enhancements │ Ideas to extend the system         │
  └─────────────────────────┴────────────────────────────────────┘

  ---
  1️⃣  Overview

  This Inventory Management System (IMS) tracks products, suppliers, orders, and users.
  - Web UI: Login → Dashboard → CRUD pages.
  - Roles:
    - USER – can view items & create orders.
    - ADMIN – has all permissions plus admin‑only pages (reports, supplier management).

  - Domain‑driven: All business rules live in service/domain classes, not controllers.

  ---
  2️⃣  Architecture

  ┌──────────────────────────────────────────────┐
  │  Web Layer   (Spring MVC / Thymeleaf)        │
  │  ├── Controllers ──►  Service Layer         │
  │  │                                          │
  │  └──────────────────────────────────────────┘
  │  ┌──────────────────────────────────────────┐
  │  │  Service Layer (Business Logic)          │
  │  │  ├── Services                           │
  │  │  └── Domain Models (POJOs, DTOs)        │
  │  │                                          │
  │  └──────────────────────────────────────────┘
  │  ┌──────────────────────────────────────────┐
  │  │  Repository Layer (Spring Data JPA)      │
  │  │  ├── JpaRepository Interfaces           │
  │  │  └── Custom Queries                     │
  │  └──────────────────────────────────────────┘
  │  ┌──────────────────────────────────────────┐
  │  │  Security Layer (Spring Security)         │
  │  └──────────────────────────────────────────┘
  │  ┌──────────────────────────────────────────┐
  │  │  Persistence (MySQL/PostgreSQL)          │
  │  └──────────────────────────────────────────┘
  └──────────────────────────────────────────────┘

  Layer responsibilities

  ┌────────────┬─────────────────────────────────────────────────┐
  │   Layer    │                 Responsibility                  │
  ├────────────┼─────────────────────────────────────────────────┤
  │ Web        │ HTTP endpoints, view rendering, form validation │
  ├────────────┼─────────────────────────────────────────────────┤
  │ Service    │ Business rules, transaction boundaries          │
  ├────────────┼─────────────────────────────────────────────────┤
  │ Repository │ Data access, CRUD, custom queries               │
  ├────────────┼─────────────────────────────────────────────────┤
  │ Domain     │ Entities, value objects, DTOs                   │
  ├────────────┼─────────────────────────────────────────────────┤
  │ Security   │ Authentication, RBAC, password hashing          │
  └────────────┴─────────────────────────────────────────────────┘

  ---
  3️⃣  Features

  ┌─────────────────────────┬────────────────────────────────────────────────┬─────────────────────────────────────┐
  │         Feature         │                  Description                   │          OOP Concepts Used          │
  ├─────────────────────────┼────────────────────────────────────────────────┼─────────────────────────────────────┤
  │ User Authentication     │ JWT + Spring Security, password hashing with   │ User entity, UserDetailsService     │
  │                         │ BCrypt                                         │                                     │
  ├─────────────────────────┼────────────────────────────────────────────────┼─────────────────────────────────────┤
  │ Role‑Based Access       │ ADMIN vs USER                                  │ Role enum, @PreAuthorize            │
  │ Control                 │                                                │                                     │
  ├─────────────────────────┼────────────────────────────────────────────────┼─────────────────────────────────────┤
  │ Item CRUD               │ Add, edit, delete, view items                  │ Item entity, DAO pattern            │
  ├─────────────────────────┼────────────────────────────────────────────────┼─────────────────────────────────────┤
  │ Dashboard               │ Item counts, low‑stock alerts, sales stats     │ DashboardService                    │
  ├─────────────────────────┼────────────────────────────────────────────────┼─────────────────────────────────────┤
  │ Admin Page              │ Manage users, suppliers, view audit logs       │ AdminController, @Secured           │
  ├─────────────────────────┼────────────────────────────────────────────────┼─────────────────────────────────────┤
  │ Reports                 │ PDF / CSV exports of inventory, sales          │ ReportService                       │
  ├─────────────────────────┼────────────────────────────────────────────────┼─────────────────────────────────────┤
  │ Low‑Stock Alerts        │ Email/notification when quantity < threshold   │ Observer pattern via                │
  │                         │                                                │ InventoryObserver                   │
  ├─────────────────────────┼────────────────────────────────────────────────┼─────────────────────────────────────┤
  │ Supplier Management     │ CRUD suppliers, link to items                  │ Supplier entity                     │
  ├─────────────────────────┼────────────────────────────────────────────────┼─────────────────────────────────────┤
  │ Orders                  │ Create purchase/sales orders, track status     │ Order, OrderItem                    │
  ├─────────────────────────┼────────────────────────────────────────────────┼─────────────────────────────────────┤
  │ Search & Filter         │ Keyword, category, price range                 │ Specification pattern               │
  ├─────────────────────────┼────────────────────────────────────────────────┼─────────────────────────────────────┤
  │ Audit Trail             │ Log changes per entity                         │ AuditService, @EntityListener       │
  ├─────────────────────────┼────────────────────────────────────────────────┼─────────────────────────────────────┤
  │ Unit & Integration      │ @SpringBootTest, @DataJpaTest                  │ Test‑Driven Development             │
  │ Tests                   │                                                │                                     │
  └─────────────────────────┴────────────────────────────────────────────────┴─────────────────────────────────────┘


  Design Patterns

  ┌──────────────────┬────────────────────────────────────────────┬────────────────────────────┐
  │     Pattern      │              Where it appears              │            Why             │
  ├──────────────────┼────────────────────────────────────────────┼────────────────────────────┤
  │ DAO / Repository │ Spring Data JPA                            │ Persistence abstraction    │
  ├──────────────────┼────────────────────────────────────────────┼────────────────────────────┤
  │ Service Layer    │ InventoryService, OrderService             │ Business logic separation  │
  ├──────────────────┼────────────────────────────────────────────┼────────────────────────────┤
  │ Factory          │ UserFactory to create different user roles │ Decouple instantiation     │
  ├──────────────────┼────────────────────────────────────────────┼────────────────────────────┤
  │ Observer         │ InventoryObserver for stock alerts         │ Decoupled event handling   │
  ├──────────────────┼────────────────────────────────────────────┼────────────────────────────┤
  │ Specification    │ ItemSpecification for complex queries      │ Flexible filtering         │
  ├──────────────────┼────────────────────────────────────────────┼────────────────────────────┤
  │ Strategy         │ PaymentStrategy (if adding payment later)  │ Extensible payment methods │
  └──────────────────┴────────────────────────────────────────────┴────────────────────────────┘

  SOLID Principles in Play

  ┌───────────────────────┬──────────────────────────────────────────────────────────────────────────────────┐
  │       Principle       │                                     Example                                      │
  ├───────────────────────┼──────────────────────────────────────────────────────────────────────────────────┤
  │ Single Responsibility │ Each service handles one concern (inventory, orders, users)                      │
  ├───────────────────────┼──────────────────────────────────────────────────────────────────────────────────┤
  │ Open/Closed           │ New roles added via enums, no modification of existing code                      │
  ├───────────────────────┼──────────────────────────────────────────────────────────────────────────────────┤
  │ Liskov Substitution   │ User interface implemented by AdminUser & RegularUser                            │
  ├───────────────────────┼──────────────────────────────────────────────────────────────────────────────────┤
  │ Interface Segregation │ UserService only exposes user‑related methods                                    │
  ├───────────────────────┼──────────────────────────────────────────────────────────────────────────────────┤
  │ Dependency Inversion  │ Controllers depend on interfaces (InventoryService) not concrete implementations │
  └───────────────────────┴──────────────────────────────────────────────────────────────────────────────────┘

  ---
  5️⃣  Tech Stack

  ┌─────────────┬─────────────────────────────────────────────────┬──────────┐
  │    Layer    │                 Library / Tool                  │ Version  │
  ├─────────────┼─────────────────────────────────────────────────┼──────────┤
  │ Runtime     │ Java                                            │ 21       │
  ├─────────────┼─────────────────────────────────────────────────┼──────────┤
  │ Framework   │ Spring Boot                                     │ 3.3+     │
  ├─────────────┼─────────────────────────────────────────────────┼──────────┤
  │ Web         │ Spring MVC + Thymeleaf (or React + Spring REST) │          │
  ├─────────────┼─────────────────────────────────────────────────┼──────────┤
  │ Security    │ Spring Security, BCryptPasswordEncoder          │          │
  ├─────────────┼─────────────────────────────────────────────────┼──────────┤
  │ Persistence │ Spring Data JPA, Hibernate                      │          │
  ├─────────────┼─────────────────────────────────────────────────┼──────────┤
  │ DB          │ MySQL 8 / PostgreSQL 15                         │          │
  ├─────────────┼─────────────────────────────────────────────────┼──────────┤
  │ Build       │ Maven / Gradle                                  │          │
  ├─────────────┼─────────────────────────────────────────────────┼──────────┤
  │ Testing     │ JUnit 5, Mockito, SpringBootTest                │          │
  ├─────────────┼─────────────────────────────────────────────────┼──────────┤
  │ Container   │ Docker                                          │ Optional │
  ├─────────────┼─────────────────────────────────────────────────┼──────────┤
  │ CI/CD       │ GitHub Actions                                  │          │
  ├─────────────┼─────────────────────────────────────────────────┼──────────┤
  │ Docs        │ Markdown, PlantUML                              │          │
  └─────────────┴─────────────────────────────────────────────────┴──────────┘

  

  
  ---
  9️⃣  Testing

  ┌─────────────┬──────────────────────────────┬─────────────────────────────┐
  │  Test Type  │             Tool             │           Example           │
  ├─────────────┼──────────────────────────────┼─────────────────────────────┤
  │ Unit        │ JUnit 5 + Mockito            │ InventoryServiceTest        │
  ├─────────────┼──────────────────────────────┼─────────────────────────────┤
  │ Repository  │ @DataJpaTest                 │ Verify CRUD & queries       │
  ├─────────────┼──────────────────────────────┼─────────────────────────────┤
  │ Integration │ @SpringBootTest              │ End‑to‑end controller tests │
  ├─────────────┼──────────────────────────────┼─────────────────────────────┤
  │ UI          │ Selenium/WebDriver           │ Login + CRUD flows          │
  ├─────────────┼──────────────────────────────┼─────────────────────────────┤
  │ Security    │ MockMvc with SecurityContext │ Access control checks       │
  └─────────────┴──────────────────────────────┴─────────────────────────────┘

  Run all tests: mvn test (or ./gradlew test)

  ---
  🔟  Future Enhancements

  ┌────────────────────┬─────────────────────────────────────────────┐
  │        Idea        │                 Description                 │
  ├────────────────────┼─────────────────────────────────────────────┤
  │ REST API           │ Separate front‑end (React/Vue) → pure REST  │
  ├────────────────────┼─────────────────────────────────────────────┤
  │ Micro‑services     │ Split inventory, orders, auth into services │
  ├────────────────────┼─────────────────────────────────────────────┤
  │ GraphQL            │ Flexible queries for dashboards             │
  ├────────────────────┼─────────────────────────────────────────────┤
  │ Caching            │ Redis for hot data (stock counts)           │
  ├────────────────────┼─────────────────────────────────────────────┤
  │ WebSockets         │ Live inventory updates                      │
  ├────────────────────┼─────────────────────────────────────────────┤
  │ Mobile App         │ Spring Boot + Kotlin/Swift SDK              │
  ├────────────────────┼─────────────────────────────────────────────┤
  │ Barcode/QR Scanner │ Add item via barcode                        │
  ├────────────────────┼─────────────────────────────────────────────┤
  │ Role Hierarchy     │ MANAGER level                               │
  ├────────────────────┼─────────────────────────────────────────────┤
  │ Audit Logging      │ Kafka/Elasticsearch log analytics           │
  ├────────────────────┼─────────────────────────────────────────────┤
  │ Unit of Measure    │ Multi‑unit inventory                