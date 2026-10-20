package expense_manager_backend.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

// Numbers for the Dashboard and Analytics page.
// All the adding up is done in SQL with SUM + GROUP BY, so java code stays short.
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final JdbcTemplate db;

    public AnalyticsController(JdbcTemplate db) {
        this.db = db;
    }

    // GET /api/analytics/{userId}
    @GetMapping("/{userId}")
    public Map<String, Object> getAnalytics(@PathVariable Long userId) {

        BigDecimal totalIncome = db.queryForObject("""
                SELECT COALESCE(SUM(amount), 0) FROM transactions
                WHERE user_id = ? AND type = 'INCOME'
                """, BigDecimal.class, userId);

        BigDecimal totalExpense = db.queryForObject("""
                SELECT COALESCE(SUM(amount), 0) FROM transactions
                WHERE user_id = ? AND type = 'EXPENSE'
                """, BigDecimal.class, userId);

        // expense per category -> [{label: "Food", amount: 1200}, ...]
        List<Map<String, Object>> categoryExpenses = db.queryForList("""
                SELECT COALESCE(c.name, 'Other') AS label, SUM(t.amount) AS amount
                FROM transactions t
                LEFT JOIN categories c ON c.id = t.category_id
                WHERE t.user_id = ? AND t.type = 'EXPENSE'
                GROUP BY COALESCE(c.name, 'Other')
                ORDER BY amount DESC
                """, userId);

        // expense per month -> [{month: "Jan", amount: 5000}, ...] in calendar order
        List<Map<String, Object>> monthlyExpenses = db.queryForList("""
                SELECT TO_CHAR(transaction_date, 'Mon') AS month, SUM(amount) AS amount
                FROM transactions
                WHERE user_id = ? AND type = 'EXPENSE' AND transaction_date IS NOT NULL
                GROUP BY TO_CHAR(transaction_date, 'Mon'), EXTRACT(MONTH FROM transaction_date)
                ORDER BY EXTRACT(MONTH FROM transaction_date)
                """, userId);

        // expense per payment method -> [{label: "UPI", amount: 3000}, ...]
        List<Map<String, Object>> paymentMethods = db.queryForList("""
                SELECT COALESCE(payment_method, 'Other') AS label, SUM(amount) AS amount
                FROM transactions
                WHERE user_id = ? AND type = 'EXPENSE'
                GROUP BY COALESCE(payment_method, 'Other')
                ORDER BY amount DESC
                """, userId);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("totalIncome", totalIncome);
        response.put("totalExpense", totalExpense);
        response.put("balance", totalIncome.subtract(totalExpense));
        response.put("categoryExpenses", categoryExpenses);
        response.put("monthlyExpenses", monthlyExpenses);
        response.put("paymentMethods", paymentMethods);
        return response;
    }
}
