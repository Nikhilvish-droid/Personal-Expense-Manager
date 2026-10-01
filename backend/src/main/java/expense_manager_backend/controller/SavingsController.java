package expense_manager_backend.controller;

import expense_manager_backend.model.SavingsGoal;
import expense_manager_backend.model.SavingsContribution;
import expense_manager_backend.service.SavingsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/savings")
public class SavingsController {

    private final SavingsService savingsService;

    public SavingsController(SavingsService savingsService) {
        this.savingsService = savingsService;
    }

    @PostMapping("/goals")
    public SavingsGoal createGoal(@RequestBody SavingsGoal goal) {
        return savingsService.createGoal(goal);
    }

    @GetMapping("/goals/{userId}")
    public List<SavingsGoal> getGoals(@PathVariable Long userId) {
        return savingsService.getGoalsByUser(userId);
    }

    @PostMapping("/goals/{goalId}/contributions")
    public SavingsContribution addContribution(
            @PathVariable Long goalId,
            @RequestBody SavingsContribution contribution) {

        return savingsService.addContribution(goalId, contribution);
    }
}