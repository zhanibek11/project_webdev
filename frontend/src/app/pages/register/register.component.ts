import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  email = '';
  password = '';
  password2 = '';
  errorMessage = '';
  successMessage = '';
  loading = false;

  onSubmit(): void {
    this.errorMessage = '';
    if (!this.username || !this.email || !this.password) {
      this.errorMessage = 'Заполните все поля';
      return;
    }
    if (this.password !== this.password2) {
      this.errorMessage = 'Пароли не совпадают';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'Пароль должен быть минимум 6 символов';
      return;
    }
    this.loading = true;
    this.authService.register(this.username, this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Аккаунт создан! Войдите в систему.';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.loading = false;
        const detail = err.error?.username?.[0] || err.error?.email?.[0] || 'Ошибка регистрации';
        this.errorMessage = detail;
      }
    });
  }
}
