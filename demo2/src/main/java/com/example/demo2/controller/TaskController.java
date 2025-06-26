package com.example.demo2.controller;

import com.example.demo2.model.Task;
import com.example.demo2.repo.TaskRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/task")
public class TaskController {

    @Autowired
    private TaskRepository taskRepo;

    // Create a new task
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        return ResponseEntity.ok(taskRepo.save(task));
    }

    // Get all tasks
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskRepo.findAll());
    }

    // Get task by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Optional<Task> task = taskRepo.findById(id);
        return task.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    // Update task
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        Optional<Task> optionalTask = taskRepo.findById(id);
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            task.setTitle(updatedTask.getTitle());
            task.setDescription(updatedTask.getDescription());
            task.setDueDate(updatedTask.getDueDate());
            task.setPriority(updatedTask.getPriority());
            task.setStatus(updatedTask.getStatus());
            return ResponseEntity.ok(taskRepo.save(task));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete task
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> deleteTask(@PathVariable Long id) {
        taskRepo.deleteById(id);
        return ResponseEntity.ok("Task deleted successfully");
    }
}

