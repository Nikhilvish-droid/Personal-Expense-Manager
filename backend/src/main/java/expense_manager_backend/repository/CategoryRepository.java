package expense_manager_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import expense_manager_backend.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByUserId(Long userId);
}