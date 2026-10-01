package expense_manager_backend.service;

import expense_manager_backend.model.SavingsGoal;
import expense_manager_backend.model.SavingsContribution;
import expense_manager_backend.repository.SavingsGoalRepository;
import expense_manager_backend.repository.SavingsContributionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class SavingsService {

    private final SavingsGoalRepository savingsGoalRepository;
    private final SavingsContributionRepository contributionRepository;

    public SavingsService(
            SavingsGoalRepository savingsGoalRepository,
            SavingsContributionRepository contributionRepository) {

        this.savingsGoalRepository = savingsGoalRepository;
        this.contributionRepository = contributionRepository;
    }

    public SavingsGoal createGoal(SavingsGoal goal) {
        return savingsGoalRepository.save(goal);
    }

    public List<SavingsGoal> getGoalsByUser(Long userId) {
        return savingsGoalRepository.findByUserId(userId);
    }

    public SavingsContribution addContribution(
            Long goalId,
            SavingsContribution contribution) {

        savingsGoalRepository.findById(goalId)
                .orElseThrow(() ->
                        new RuntimeException("Savings goal not found"));

        contribution.setGoalId(goalId);

        return contributionRepository.save(contribution);
    }
}