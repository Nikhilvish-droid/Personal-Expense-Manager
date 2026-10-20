package expense_manager_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

// Income AND Expense both live in the "transactions" table.
// The only difference is the "type" column -> 'INCOME' or 'EXPENSE'.
// So this one file handles add / list / edit / delete for both.
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final JdbcTemplate db;

    public TransactionController(JdbcTemplate db) {
        this.db = db;
    }

    // what the income form / expense form sends us
    public record TransactionRequest(
            Long userId,
            Long categoryId,
            String type,
            BigDecimal amount,
            String description,
            String source,
            String paymentMethod,
            LocalDate transactionDate
    ) {}

    // db columns are snake_case, react uses camelCase, so we rename them here.
    // date is sent as plain "2026-10-20" text, that is what <input type="date"> needs
    private static final String SELECT_TRANSACTION = """
            SELECT id,
                   user_id        AS "userId",
                   category_id    AS "categoryId",
                   type,
                   amount,
                   description,
                   source,
                   payment_method AS "paymentMethod",
                   TO_CHAR(transaction_date, 'YYYY-MM-DD') AS "transactionDate"
            FROM transactions
            """;

    // POST /api/transactions  -> add income or expense
    @PostMapping
    public Map<String, Object> create(@RequestBody TransactionRequest t) {

        Long newId = db.queryForObject("""
                INSERT INTO transactions
                    (user_id, category_id, type, amount, description, source,
                     payment_method, transaction_date, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, now(), now())
                RETURNING id
                """, Long.class,
                t.userId(), t.categoryId(), t.type(), t.amount(), t.description(),
                t.source(), t.paymentMethod(), t.transactionDate());

        return db.queryForMap(SELECT_TRANSACTION + " WHERE id = ?", newId);
    }

    // GET /api/transactions/{userId}  -> all income + expense of this user
    // (the react pages filter by type themselves)
    @GetMapping("/{userId}")
    public List<Map<String, Object>> getByUser(@PathVariable Long userId) {
        return db.queryForList(
                SELECT_TRANSACTION + " WHERE user_id = ? ORDER BY transaction_date DESC, id DESC", userId);
    }

    // PUT /api/transactions/{id}  -> edit income or expense
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody TransactionRequest t) {

        int updatedRows = db.update("""
                UPDATE transactions
                SET category_id = ?, type = ?, amount = ?, description = ?, source = ?,
                    payment_method = ?, transaction_date = ?, updated_at = now()
                WHERE id = ?
                """,
                t.categoryId(), t.type(), t.amount(), t.description(), t.source(),
                t.paymentMethod(), t.transactionDate(), id);

        if (updatedRows == 0) {
            return ResponseEntity.status(404).body(Map.of("message", "Transaction not found"));
        }

        return ResponseEntity.ok(db.queryForMap(SELECT_TRANSACTION + " WHERE id = ?", id));
    }

    // DELETE /api/transactions/{id}
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        db.update("DELETE FROM transactions WHERE id = ?", id);
        return "Transaction deleted";
    }
}
