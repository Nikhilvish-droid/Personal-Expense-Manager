package expense_manager_backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class AnalyticsResponse {

    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;

    private List<CategoryExpense> categoryExpenses;
    private List<MonthlyExpense> monthlyExpenses;
    private List<PaymentMethodExpense> paymentMethods;

    public AnalyticsResponse() {
    }

    public AnalyticsResponse(
            BigDecimal totalIncome,
            BigDecimal totalExpense,
            List<CategoryExpense> categoryExpenses,
            List<MonthlyExpense> monthlyExpenses,
            List<PaymentMethodExpense> paymentMethods
    ) {
        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
        this.balance = totalIncome.subtract(totalExpense);
        this.categoryExpenses = categoryExpenses;
        this.monthlyExpenses = monthlyExpenses;
        this.paymentMethods = paymentMethods;
    }

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public BigDecimal getTotalExpense() {
        return totalExpense;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public List<CategoryExpense> getCategoryExpenses() {
        return categoryExpenses;
    }

    public List<MonthlyExpense> getMonthlyExpenses() {
        return monthlyExpenses;
    }

    public List<PaymentMethodExpense> getPaymentMethods() {
        return paymentMethods;
    }

    public static class CategoryExpense {

        private java.lang.String label;
        private BigDecimal amount;

        public CategoryExpense(String label, BigDecimal amount) {
            this.label = label;
            this.amount = amount;
        }

        public String getLabel() {
            return label;
        }

        public BigDecimal getAmount() {
            return amount;
        }
    }

    public static class MonthlyExpense {

        private String month;
        private BigDecimal amount;

        public MonthlyExpense(String month, BigDecimal amount) {
            this.month = month;
            this.amount = amount;
        }

        public String getMonth() {
            return month;
        }

        public BigDecimal getAmount() {
            return amount;
        }
    }

    public static class PaymentMethodExpense {

        private String label;
        private BigDecimal amount;

        public PaymentMethodExpense(String label, BigDecimal amount) {
            this.label = label;
            this.amount = amount;
        }

        public String getLabel() {
            return label;
        }

        public BigDecimal getAmount() {
            return amount;
        }
    }
}