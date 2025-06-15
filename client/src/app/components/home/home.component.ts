import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UrlShortenerComponent } from '../url-shortener/url-shortener.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    UrlShortenerComponent,
  ],
  template: `
    <div class="min-h-screen flex flex-col">
      <!-- Hero Section -->
      <div class="flex-1 flex items-center justify-center px-4 py-12">
        <div class="max-w-4xl mx-auto text-center">
          <!-- Hero Content -->
          <div class="mb-12">
            <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Shorten URLs
              <span class="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Share Smarter
              </span>
            </h1>
            <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform long, complex URLs into clean, shareable links. 
              Track clicks, manage your links, and boost your online presence.
            </p>
          </div>

          <!-- URL Shortener Component -->
          <div class="mb-16">
            <app-url-shortener></app-url-shortener>
          </div>

          <!-- Features Grid -->
          <div class="grid md:grid-cols-3 gap-8 mb-16">
            <div class="text-center p-6">
              <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <mat-icon class="text-blue-600 text-2xl">speed</mat-icon>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p class="text-gray-600">Generate short links instantly with our optimized infrastructure.</p>
            </div>
            <div class="text-center p-6">
              <div class="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <mat-icon class="text-purple-600 text-2xl">analytics</mat-icon>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Track Performance</h3>
              <p class="text-gray-600">Monitor clicks and engagement with detailed analytics.</p>
            </div>
            <div class="text-center p-6">
              <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <mat-icon class="text-green-600 text-2xl">security</mat-icon>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
              <p class="text-gray-600">Your links are protected with enterprise-grade security.</p>
            </div>
          </div>

          <!-- CTA Section -->
          <div *ngIf="!authService.isLoggedIn()" 
               class="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">
              Ready to get started?
            </h2>
            <p class="text-gray-600 mb-6">
              Create an account to track your shortened URLs and access advanced features.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a routerLink="/register" 
                 class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 inline-flex items-center justify-center">
                <mat-icon class="mr-2">person_add</mat-icon>
                Get Started Free
              </a>
              <a routerLink="/login" 
                 class="border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 inline-flex items-center justify-center">
                <mat-icon class="mr-2">login</mat-icon>
                Sign In
              </a>
            </div>
          </div>

          <div *ngIf="authService.isLoggedIn()" 
               class="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">
              Welcome back!
            </h2>
            <p class="text-gray-600 mb-6">
              View and manage all your shortened URLs in one place.
            </p>
            <a routerLink="/history" 
               class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 inline-flex items-center justify-center">
              <mat-icon class="mr-2">history</mat-icon>
              View My URLs
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class HomeComponent {
  authService = inject(AuthService);
}