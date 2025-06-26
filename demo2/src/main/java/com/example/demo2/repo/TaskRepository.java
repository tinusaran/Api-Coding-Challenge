package com.example.demo2.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo2.model.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
}

