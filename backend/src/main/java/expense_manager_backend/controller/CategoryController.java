package expense_manager_backend.controller;

import expense_manager_backend.model.Category;
import expense_manager_backend.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public Category create(@RequestBody Category category) {
        return categoryService.create(category);
    }

    @GetMapping
    public List<Category> getAll() {
        return categoryService.getAll();
    }

    @GetMapping("/{userId}")
    public List<Category> getByUser(@PathVariable Long userId) {
        return categoryService.getByUser(userId);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        categoryService.delete(id);
        return "Category deleted";
    }
}