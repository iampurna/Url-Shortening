import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
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
    UrlShortenerComponent,
  ],
  template: `
    <div class="flex flex-col items-center mt-8">
      <h1 class="text-3xl font-bold mb-2">Welcome to URL Shortener</h1>
      <p class="text-gray-600 mb-8 text-center max-w-md">
        Create shorter URLs that are easier to share and track with our simple
        URL shortener.
      </p>

      <app-url-shortener></app-url-shortener>

      <div *ngIf="!authService.isLoggedIn()" class="mt-12 text-center">
        <h2 class="text-xl font-medium mb-4">
          Create an account to track your URLs
        </h2>
        <div class="flex gap-4">
          <a routerLink="/login" mat-raised-button color="primary">Login</a>
          <a routerLink="/register" mat-raised-button color="accent"
            >Register</a
          >
        </div>
      </div>

      <div *ngIf="authService.isLoggedIn()" class="mt-12 text-center">
        <h2 class="text-xl font-medium mb-4">View your shortened URLs</h2>
        <a routerLink="/history" mat-raised-button color="primary">My URLs</a>
      </div>
    </div>
  `,
})
export class HomeComponent {
  authService = inject(AuthService);
}
