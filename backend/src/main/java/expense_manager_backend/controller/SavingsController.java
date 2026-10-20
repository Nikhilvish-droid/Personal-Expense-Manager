package expense_manager_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

// Savings goals ("New Laptop - 50000") and the money the user adds to them.
@RestController
@RequestMapping("/api/savings")
public class SavingsController {

    private final JdbcTemplate db;

    public SavingsController(JdbcTemplate db) {
        this.db = db;
    }

    public record GoalRequest(Long userId, String goalName, BigDecimal targetAmount, LocalDate deadline) {}
    public record ContributionRequest(BigDecimal amount, LocalDate contributionDate) {}

    private static final String SELECT_GOAL = """
            SELECT id,
                   user_id        AS "userId",
                   goal_name      AS "goalName",
                   target_amount  AS "targetAmount",
                   current_amount AS "currentAmount",
                   TO_CHAR(deadline, 'YYYY-MM-DD') AS deadline,
                   status
            FROM savings_goals
            """;

    // POST /api/savings/goals  -> new goal always starts at 0 and ACTIVE
    @PostMapping("/goals")
    public Map<String, Object> createGoal(@RequestBody GoalRequest g) {

        Long newId = db.queryForObject("""
                INSERT INTO savings_goals
                    (user_id, goal_name, target_amount, current_amount, deadline, status, created_at, updated_at)
                VALUES (?, ?, ?, 0, ?, 'ACTIVE', now(), now())
                RETURNING id
                """, Long.class, g.userId(), g.goalName(), g.targetAmount(), g.deadline());

        return db.queryForMap(SELECT_GOAL + " WHERE id = ?", newId);
    }

    // GET /api/savings/goals/{userId}
    @GetMapping("/goals/{userId}")
    public List<Map<String, Object>> getGoals(@PathVariable Long userId) {
        return db.queryForList(SELECT_GOAL + " WHERE user_id = ? ORDER BY id", userId);
    }

    // POST /api/savings/goals/{goalId}/contributions
    // 1. save the contribution
    // 2. update the goal's current amount (sum of all its contributions)
    // 3. if target is reached, mark goal as COMPLETED
    // @Transactional -> if any step fails, nothing is saved
    @Transactional
    @PostMapping("/goals/{goalId}/contributions")
    public ResponseEntity<?> addContribution(@PathVariable Long goalId,
                                             @RequestBody ContributionRequest c) {

        Integer goalCount = db.queryForObject(
                "SELECT COUNT(*) FROM savings_goals WHERE id = ?", Integer.class, goalId);

        if (goalCount == null || goalCount == 0) {
            return ResponseEntity.status(404).body(Map.of("message", "Savings goal not found"));
        }

        LocalDate date = c.contributionDate() != null ? c.contributionDate() : LocalDate.now();

        Long newId = db.queryForObject("""
                INSERT INTO savings_contributions (goal_id, amount, contribution_date, created_at)
                VALUES (?, ?, ?, now())
                RETURNING id
                """, Long.class, goalId, c.amount(), date);

        db.update("""
                UPDATE savings_goals
                SET current_amount = (SELECT COALESCE(SUM(amount), 0)
                                      FROM savings_contributions
                                      WHERE goal_id = ?),
                    updated_at = now()
                WHERE id = ?
                """, goalId, goalId);

        db.update("""
                UPDATE savings_goals
                SET status = 'COMPLETED'
                WHERE id = ? AND current_amount >= target_amount
                """, goalId);

        return ResponseEntity.ok(db.queryForMap("""
                SELECT id,
                       goal_id           AS "goalId",
                       amount,
                       TO_CHAR(contribution_date, 'YYYY-MM-DD') AS "contributionDate"
                FROM savings_contributions
                WHERE id = ?
                """, newId));
    }
}
