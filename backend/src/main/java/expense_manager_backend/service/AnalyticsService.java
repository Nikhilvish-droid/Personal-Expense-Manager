package expense_manager_backend.service;

import expense_manager_backend.dto.AnalyticsResponse;
import expense_manager_backend.model.Category;
import expense_manager_backend.model.Transaction;
import expense_manager_backend.repository.AnalyticsRepository;
import expense_manager_backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final AnalyticsRepository analyticsRepository;
    private final CategoryRepository categoryRepository;

    public AnalyticsService(
            AnalyticsRepository analyticsRepository,
            CategoryRepository categoryRepository
    ) {
        this.analyticsRepository = analyticsRepository;
        this.categoryRepository = categoryRepository;
    }

    public AnalyticsResponse getAnalytics(Long userId) {

        BigDecimal income =
                analyticsRepository.getTotalIncome(userId);

        BigDecimal expense =
                analyticsRepository.getTotalExpense(userId);

        List<Transaction> transactions =
                analyticsRepository.getUserTransactions(userId);

        Map<Long, String> categoryNames =
                categoryRepository.findAll()
                        .stream()
                        .collect(Collectors.toMap(
                                Category::getId,
                                Category::getName
                        ));

        // Category-wise expenses
        Map<String, BigDecimal> categoryMap =
                new LinkedHashMap<>();

        transactions.stream()
                .filter(t -> "EXPENSE".equals(t.getType()))
                .forEach(t -> {

                    String categoryName =
                            categoryNames.getOrDefault(
                                    t.getCategoryId(),
                                    "Other"
                            );

                    categoryMap.merge(
                            categoryName,
                            t.getAmount(),
                            BigDecimal::add
                    );
                });

        List<AnalyticsResponse.CategoryExpense> categoryExpenses =
                categoryMap.entrySet()
                        .stream()
                        .map(entry ->
                                new AnalyticsResponse.CategoryExpense(
                                        entry.getKey(),
                                        entry.getValue()
                                )
                        )
                        .toList();

        // Monthly expenses
        Map<String, BigDecimal> monthlyMap =
                new TreeMap<>();

        transactions.stream()
                .filter(t -> "EXPENSE".equals(t.getType()))
                .filter(t -> t.getTransactionDate() != null)
                .forEach(t -> {

                    String month =
                            t.getTransactionDate()
                                    .getMonth()
                                    .getDisplayName(
                                            TextStyle.SHORT,
                                            Locale.ENGLISH
                                    );

                    monthlyMap.merge(
                            month,
                            t.getAmount(),
                            BigDecimal::add
                    );
                });

        List<AnalyticsResponse.MonthlyExpense> monthlyExpenses =
                monthlyMap.entrySet()
                        .stream()
                        .map(entry ->
                                new AnalyticsResponse.MonthlyExpense(
                                        entry.getKey(),
                                        entry.getValue()
                                )
                        )
                        .toList();

        // Payment method analysis
        Map<String, BigDecimal> paymentMap =
                new LinkedHashMap<>();

        transactions.stream()
                .filter(t -> "EXPENSE".equals(t.getType()))
                .forEach(t -> {

                    String paymentMethod =
                            t.getPaymentMethod() == null
                                    ? "Other"
                                    : t.getPaymentMethod();

                    paymentMap.merge(
                            paymentMethod,
                            t.getAmount(),
                            BigDecimal::add
                    );
                });

        List<AnalyticsResponse.PaymentMethodExpense> paymentMethods =
                paymentMap.entrySet()
                        .stream()
                        .map(entry ->
                                new AnalyticsResponse.PaymentMethodExpense(
                                        entry.getKey(),
                                        entry.getValue()
                                )
                        )
                        .toList();

        return new AnalyticsResponse(
                income,
                expense,
                categoryExpenses,
                monthlyExpenses,
                paymentMethods
        );
    }
}