package expense_manager_backend.service;

import expense_manager_backend.model.Transaction;
import expense_manager_backend.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public Transaction create(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getByUser(Long userId) {
        return transactionRepository.findByUserId(userId);
    }

    public Transaction update(Long id, Transaction transaction) {
        Transaction existing = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        existing.setCategoryId(transaction.getCategoryId());
        existing.setType(transaction.getType());
        existing.setAmount(transaction.getAmount());
        existing.setDescription(transaction.getDescription());
        existing.setSource(transaction.getSource());
        existing.setPaymentMethod(transaction.getPaymentMethod());
        existing.setTransactionDate(transaction.getTransactionDate());

        return transactionRepository.save(existing);
    }

    public void delete(Long id) {
        transactionRepository.deleteById(id);
    }
    
}