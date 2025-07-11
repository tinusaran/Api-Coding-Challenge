import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Task, TaskModel } from '../../services/task';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
  imports: [CommonModule, FormsModule, RouterModule],
  standalone: true
})
export class Home implements OnInit {
  tasks: TaskModel[] = [];
  filteredTasks: TaskModel[] = [];
  newTask: TaskModel = { 
    title: '', 
    description: '', 
    dueDate: this.getTodayDate(),
    priority: 'MEDIUM',
    status: 'PENDING'
  };
  editTask: TaskModel | null = null;
  error = '';
  success = '';
  loading = false;
  isLoading = false;
  
  // Search and filter properties
  searchTerm = '';
  selectedPriority = '';
  selectedStatus = '';
  showAddTask = false;

  constructor(private taskService: Task, private auth: Auth, private router: Router) {}

  ngOnInit() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadTasks();
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  showSuccess(message: string) {
    this.success = message;
    setTimeout(() => {
      this.success = '';
    }, 3000);
  }

  showError(message: string) {
    this.error = message;
    setTimeout(() => {
      this.error = '';
    }, 5000);
  }

  loadTasks() {
    this.isLoading = true;
    this.error = '';
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilters();
        this.isLoading = false;
        if (tasks.length > 0) {
          this.showSuccess(`Loaded ${tasks.length} tasks successfully!`);
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load tasks';
        this.isLoading = false;
        console.error('Error loading tasks:', err);
      }
    });
  }

  addTask() {
    if (!this.newTask.title.trim()) {
      this.showError('Title is required');
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    console.log('Adding task:', this.newTask);
    
    this.taskService.addTask(this.newTask).subscribe({
      next: (task) => {
        console.log('Task added successfully:', task);
        this.tasks.push(task);
        this.applyFilters();
        this.resetNewTask();
        this.loading = false;
        this.showSuccess('Task added successfully!');
      },
      error: (err) => {
        console.error('Error adding task:', err);
        this.showError(err.error?.message || 'Failed to add task');
        this.loading = false;
      }
    });
  }

  resetNewTask() {
    this.newTask = { 
      title: '', 
      description: '', 
      dueDate: this.getTodayDate(),
      priority: 'MEDIUM',
      status: 'PENDING'
    };
  }

  startEdit(task: TaskModel) {
    this.editTask = { ...task };
    // Add a small delay for smooth animation
    setTimeout(() => {
      const editRow = document.querySelector('.edit-row');
      if (editRow) {
        editRow.classList.add('active');
      }
    }, 100);
  }

  saveEdit() {
    if (!this.editTask) return;
    this.loading = true;
    this.error = '';
    
    this.taskService.updateTask(this.editTask).subscribe({
      next: (updated) => {
        const idx = this.tasks.findIndex(t => t.id === updated.id);
        if (idx > -1) this.tasks[idx] = updated;
        this.editTask = null;
        this.applyFilters();
        this.loading = false;
        this.showSuccess('Task updated successfully!');
      },
      error: (err) => {
        this.showError(err.error?.message || 'Failed to update task');
        this.loading = false;
      }
    });
  }

  cancelEdit() {
    this.editTask = null;
  }

  deleteTask(id?: number) {
    if (!id) return;
    
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.applyFilters();
        this.loading = false;
        this.showSuccess('Task deleted successfully!');
      },
      error: (err) => {
        this.showError(err.error?.message || 'Failed to delete task');
        this.loading = false;
      }
    });
  }

  // Search and filter methods with debouncing
  onSearchChange() {
    // Add debouncing to prevent excessive filtering
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.applyFilters();
    }, 300);
  }

  onPriorityChange() {
    this.applyFilters();
  }

  onStatusChange() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesSearch = !this.searchTerm || 
        task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesPriority = !this.selectedPriority || 
        task.priority === this.selectedPriority;
      
      const matchesStatus = !this.selectedStatus || 
        task.status === this.selectedStatus;
      
      return matchesSearch && matchesPriority && matchesStatus;
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  // Debounce timer for search
  private searchTimeout: any;
}
