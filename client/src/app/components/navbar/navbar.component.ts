import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  template: `
    <nav class="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <mat-icon class="text-white text-lg">link</mat-icon>
              </div>
              <span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                UrlShortener
              </span>
            </a>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-4">
            <a routerLink="/" 
               class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Home
            </a>
            <ng-container *ngIf="authService.isLoggedIn()">
              <a routerLink="/history" 
                 class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                My URLs
              </a>
              <button (click)="logout()" 
                      class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Logout
              </button>
            </ng-container>
            <ng-container *ngIf="!authService.isLoggedIn()">
              <a routerLink="/login" 
                 class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Login
              </a>
              <a routerLink="/register" 
                 class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200">
                Sign Up
              </a>
            </ng-container>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button mat-icon-button [matMenuTriggerFor]="menu" class="text-gray-600">
              <mat-icon>menu</mat-icon>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile menu -->
    <mat-menu #menu="matMenu" class="mt-2">
      <a mat-menu-item routerLink="/">
        <mat-icon>home</mat-icon>
        <span>Home</span>
      </a>
      <ng-container *ngIf="authService.isLoggedIn()">
        <a mat-menu-item routerLink="/history">
          <mat-icon>history</mat-icon>
          <span>My URLs</span>
        </a>
        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          <span>Logout</span>
        </button>
      </ng-container>
      <ng-container *ngIf="!authService.isLoggedIn()">
        <a mat-menu-item routerLink="/login">
          <mat-icon>login</mat-icon>
          <span>Login</span>
        </a>
        <a mat-menu-item routerLink="/register">
          <mat-icon>person_add</mat-icon>
          <span>Sign Up</span>
        </a>
      </ng-container>
    </mat-menu>
  `,
})
export class NavbarComponent {
  authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}