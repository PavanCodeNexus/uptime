# UPTIME — Coding Standards

> **Version:** 1.0  
> **Project:** UPTIME — AI-Assisted On-Demand Technician Dispatch Platform  
> **Purpose:** Exact code templates, patterns, and examples for every layer.  
> **Read this alongside RULES.md before writing any code.**  

---

## Table of Contents

1. [Spring Boot — Module Template](#1-spring-boot--module-template)
2. [Spring Boot — Entity Template](#2-spring-boot--entity-template)
3. [Spring Boot — DTO Templates](#3-spring-boot--dto-templates)
4. [Spring Boot — Repository Template](#4-spring-boot--repository-template)
5. [Spring Boot — Service Template](#5-spring-boot--service-template)
6. [Spring Boot — Controller Template](#6-spring-boot--controller-template)
7. [Spring Boot — Exception Handling](#7-spring-boot--exception-handling)
8. [Spring Boot — MapStruct Mapper](#8-spring-boot--mapstruct-mapper)
9. [React — Component Template](#9-react--component-template)
10. [React — Page Template](#10-react--page-template)
11. [React — Service Template](#11-react--service-template)
12. [React — Hook Template](#12-react--hook-template)
13. [React — Redux Slice Template](#13-react--redux-slice-template)
14. [Flutter — Screen Template](#14-flutter--screen-template)
15. [Flutter — Widget Template](#15-flutter--widget-template)
16. [Flutter — Provider Template](#16-flutter--provider-template)
17. [Flutter — Service Template](#17-flutter--service-template)
18. [Flyway Migration Template](#18-flyway-migration-template)
19. [Test Templates](#19-test-templates)
20. [Common Patterns](#20-common-patterns)

---

## 1. Spring Boot — Module Template

Every new module follows this exact structure:

```
modules/{name}/
├── {Name}Controller.java
├── {Name}Service.java         ← interface
├── {Name}ServiceImpl.java     ← implementation
├── {Name}Repository.java
├── {Name}.java                ← entity
├── {Name}Mapper.java          ← MapStruct
└── dto/
    ├── {Name}DTO.java         ← response
    ├── {Name}CreateRequest.java ← POST request
    ├── {Name}UpdateRequest.java ← PUT request
    └── {Name}SummaryDTO.java  ← list item
```

---

## 2. Spring Boot — Entity Template

```java
// modules/example/Example.java

package com.uptime.modules.example;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "examples")
@SQLRestriction("deleted_at IS NULL")   // auto-filter soft deletes
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Example {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // ── Foreign Keys ─────────────────────────────────────
  @Column(name = "owner_id", nullable = false)
  private Long ownerId;

  @ManyToOne(fetch = FetchType.LAZY)    // ALWAYS lazy
  @JoinColumn(name = "owner_id",
    insertable = false, updatable = false)
  private User owner;

  // ── Core Fields ───────────────────────────────────────
  @Column(name = "name", nullable = false,
    length = 200)
  private String name;

  @Column(name = "status", nullable = false,
    length = 20)
  private String status = "ACTIVE";

  @Column(name = "amount",
    precision = 10, scale = 2)
  private BigDecimal amount;

  @Column(name = "metadata",
    columnDefinition = "jsonb")
  private String metadata;               // Store as JSON string

  // ── Audit Fields ──────────────────────────────────────
  @Column(name = "created_at",
    nullable = false, updatable = false)
  private Instant createdAt;

  @Column(name = "updated_at")
  private Instant updatedAt;

  @Column(name = "deleted_at")
  private Instant deletedAt;             // soft delete

  // ── Lifecycle Hooks ───────────────────────────────────
  @PrePersist
  protected void onCreate() {
    this.createdAt = Instant.now();
    this.updatedAt = Instant.now();
  }

  @PreUpdate
  protected void onUpdate() {
    this.updatedAt = Instant.now();
  }
}
```

---

## 3. Spring Boot — DTO Templates

### Response DTO

```java
// modules/example/dto/ExampleDTO.java

package com.uptime.modules.example.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExampleDTO {
  private Long    id;
  private Long    ownerId;
  private String  ownerName;          // from join
  private String  name;
  private String  status;
  private BigDecimal amount;
  private Instant createdAt;
  private Instant updatedAt;
}
```

### Create Request DTO

```java
// modules/example/dto/ExampleCreateRequest.java

package com.uptime.modules.example.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExampleCreateRequest {

  @NotBlank(message = "Name is required")
  @Size(min = 2, max = 200,
    message = "Name must be 2–200 characters")
  private String name;

  @NotNull(message = "Amount is required")
  @DecimalMin(value = "0.01",
    message = "Amount must be greater than 0")
  @DecimalMax(value = "999999.99",
    message = "Amount too large")
  private BigDecimal amount;

  @Pattern(
    regexp = "ACTIVE|INACTIVE",
    message = "Status must be ACTIVE or INACTIVE")
  private String status = "ACTIVE";
}
```

### Update Request DTO

```java
// modules/example/dto/ExampleUpdateRequest.java

package com.uptime.modules.example.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class ExampleUpdateRequest {

  // All fields optional for PATCH-style updates
  @Size(min = 2, max = 200)
  private String name;

  @DecimalMin("0.01")
  private BigDecimal amount;

  @Pattern(regexp = "ACTIVE|INACTIVE")
  private String status;
}
```

### Summary DTO (for lists)

```java
// modules/example/dto/ExampleSummaryDTO.java
// Lightweight — only fields needed for list view

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ExampleSummaryDTO {
  private Long   id;
  private String name;
  private String status;
  private Instant createdAt;
}
```

---

## 4. Spring Boot — Repository Template

```java
// modules/example/ExampleRepository.java

package com.uptime.modules.example;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.Instant;
import java.util.Optional;

@Repository
public interface ExampleRepository
    extends JpaRepository<Example, Long> {

  // ── Simple Queries (method names) ────────────────────

  // Finds by owner — @SQLRestriction handles deleted_at
  Page<Example> findByOwnerId(
    Long ownerId, Pageable pageable);

  Optional<Example> findByIdAndOwnerId(
    Long id, Long ownerId);

  boolean existsByNameAndOwnerId(
    String name, Long ownerId);

  long countByOwnerIdAndStatus(
    Long ownerId, String status);

  // ── Custom JPQL Queries ───────────────────────────────

  @Query("""
    SELECT e FROM Example e
    WHERE e.ownerId = :ownerId
      AND (:status IS NULL OR e.status = :status)
      AND (:from IS NULL OR e.createdAt >= :from)
      AND (:to   IS NULL OR e.createdAt <= :to)
    ORDER BY e.createdAt DESC
    """)
  Page<Example> findByOwnerWithFilters(
    @Param("ownerId") Long ownerId,
    @Param("status")  String status,
    @Param("from")    Instant from,
    @Param("to")      Instant to,
    Pageable pageable
  );

  // ── Soft Delete ───────────────────────────────────────

  @Modifying
  @Query("UPDATE Example e SET e.deletedAt = :now " +
         "WHERE e.id = :id AND e.ownerId = :ownerId")
  int softDelete(
    @Param("id")      Long id,
    @Param("ownerId") Long ownerId,
    @Param("now")     Instant now
  );

  // ── Projection for lists (no lazy-load issues) ────────

  @Query("""
    SELECT new com.uptime.modules.example.dto.ExampleSummaryDTO(
      e.id, e.name, e.status, e.createdAt)
    FROM Example e
    WHERE e.ownerId = :ownerId
    ORDER BY e.createdAt DESC
    """)
  Page<ExampleSummaryDTO> findSummariesByOwner(
    @Param("ownerId") Long ownerId,
    Pageable pageable
  );
}
```

---

## 5. Spring Boot — Service Template

```java
// modules/example/ExampleService.java (Interface)

package com.uptime.modules.example;

import com.uptime.modules.example.dto.*;
import com.uptime.common.response.PagedResponse;
import org.springframework.data.domain.Pageable;

public interface ExampleService {
  ExampleDTO      create(Long ownerId, ExampleCreateRequest req);
  ExampleDTO      getById(Long id, Long ownerId);
  PagedResponse<ExampleSummaryDTO> getAll(
    Long ownerId, String status, Pageable pageable);
  ExampleDTO      update(Long id, Long ownerId,
                         ExampleUpdateRequest req);
  void            delete(Long id, Long ownerId);
}
```

```java
// modules/example/ExampleServiceImpl.java

package com.uptime.modules.example;

import com.uptime.common.exceptions.*;
import com.uptime.common.response.PagedResponse;
import com.uptime.modules.example.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExampleServiceImpl implements ExampleService {

  private final ExampleRepository exampleRepo;
  private final ExampleMapper     exampleMapper;
  // Inject other services if needed:
  // private final NotificationService notificationService;

  // ── CREATE ────────────────────────────────────────────

  @Override
  @Transactional
  public ExampleDTO create(Long ownerId,
      ExampleCreateRequest req) {

    log.debug("Creating example for owner: {}", ownerId);

    // 1. Business rule validation
    if (exampleRepo.existsByNameAndOwnerId(
        req.getName(), ownerId)) {
      throw new BusinessRuleException("VAL_001",
        "An example with this name already exists");
    }

    // 2. Build entity
    Example example = Example.builder()
      .ownerId(ownerId)
      .name(req.getName().trim())
      .amount(req.getAmount())
      .status(req.getStatus() != null
        ? req.getStatus() : "ACTIVE")
      .build();

    // 3. Save
    example = exampleRepo.save(example);
    log.info("Created example id={} for owner={}",
      example.getId(), ownerId);

    // 4. Side effects (async — don't block response)
    // notificationService.sendAsync(...);

    // 5. Return DTO (never raw entity)
    return exampleMapper.toDTO(example);
  }

  // ── READ ──────────────────────────────────────────────

  @Override
  @Transactional(readOnly = true)
  @Cacheable(value = "example",
    key = "'ex:' + #id + ':' + #ownerId")
  public ExampleDTO getById(Long id, Long ownerId) {
    log.debug("Fetching example id={}", id);

    Example example = exampleRepo
      .findByIdAndOwnerId(id, ownerId)
      .orElseThrow(() -> new ResourceNotFoundException(
        "RES_001", "Example not found: " + id));

    return exampleMapper.toDTO(example);
  }

  @Override
  @Transactional(readOnly = true)
  public PagedResponse<ExampleSummaryDTO> getAll(
      Long ownerId, String status, Pageable pageable) {

    Page<ExampleSummaryDTO> page =
      exampleRepo.findSummariesByOwner(ownerId, pageable);

    return PagedResponse.of(page);
  }

  // ── UPDATE ────────────────────────────────────────────

  @Override
  @Transactional
  @CacheEvict(value = "example",
    key = "'ex:' + #id + ':' + #ownerId")
  public ExampleDTO update(Long id, Long ownerId,
      ExampleUpdateRequest req) {

    Example example = exampleRepo
      .findByIdAndOwnerId(id, ownerId)
      .orElseThrow(() -> new ResourceNotFoundException(
        "RES_001", "Example not found: " + id));

    // Only update provided fields (partial update)
    if (req.getName()   != null) example.setName(req.getName().trim());
    if (req.getAmount() != null) example.setAmount(req.getAmount());
    if (req.getStatus() != null) example.setStatus(req.getStatus());

    example = exampleRepo.save(example);
    log.info("Updated example id={}", id);

    return exampleMapper.toDTO(example);
  }

  // ── DELETE ────────────────────────────────────────────

  @Override
  @Transactional
  @CacheEvict(value = "example",
    key = "'ex:' + #id + ':' + #ownerId")
  public void delete(Long id, Long ownerId) {
    int rows = exampleRepo.softDelete(
      id, ownerId, Instant.now());

    if (rows == 0)
      throw new ResourceNotFoundException(
        "RES_001", "Example not found: " + id);

    log.info("Soft-deleted example id={}", id);
  }
}
```

---

## 6. Spring Boot — Controller Template

```java
// modules/example/ExampleController.java

package com.uptime.modules.example;

import com.uptime.common.response.*;
import com.uptime.modules.example.dto.*;
import com.uptime.security.CurrentUser;
import io.swagger.v3.oas.annotations.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/examples")
@RequiredArgsConstructor
@Tag(name = "Examples", description = "Example resource management")
public class ExampleController {

  private final ExampleService exampleService;

  // ── CREATE ────────────────────────────────────────────

  @Operation(summary = "Create new example")
  @ApiResponse(responseCode = "201",
    description = "Example created successfully")
  @PostMapping
  @PreAuthorize("hasRole('OWNER')")
  public ResponseEntity<ApiResponse<ExampleDTO>> create(
      @Valid @RequestBody ExampleCreateRequest request,
      @CurrentUser Long ownerId) {

    ExampleDTO dto = exampleService.create(ownerId, request);
    return ResponseEntity
      .status(HttpStatus.CREATED)
      .body(ApiResponse.success(dto,
        "Example created successfully"));
  }

  // ── READ LIST ─────────────────────────────────────────

  @Operation(summary = "Get all examples")
  @GetMapping
  @PreAuthorize("hasRole('OWNER')")
  public ResponseEntity<ApiResponse<PagedResponse<ExampleSummaryDTO>>>
      getAll(
      @RequestParam(required = false) String status,
      @ParameterObject
      @PageableDefault(size = 20, sort = "createdAt",
        direction = Sort.Direction.DESC)
      Pageable pageable,
      @CurrentUser Long ownerId) {

    PagedResponse<ExampleSummaryDTO> result =
      exampleService.getAll(ownerId, status, pageable);
    return ResponseEntity.ok(ApiResponse.success(result));
  }

  // ── READ ONE ──────────────────────────────────────────

  @Operation(summary = "Get example by ID")
  @GetMapping("/{id}")
  @PreAuthorize("hasRole('OWNER')")
  public ResponseEntity<ApiResponse<ExampleDTO>> getById(
      @PathVariable Long id,
      @CurrentUser Long ownerId) {

    ExampleDTO dto = exampleService.getById(id, ownerId);
    return ResponseEntity.ok(ApiResponse.success(dto));
  }

  // ── UPDATE ────────────────────────────────────────────

  @Operation(summary = "Update example")
  @PutMapping("/{id}")
  @PreAuthorize("hasRole('OWNER')")
  public ResponseEntity<ApiResponse<ExampleDTO>> update(
      @PathVariable Long id,
      @Valid @RequestBody ExampleUpdateRequest request,
      @CurrentUser Long ownerId) {

    ExampleDTO dto =
      exampleService.update(id, ownerId, request);
    return ResponseEntity.ok(
      ApiResponse.success(dto, "Updated successfully"));
  }

  // ── DELETE ────────────────────────────────────────────

  @Operation(summary = "Delete example")
  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('OWNER')")
  public ResponseEntity<ApiResponse<Void>> delete(
      @PathVariable Long id,
      @CurrentUser Long ownerId) {

    exampleService.delete(id, ownerId);
    return ResponseEntity
      .ok(ApiResponse.success(null, "Deleted successfully"));
  }
}
```

---

## 7. Spring Boot — Exception Handling

```java
// common/exceptions/ResourceNotFoundException.java
public class ResourceNotFoundException
    extends RuntimeException {
  private final String errorCode;

  public ResourceNotFoundException(
      String errorCode, String message) {
    super(message);
    this.errorCode = errorCode;
  }
  public String getErrorCode() { return errorCode; }
}

// common/exceptions/BusinessRuleException.java
public class BusinessRuleException
    extends RuntimeException {
  private final String errorCode;
  // same pattern as above
}

// common/exceptions/GlobalExceptionHandler.java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ApiResponse<?>>
      handleNotFound(ResourceNotFoundException ex) {
    return ResponseEntity
      .status(HttpStatus.NOT_FOUND)
      .body(ApiResponse.error(
        ex.getErrorCode(), ex.getMessage()));
  }

  @ExceptionHandler(BusinessRuleException.class)
  public ResponseEntity<ApiResponse<?>>
      handleBusinessRule(BusinessRuleException ex) {
    return ResponseEntity
      .status(HttpStatus.UNPROCESSABLE_ENTITY)
      .body(ApiResponse.error(
        ex.getErrorCode(), ex.getMessage()));
  }

  @ExceptionHandler(
    MethodArgumentNotValidException.class)
  public ResponseEntity<ApiResponse<?>>
      handleValidation(
      MethodArgumentNotValidException ex) {
    Map<String, String> errors = new LinkedHashMap<>();
    ex.getBindingResult().getFieldErrors()
      .forEach(e -> errors.put(
        e.getField(), e.getDefaultMessage()));
    return ResponseEntity
      .status(HttpStatus.BAD_REQUEST)
      .body(ApiResponse.validationError(errors));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiResponse<?>>
      handleAll(Exception ex) {
    log.error("Unexpected error: {}", ex.getMessage(), ex);
    return ResponseEntity
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .body(ApiResponse.error("SERVER_001",
        "An unexpected error occurred"));
  }
}

// common/response/ApiResponse.java
@Getter
@AllArgsConstructor
public class ApiResponse<T> {
  private boolean success;
  private T       data;
  private String  message;
  private Object  error;
  private Instant timestamp = Instant.now();

  public static <T> ApiResponse<T> success(T data) {
    return new ApiResponse<>(true, data, "OK", null);
  }
  public static <T> ApiResponse<T> success(
      T data, String message) {
    return new ApiResponse<>(true, data, message, null);
  }
  public static <T> ApiResponse<T> error(
      String code, String message) {
    Map<String,String> err = Map.of(
      "code", code, "message", message);
    return new ApiResponse<>(false, null, null, err);
  }
  public static <T> ApiResponse<T> validationError(
      Map<String,String> details) {
    Map<String,Object> err = Map.of(
      "code", "VAL_001",
      "message", "Validation failed",
      "details", details);
    return new ApiResponse<>(false, null, null, err);
  }
}
```

---

## 8. Spring Boot — MapStruct Mapper

```java
// modules/example/ExampleMapper.java

package com.uptime.modules.example;

import com.uptime.modules.example.dto.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring",
  nullValuePropertyMappingStrategy =
    NullValuePropertyMappingStrategy.IGNORE)
public interface ExampleMapper {

  // Basic mapping (auto-maps same-name fields)
  ExampleDTO toDTO(Example example);

  // Summary mapping
  ExampleSummaryDTO toSummaryDTO(Example example);

  // List mapping
  List<ExampleDTO> toDTOList(List<Example> examples);

  // Custom field mapping
  @Mapping(target = "ownerName",
    source = "owner.fullName")
  @Mapping(target = "id",    source = "id")
  @Mapping(target = "status", source = "status")
  ExampleDTO toDTOWithOwner(Example example);

  // Ignore fields when mapping request to entity
  @Mapping(target = "id",        ignore = true)
  @Mapping(target = "ownerId",   ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "deletedAt", ignore = true)
  Example fromCreateRequest(ExampleCreateRequest req);

  // Update existing entity (partial update)
  @BeanMapping(nullValuePropertyMappingStrategy =
    NullValuePropertyMappingStrategy.IGNORE)
  void updateEntityFromRequest(
    ExampleUpdateRequest req,
    @MappingTarget Example example);
}
```

---

## 9. React — Component Template

```tsx
// components/example/ExampleCard.tsx

import { type FC } from 'react';
import { MapPin, Clock, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ExampleDTO } from '@/types/example.types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

// ── Props Interface ───────────────────────────────────
interface ExampleCardProps {
  example: ExampleDTO;
  onSelect?: (id: number) => void;
  isLoading?: boolean;
  className?: string;
}

// ── Component ─────────────────────────────────────────
const ExampleCard: FC<ExampleCardProps> = ({
  example,
  onSelect,
  isLoading = false,
  className = '',
}) => {
  const { t } = useTranslation();

  // ── Handlers ────────────────────────────────────────
  const handleSelect = () => {
    if (onSelect) onSelect(example.id);
  };

  // ── Render ──────────────────────────────────────────
  return (
    <Card
      className={`
        p-4 cursor-pointer
        transition-all duration-200
        hover:shadow-md hover:scale-[1.01]
        active:scale-[0.99]
        ${className}
      `}
      onClick={handleSelect}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base font-semibold
            text-brand-blue-700">
            {example.name}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {example.ownerName}
          </p>
        </div>
        <Badge
          className={getStatusColor(example.status)}
        >
          {t(`status.${example.status}`)}
        </Badge>
      </div>

      {/* Details */}
      <div className="flex items-center gap-4
        text-sm text-gray-600">
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {formatDate(example.createdAt)}
        </span>
        <span className="font-semibold text-brand-blue-700">
          {formatCurrency(example.amount)}
        </span>
      </div>

      {/* Action */}
      {onSelect && (
        <Button
          className="w-full mt-3"
          size="sm"
          disabled={isLoading}
          onClick={(e) => {
            e.stopPropagation();
            handleSelect();
          }}
        >
          {isLoading
            ? t('common.loading')
            : t('common.select')}
        </Button>
      )}
    </Card>
  );
};

// ── Helpers ───────────────────────────────────────────
const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    ACTIVE:   'bg-green-100 text-green-700',
    INACTIVE: 'bg-gray-100 text-gray-600',
    PENDING:  'bg-amber-100 text-amber-700',
  };
  return colors[status] ?? 'bg-gray-100 text-gray-600';
};

export default ExampleCard;
```

---

## 10. React — Page Template

```tsx
// pages/ExamplePage.tsx

import { useState } from 'react';
import { useQuery, useMutation,
  useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import ExampleCard from '@/components/example/ExampleCard';
import ExampleCardSkeleton from
  '@/components/example/ExampleCardSkeleton';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import exampleService from '@/services/exampleService';

const ExamplePage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // ── Local State ───────────────────────────────────
  const [showCreateModal, setShowCreateModal] =
    useState(false);

  // ── Server State (React Query) ────────────────────
  const {
    data: examples,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['examples'],
    queryFn: () => exampleService.getAll(),
    staleTime: 5 * 60 * 1000,          // 5 minutes
  });

  // ── Mutations ─────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      exampleService.delete(id),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ['examples'] });
      toast.success(t('example.deleteSuccess'));
    },
    onError: () => {
      toast.error(t('errors.server'));
    },
  });

  // ── Handlers ──────────────────────────────────────
  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  // ── Loading State ─────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <ExampleCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // ── Error State ───────────────────────────────────
  if (isError) {
    return (
      <ErrorState
        message={t('errors.server')}
        onRetry={refetch}
      />
    );
  }

  // ── Empty State ───────────────────────────────────
  if (!examples?.length) {
    return (
      <EmptyState
        title={t('example.empty.title')}
        description={t('example.empty.description')}
        action={
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {t('example.create')}
          </Button>
        }
      />
    );
  }

  // ── Main Render ───────────────────────────────────
  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-heading-1 font-bold
          text-brand-blue-700">
          {t('example.title')}
        </h1>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t('example.create')}
        </Button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {examples.map(example => (
          <ExampleCard
            key={example.id}
            example={example}
            onSelect={handleDelete}
          />
        ))}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateExampleModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            queryClient.invalidateQueries({
              queryKey: ['examples'] });
          }}
        />
      )}
    </div>
  );
};

export default ExamplePage;
```

---

## 11. React — Service Template

```typescript
// services/exampleService.ts

import api from '@/lib/axios';
import type {
  ExampleDTO,
  ExampleSummaryDTO,
  ExampleCreateRequest,
  ExampleUpdateRequest,
} from '@/types/example.types';
import type { PagedResponse } from '@/types/api.types';

const BASE = '/examples';

const exampleService = {

  // ── GET ALL ─────────────────────────────────────────
  async getAll(params?: {
    status?: string;
    page?: number;
    size?: number;
  }): Promise<PagedResponse<ExampleSummaryDTO>> {
    const res = await api.get<{
      data: PagedResponse<ExampleSummaryDTO>
    }>(BASE, { params });
    return res.data.data;
  },

  // ── GET ONE ─────────────────────────────────────────
  async getById(id: number): Promise<ExampleDTO> {
    const res = await api.get<{ data: ExampleDTO }>(
      `${BASE}/${id}`);
    return res.data.data;
  },

  // ── CREATE ──────────────────────────────────────────
  async create(
    body: ExampleCreateRequest
  ): Promise<ExampleDTO> {
    const res = await api.post<{ data: ExampleDTO }>(
      BASE, body);
    return res.data.data;
  },

  // ── UPDATE ──────────────────────────────────────────
  async update(
    id: number,
    body: ExampleUpdateRequest
  ): Promise<ExampleDTO> {
    const res = await api.put<{ data: ExampleDTO }>(
      `${BASE}/${id}`, body);
    return res.data.data;
  },

  // ── DELETE ──────────────────────────────────────────
  async delete(id: number): Promise<void> {
    await api.delete(`${BASE}/${id}`);
  },

  // ── FILE UPLOAD ─────────────────────────────────────
  async uploadPhoto(
    id: number,
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<{ photoUrl: string }> {
    const form = new FormData();
    form.append('file', file);

    const res = await api.post<{ data: { photoUrl: string }}>(
      `${BASE}/${id}/photo`,
      form,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (onProgress && event.total) {
            onProgress(
              Math.round((event.loaded * 100) / event.total)
            );
          }
        },
      }
    );
    return res.data.data;
  },
};

export default exampleService;
```

---

## 12. React — Hook Template

```typescript
// hooks/useExample.ts

import { useQuery, useMutation,
  useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import exampleService from '@/services/exampleService';
import type { ExampleCreateRequest } from
  '@/types/example.types';

// ── Query Keys ────────────────────────────────────────
export const exampleKeys = {
  all:    ['examples'] as const,
  lists:  () => [...exampleKeys.all, 'list'] as const,
  detail: (id: number) =>
    [...exampleKeys.all, id] as const,
};

// ── Hook ──────────────────────────────────────────────
export const useExample = (id?: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  // Fetch list
  const list = useQuery({
    queryKey: exampleKeys.lists(),
    queryFn:  () => exampleService.getAll(),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch single
  const detail = useQuery({
    queryKey: exampleKeys.detail(id!),
    queryFn:  () => exampleService.getById(id!),
    enabled:  !!id,
  });

  // Create mutation
  const create = useMutation({
    mutationFn: (req: ExampleCreateRequest) =>
      exampleService.create(req),
    onSuccess: (newItem) => {
      // Add to cache immediately (optimistic)
      queryClient.setQueryData(
        exampleKeys.lists(),
        (old: any) => old
          ? { ...old, content: [newItem, ...old.content] }
          : old
      );
      queryClient.invalidateQueries({
        queryKey: exampleKeys.lists() });
      toast.success(t('example.createSuccess'));
    },
    onError: () => {
      toast.error(t('errors.server'));
    },
  });

  // Delete mutation
  const remove = useMutation({
    mutationFn: (id: number) =>
      exampleService.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(
        exampleKeys.lists(),
        (old: any) => old ? {
          ...old,
          content: old.content.filter(
            (e: any) => e.id !== deletedId)
        } : old
      );
      toast.success(t('example.deleteSuccess'));
    },
  });

  return { list, detail, create, remove };
};
```

---

## 13. React — Redux Slice Template

```typescript
// store/exampleSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';

// ── State Type ────────────────────────────────────────
interface ExampleState {
  selectedId:   number | null;
  filterStatus: string | null;
  isModalOpen:  boolean;
}

// ── Initial State ─────────────────────────────────────
const initialState: ExampleState = {
  selectedId:   null,
  filterStatus: null,
  isModalOpen:  false,
};

// ── Slice ─────────────────────────────────────────────
const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    setSelectedId: (state,
        action: PayloadAction<number | null>) => {
      state.selectedId = action.payload;
    },
    setFilterStatus: (state,
        action: PayloadAction<string | null>) => {
      state.filterStatus = action.payload;
    },
    openModal:  (state) => { state.isModalOpen = true; },
    closeModal: (state) => { state.isModalOpen = false; },
    reset: () => initialState,
  },
});

// ── Actions ───────────────────────────────────────────
export const {
  setSelectedId,
  setFilterStatus,
  openModal,
  closeModal,
  reset,
} = exampleSlice.actions;

// ── Selectors ─────────────────────────────────────────
export const selectSelectedId = (state: RootState) =>
  state.example.selectedId;
export const selectIsModalOpen = (state: RootState) =>
  state.example.isModalOpen;

export default exampleSlice.reducer;
```

---

## 14. Flutter — Screen Template

```dart
// features/example/screens/example_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/example_provider.dart';
import '../widgets/example_card.dart';
import '../../../shared/widgets/loading_shimmer.dart';
import '../../../shared/widgets/empty_state_widget.dart';
import '../../../shared/widgets/error_widget.dart';

class ExampleScreen extends ConsumerWidget {
  const ExampleScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Watch the provider
    final examplesAsync = ref.watch(exampleListProvider);

    return Scaffold(
      backgroundColor:
        Theme.of(context).colorScheme.background,

      // ── App Bar ─────────────────────────────────────
      appBar: AppBar(
        title: const Text('Examples'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () =>
              context.push('/examples/create'),
          ),
        ],
      ),

      // ── Body ────────────────────────────────────────
      body: examplesAsync.when(

        // Loading state
        loading: () => const LoadingShimmer(
          itemCount: 5),

        // Error state
        error: (err, stack) => UptimeErrorWidget(
          message: err.toString(),
          onRetry: () => ref.refresh(
            exampleListProvider),
        ),

        // Data state
        data: (examples) {
          if (examples.isEmpty) {
            return EmptyStateWidget(
              title: 'No examples yet',
              description: 'Tap + to create one',
              lottieAsset:
                'assets/animations/empty_state.json',
              actionLabel: 'Create Example',
              onAction: () =>
                context.push('/examples/create'),
            );
          }

          return RefreshIndicator(
            color: Theme.of(context).colorScheme.secondary,
            onRefresh: () async =>
              ref.refresh(exampleListProvider),
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: examples.length,
              itemBuilder: (ctx, i) => ExampleCard(
                example: examples[i],
                onTap: () => context.push(
                  '/examples/${examples[i].id}'),
              ),
            ),
          );
        },
      ),
    );
  }
}
```

---

## 15. Flutter — Widget Template

```dart
// features/example/widgets/example_card.dart

import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../core/config/theme.dart';
import '../models/example_dto.dart';

class ExampleCard extends StatelessWidget {
  final ExampleDTO example;
  final VoidCallback? onTap;
  final VoidCallback? onLongPress;

  const ExampleCard({
    super.key,
    required this.example,
    this.onTap,
    this.onLongPress,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return GestureDetector(
      onTap: onTap,
      onLongPress: onLongPress,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: theme.cardColor,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.06),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              // ── Photo ──────────────────────────────
              if (example.photoUrl != null)
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: CachedNetworkImage(
                    imageUrl: example.photoUrl!,
                    width: 56,
                    height: 56,
                    fit: BoxFit.cover,
                    placeholder: (ctx, url) =>
                      Container(
                        width: 56, height: 56,
                        color: UptimeTheme.gray100,
                      ),
                    errorWidget: (ctx, url, err) =>
                      const Icon(Icons.image_not_supported,
                        size: 24,
                        color: UptimeTheme.gray500),
                  ),
                ),

              const SizedBox(width: 12),

              // ── Content ────────────────────────────
              Expanded(
                child: Column(
                  crossAxisAlignment:
                    CrossAxisAlignment.start,
                  children: [
                    // Name
                    Text(
                      example.name,
                      style: theme.textTheme.titleLarge,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    // Status
                    _StatusBadge(status: example.status),
                  ],
                ),
              ),

              // ── Amount ─────────────────────────────
              Text(
                '₹${example.amount.toStringAsFixed(0)}',
                style: theme.textTheme.titleLarge
                  ?.copyWith(
                    color: UptimeTheme.blue700,
                    fontWeight: FontWeight.w700,
                  ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Sub-widget ─────────────────────────────────────────
class _StatusBadge extends StatelessWidget {
  final String status;
  const _StatusBadge({required this.status});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: _bgColor,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        status,
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w600,
          color: _textColor,
        ),
      ),
    );
  }

  Color get _bgColor => switch (status) {
    'ACTIVE'    => UptimeTheme.teal500.withOpacity(0.15),
    'INACTIVE'  => UptimeTheme.gray100,
    'PENDING'   => Colors.amber.withOpacity(0.15),
    _           => UptimeTheme.gray100,
  };

  Color get _textColor => switch (status) {
    'ACTIVE'    => UptimeTheme.teal600,
    'INACTIVE'  => UptimeTheme.gray500,
    'PENDING'   => Colors.amber.shade800,
    _           => UptimeTheme.gray500,
  };
}
```

---

## 16. Flutter — Riverpod Provider Template

`dart
// features/example/providers/example_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/example_dto.dart';
import '../services/example_service.dart';

// ── Service provider ──────────────────────────────────
final exampleServiceProvider = Provider<ExampleService>(
  (ref) => ExampleService(ref.read(dioClientProvider)),
);

// ── Read-only List provider (FutureProvider) ──────────
final exampleListProvider =
    FutureProvider.autoDispose<List<ExampleDTO>>(
  (ref) async {
    final service = ref.watch(exampleServiceProvider);
    return service.getAll();
  },
);

// ── Read-only Single item provider (family) ───────────
final exampleDetailProvider = FutureProvider
    .autoDispose
    .family<ExampleDTO, int>(
  (ref, id) async {
    final service = ref.watch(exampleServiceProvider);
    return service.getById(id);
  },
);

// ── Complex Async State Notifier (AsyncNotifierProvider) ──
// Manual implementation without code generation / build_runner
class ExampleListNotifier
    extends AutoDisposeAsyncNotifier<List<ExampleDTO>> {
  @override
  Future<List<ExampleDTO>> build() async {
    final service = ref.watch(exampleServiceProvider);
    return service.getAll();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final service = ref.read(exampleServiceProvider);
      return service.getAll();
    });
  }

  Future<void> addItem(ExampleDTO item) async {
    final previousState = state;
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final service = ref.read(exampleServiceProvider);
      await service.create(item);
      final currentList = previousState.valueOrNull ?? [];
      return [...currentList, item];
    });
  }

  Future<void> deleteItem(int id) async {
    final previousState = state;
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final service = ref.read(exampleServiceProvider);
      await service.delete(id);
      final currentList = previousState.valueOrNull ?? [];
      return currentList.where((element) => element.id != id).toList();
    });
  }
}

// ── Provider registration for AsyncNotifier ───────────
final exampleNotifierProvider = AsyncNotifierProvider.autoDispose<
    ExampleListNotifier, List<ExampleDTO>>(
  ExampleListNotifier.new,
);
`

---

## 17. Flutter — Service Template

```dart
// features/example/services/example_service.dart

import 'package:dio/dio.dart';
import '../models/example_dto.dart';
import '../../../core/network/dio_client.dart';

class ExampleService {
  final Dio _dio;
  static const _base = '/examples';

  const ExampleService(this._dio);

  // ── GET ALL ───────────────────────────────────────
  Future<List<ExampleDTO>> getAll({
    String? status,
    int page = 0,
    int size = 20,
  }) async {
    final res = await _dio.get(_base,
      queryParameters: {
        if (status != null) 'status': status,
        'page': page,
        'size': size,
      });
    final List data = res.data['data']['content'];
    return data.map((e) => ExampleDTO.fromJson(e)).toList();
  }

  // ── GET ONE ───────────────────────────────────────
  Future<ExampleDTO> getById(int id) async {
    final res = await _dio.get('$_base/$id');
    return ExampleDTO.fromJson(res.data['data']);
  }

  // ── CREATE ────────────────────────────────────────
  Future<ExampleDTO> create(
      Map<String, dynamic> body) async {
    final res = await _dio.post(_base, data: body);
    return ExampleDTO.fromJson(res.data['data']);
  }

  // ── UPDATE ────────────────────────────────────────
  Future<ExampleDTO> update(
      int id, Map<String, dynamic> body) async {
    final res = await _dio.put('$_base/$id', data: body);
    return ExampleDTO.fromJson(res.data['data']);
  }

  // ── DELETE ────────────────────────────────────────
  Future<void> delete(int id) async {
    await _dio.delete('$_base/$id');
  }

  // ── FILE UPLOAD ───────────────────────────────────
  Future<String> uploadPhoto(
      int id, String filePath) async {
    final form = FormData.fromMap({
      'file': await MultipartFile.fromFile(
        filePath,
        filename: 'photo.jpg',
      ),
    });
    final res = await _dio.post(
      '$_base/$id/photo',
      data: form,
      options: Options(
        contentType: 'multipart/form-data'),
    );
    return res.data['data']['photoUrl'] as String;
  }
}
```

---

## 18. Flyway Migration Template

```sql
-- V18__add_example_table.sql
-- Description: Create examples table for example module
-- Author: Member 2
-- Date: 2026-10-13

-- ── Create table ──────────────────────────────────────
CREATE TABLE examples (
  id           BIGSERIAL     PRIMARY KEY,
  owner_id     BIGINT        NOT NULL
               REFERENCES users(id)
               ON DELETE RESTRICT,
  name         VARCHAR(200)  NOT NULL,
  status       VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE',
  amount       DECIMAL(10,2),
  metadata     JSONB         DEFAULT '{}',
  notes        TEXT,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ,
  deleted_at   TIMESTAMPTZ              -- soft delete
);

-- ── Comments ──────────────────────────────────────────
COMMENT ON TABLE examples IS
  'Example records owned by users';
COMMENT ON COLUMN examples.status IS
  'ACTIVE | INACTIVE | PENDING';
COMMENT ON COLUMN examples.deleted_at IS
  'NULL = active, NOT NULL = soft deleted';

-- ── Indexes ───────────────────────────────────────────
-- FK indexes (always required)
CREATE INDEX idx_examples_owner_id
  ON examples(owner_id);

-- Query-specific indexes
CREATE INDEX idx_examples_status
  ON examples(status)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_examples_created_at
  ON examples(created_at DESC)
  WHERE deleted_at IS NULL;

-- Composite for common query pattern
CREATE INDEX idx_examples_owner_status
  ON examples(owner_id, status)
  WHERE deleted_at IS NULL;

-- ── Verify ────────────────────────────────────────────
-- These lines are comments only — for human verification
-- Table: examples ✓
-- FK: owner_id → users.id ✓
-- Soft delete: deleted_at ✓
-- Indexes: owner_id, status, created_at ✓
```

---

## 19. Test Templates

### Spring Boot Unit Test

```java
// test/modules/example/ExampleServiceTest.java

package com.uptime.modules.example;

import com.uptime.common.exceptions.ResourceNotFoundException;
import com.uptime.modules.example.dto.*;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ExampleService Tests")
class ExampleServiceTest {

  @Mock    ExampleRepository exampleRepo;
  @Mock    ExampleMapper     exampleMapper;
  @InjectMocks ExampleServiceImpl service;

  private Example  sampleExample;
  private ExampleDTO sampleDTO;

  @BeforeEach
  void setUp() {
    sampleExample = Example.builder()
      .id(1L)
      .ownerId(100L)
      .name("Test Example")
      .status("ACTIVE")
      .amount(new BigDecimal("500.00"))
      .build();

    sampleDTO = ExampleDTO.builder()
      .id(1L)
      .name("Test Example")
      .status("ACTIVE")
      .amount(new BigDecimal("500.00"))
      .build();
  }

  @Test
  @DisplayName("Should create example successfully")
  void create_shouldSucceed_whenValidRequest() {
    // Arrange
    ExampleCreateRequest req = new ExampleCreateRequest();
    req.setName("Test Example");
    req.setAmount(new BigDecimal("500.00"));

    when(exampleRepo.existsByNameAndOwnerId(
      any(), any())).thenReturn(false);
    when(exampleRepo.save(any())).thenReturn(sampleExample);
    when(exampleMapper.toDTO(any())).thenReturn(sampleDTO);

    // Act
    ExampleDTO result = service.create(100L, req);

    // Assert
    assertThat(result).isNotNull();
    assertThat(result.getName()).isEqualTo("Test Example");
    verify(exampleRepo, times(1)).save(any());
  }

  @Test
  @DisplayName("Should throw when duplicate name")
  void create_shouldThrow_whenNameAlreadyExists() {
    // Arrange
    ExampleCreateRequest req = new ExampleCreateRequest();
    req.setName("Existing Name");
    req.setAmount(BigDecimal.TEN);

    when(exampleRepo.existsByNameAndOwnerId(
      any(), any())).thenReturn(true);

    // Act + Assert
    assertThatThrownBy(
      () -> service.create(100L, req))
      .isInstanceOf(BusinessRuleException.class)
      .hasMessageContaining("already exists");

    verify(exampleRepo, never()).save(any());
  }

  @Test
  @DisplayName("Should throw 404 when not found")
  void getById_shouldThrow_whenNotFound() {
    when(exampleRepo.findByIdAndOwnerId(
      any(), any())).thenReturn(Optional.empty());

    assertThatThrownBy(
      () -> service.getById(999L, 100L))
      .isInstanceOf(ResourceNotFoundException.class);
  }
}
```

### React Component Test

```tsx
// __tests__/ExampleCard.test.tsx

import { render, screen, fireEvent }
  from '@testing-library/react';
import { describe, it, expect, vi }
  from 'vitest';
import ExampleCard from
  '@/components/example/ExampleCard';
import type { ExampleDTO } from '@/types/example.types';

const mockExample: ExampleDTO = {
  id:        1,
  name:      'Test Example',
  status:    'ACTIVE',
  amount:    500,
  ownerId:   100,
  ownerName: 'Test Owner',
  createdAt: '2026-10-13T10:00:00Z',
  updatedAt: '2026-10-13T10:00:00Z',
};

describe('ExampleCard', () => {
  it('renders example name', () => {
    render(<ExampleCard example={mockExample} />);
    expect(screen.getByText('Test Example'))
      .toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(
      <ExampleCard
        example={mockExample}
        onSelect={onSelect}
      />
    );
    fireEvent.click(screen.getByText('Test Example'));
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it('shows ACTIVE badge', () => {
    render(<ExampleCard example={mockExample} />);
    expect(screen.getByText('ACTIVE'))
      .toBeInTheDocument();
  });
});
```

### Flutter Widget Test

```dart
// test/features/example/example_card_test.dart

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:uptime_owner/features/example/widgets/example_card.dart';
import 'package:uptime_owner/features/example/models/example_dto.dart';

void main() {
  final mockExample = ExampleDTO(
    id: 1,
    name: 'Test Example',
    status: 'ACTIVE',
    amount: 500.0,
    ownerId: 100,
    createdAt: DateTime.now(),
  );

  testWidgets('ExampleCard renders name',
      (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: ExampleCard(example: mockExample),
        ),
      ),
    );

    expect(find.text('Test Example'), findsOneWidget);
  });

  testWidgets('ExampleCard calls onTap',
      (WidgetTester tester) async {
    bool tapped = false;
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: ExampleCard(
            example: mockExample,
            onTap: () => tapped = true,
          ),
        ),
      ),
    );

    await tester.tap(find.byType(ExampleCard));
    await tester.pump();

    expect(tapped, isTrue);
  });
}
```

---

## 20. Common Patterns

### Pattern: Pageable from request params

```java
// In controller
@GetMapping
public ResponseEntity<?> getAll(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @RequestParam(defaultValue = "createdAt") String sortBy,
    @RequestParam(defaultValue = "DESC") String sortDir) {

  Sort sort = Sort.by(
    sortDir.equals("DESC")
      ? Sort.Direction.DESC
      : Sort.Direction.ASC,
    sortBy
  );
  Pageable pageable = PageRequest.of(page, size, sort);
  // pass to service
}
```

### Pattern: Get current user ID from JWT

```java
// security/CurrentUser.java
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@AuthenticationPrincipal
public @interface CurrentUser {}

// security/CurrentUserArgumentResolver.java
// Extracts userId from SecurityContext
// Usage in controller:
public ResponseEntity<?> method(@CurrentUser Long userId) {}
```

### Pattern: Conditional Gemini call

```java
// Always wrap in try-catch + return fallback
public DiagnosisDTO analyseWithFallback(
    Long jobId, String description) {
  try {
    return geminiService.analyse(jobId, description);
  } catch (AIServiceException e) {
    log.warn("AI failed for job {}: {}", jobId, e.getMessage());
    return DiagnosisDTO.createFallback(description);
  }
}
```

### Pattern: React optimistic update

```tsx
const mutation = useMutation({
  mutationFn: updateExample,
  onMutate: async (updated) => {
    await queryClient.cancelQueries(
      { queryKey: exampleKeys.detail(updated.id) });
    const prev = queryClient.getQueryData(
      exampleKeys.detail(updated.id));
    queryClient.setQueryData(
      exampleKeys.detail(updated.id), updated);
    return { prev };            // context for rollback
  },
  onError: (err, vars, context) => {
    queryClient.setQueryData(   // rollback on error
      exampleKeys.detail(vars.id), context?.prev);
    toast.error('Update failed');
  },
  onSettled: (data, err, vars) => {
    queryClient.invalidateQueries(  // always refetch
      { queryKey: exampleKeys.detail(vars.id) });
  },
});
```

### Pattern: Flutter pull-to-refresh

```dart
RefreshIndicator(
  color: UptimeTheme.teal500,
  onRefresh: () async {
    ref.invalidate(exampleListProvider);
    await ref.read(exampleListProvider.future);
  },
  child: ListView.builder(...),
)
```

### Pattern: Flutter loading + error in one widget

```dart
// Use AsyncValue.when everywhere
ref.watch(exampleListProvider).when(
  loading: () => const LoadingShimmer(),
  error:   (e, s) => UptimeErrorWidget(
    message: e.toString(),
    onRetry: () => ref.refresh(exampleListProvider),
  ),
  data: (items) => ExampleList(items: items),
);
```

---

*UPTIME Coding Standards — v1.0*  
*"Downtime ends here."*  
*DSATM Bengaluru — VTU — 2026-27*
