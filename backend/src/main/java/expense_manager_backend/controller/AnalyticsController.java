package expense_manager_backend.controller;

import expense_manager_backend.dto.AnalyticsResponse;
import expense_manager_backend.service.AnalyticsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(
            AnalyticsService analyticsService
    ) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/{userId}")
    public AnalyticsResponse getAnalytics(
            @PathVariable Long userId
    ) {
        return analyticsService.getAnalytics(userId);
    }
}