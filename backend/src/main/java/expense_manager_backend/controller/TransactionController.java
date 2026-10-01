package expense_manager_backend.controller;

import expense_manager_backend.model.Transaction;
import expense_manager_backend.service.TransactionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public Transaction create(@RequestBody Transaction transaction) {
        return transactionService.create(transaction);
    }

    @GetMapping("/{userId}")
    public List<Transaction> getByUser(@PathVariable Long userId) {
        return transactionService.getByUser(userId);
    }

    @PutMapping("/{id}")
    public Transaction update(
            @PathVariable Long id,
            @RequestBody Transaction transaction) {
        return transactionService.update(id, transaction);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        transactionService.delete(id);
        return "Transaction deleted";
    }
}