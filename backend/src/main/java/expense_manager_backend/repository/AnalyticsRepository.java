package expense_manager_backend.repository;

import expense_manager_backend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface AnalyticsRepository extends JpaRepository<Transaction, Long> {

    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM Transaction t
        WHERE t.userId = :userId
        AND t.type = 'INCOME'
    """)
    BigDecimal getTotalIncome(@Param("userId") Long userId);

    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM Transaction t
        WHERE t.userId = :userId
        AND t.type = 'EXPENSE'
    """)
    BigDecimal getTotalExpense(@Param("userId") Long userId);

    @Query("""
        SELECT t
        FROM Transaction t
        WHERE t.userId = :userId
    """)
    List<Transaction> getUserTransactions(@Param("userId") Long userId);
}