import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 py-12">
      <div class="max-w-md w-full">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <mat-icon class="text-white text-2xl">login</mat-icon>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p class="text-gray-600">Sign in to your account to continue</p>
        </div>

        <!-- Login Form -->
        <div class="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <form [formGroup]="loginForm" (ngSubmit)="login()" class="space-y-6">
            <!-- Email Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div class="relative">
                <input
                  formControlName="email"
                  type="email"
                  placeholder="you@example.com"
                  class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  [class.border-red-300]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-4">
                  <mat-icon class="text-gray-400">email</mat-icon>
                </div>
              </div>
              <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" 
                   class="mt-1 text-sm text-red-600">
                <span *ngIf="loginForm.get('email')?.hasError('required')">Email is required</span>
                <span *ngIf="loginForm.get('email')?.hasError('email')">Please enter a valid email</span>
              </div>
            </div>

            <!-- Password Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div class="relative">
                <input
                  formControlName="password"
                  type="password"
                  placeholder="Enter your password"
                  class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  [class.border-red-300]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-4">
                  <mat-icon class="text-gray-400">lock</mat-icon>
                </div>
              </div>
              <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" 
                   class="mt-1 text-sm text-red-600">
                <span *ngIf="loginForm.get('password')?.hasError('required')">Password is required</span>
                <span *ngIf="loginForm.get('password')?.hasError('minlength')">Password must be at least 6 characters</span>
              </div>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" 
                 class="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div class="flex items-center">
                <mat-icon class="text-red-500 mr-2">error</mat-icon>
                <span class="text-red-700">{{ errorMessage }}</span>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading"
              class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <div *ngIf="isLoading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{{ isLoading ? 'Signing in...' : 'Sign In' }}</span>
            </button>
          </form>

          <!-- Sign Up Link -->
          <div class="mt-6 text-center">
            <p class="text-gray-600">
              Don't have an account?
              <a routerLink="/register" class="text-blue-600 hover:text-blue-700 font-medium ml-1">
                Sign up for free
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isLoading = false;
  errorMessage: string | null = null;

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const { email, password } = this.loginForm.value;

    if (email && password) {
      this.authService.login(email, password).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('✓ Welcome back!', '', { duration: 3000 });
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage =
            error.error?.message ||
            'Login failed. Please check your credentials.';
        },
      });
    }
  }
}