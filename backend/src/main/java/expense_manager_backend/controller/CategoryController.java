package expense_manager_backend.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// Categories like "Food", "Salary", "Rent".
// type is 'INCOME' or 'EXPENSE' so the forms only show the right ones.
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final JdbcTemplate db;

    public CategoryController(JdbcTemplate db) {
        this.db = db;
    }

    public record CategoryRequest(Long userId, String name, String type, String icon, Boolean isDefault) {}

    private static final String SELECT_CATEGORY = """
            SELECT id,
                   user_id    AS "userId",
                   name,
                   type,
                   icon,
                   is_default AS "isDefault"
            FROM categories
            """;

    // POST /api/categories
    @PostMapping
    public Map<String, Object> create(@RequestBody CategoryRequest c) {

        boolean isDefault = c.isDefault() != null && c.isDefault();

        Long newId = db.queryForObject("""
                INSERT INTO categories (user_id, name, type, icon, is_default, created_at)
                VALUES (?, ?, ?, ?, ?, now())
                RETURNING id
                """, Long.class, c.userId(), c.name(), c.type(), c.icon(), isDefault);

        return db.queryForMap(SELECT_CATEGORY + " WHERE id = ?", newId);
    }

    // GET /api/categories  -> every category
    @GetMapping
    public List<Map<String, Object>> getAll() {
        return db.queryForList(SELECT_CATEGORY + " ORDER BY id");
    }

    // GET /api/categories/{userId}  -> only this user's categories
    @GetMapping("/{userId}")
    public List<Map<String, Object>> getByUser(@PathVariable Long userId) {
        return db.queryForList(SELECT_CATEGORY + " WHERE user_id = ? ORDER BY id", userId);
    }

    // DELETE /api/categories/{id}
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        db.update("DELETE FROM categories WHERE id = ?", id);
        return "Category deleted";
    }
}
