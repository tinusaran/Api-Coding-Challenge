import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.css',
  imports: [CommonModule, FormsModule, RouterModule],
  standalone: true
})
export class Register {
  username = '';
  password = '';
  confirmPassword = '';
  error = '';
  loading = false;

  constructor(private auth: Auth, private router: Router) {}

  register() {
    this.loading = true;
    this.error = '';
    this.auth.register({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed';
      }
    });
  }
}
