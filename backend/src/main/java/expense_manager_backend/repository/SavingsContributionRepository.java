package expense_manager_backend.repository;

import expense_manager_backend.model.SavingsContribution;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SavingsContributionRepository
        extends JpaRepository<SavingsContribution, Long> {

    List<SavingsContribution> findByGoalId(Long goalId);
}