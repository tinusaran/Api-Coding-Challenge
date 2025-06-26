package com.example.demo2.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo2.model.Task;
import com.example.demo2.repo.TaskRepository;

@Service
public class TaskService {

    @Autowired
    private TaskRepository repo;

    public List<Task> getAllTasks() {
        return repo.findAll();
    }

    public Task getTaskById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Task not found with ID: " + id));
    }

    public Task createTask(Task task) {
        return repo.save(task);
    }

    public Task updateTask(Long id, Task updatedTask) {
        Task existing = getTaskById(id);
        existing.setTitle(updatedTask.getTitle());
        existing.setDescription(updatedTask.getDescription());
        existing.setDueDate(updatedTask.getDueDate());
        existing.setPriority(updatedTask.getPriority());
        existing.setStatus(updatedTask.getStatus());
        return repo.save(existing);
    }

    public void deleteTask(Long id) {
        Task task = getTaskById(id);
        repo.delete(task);
    }
}

