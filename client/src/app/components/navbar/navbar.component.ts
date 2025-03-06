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
    <mat-toolbar color="primary" class="fixed top-0 z-10 w-full">
      <span class="text-xl font-bold">URL Shortener</span>
      <span class="flex-grow"></span>
      <div class="hidden sm:flex">
        <a mat-button routerLink="/">Home</a>
        <ng-container *ngIf="authService.isLoggedIn()">
          <a mat-button routerLink="/history">My URLs</a>
          <button mat-button (click)="logout()">Logout</button>
        </ng-container>
        <ng-container *ngIf="!authService.isLoggedIn()">
          <a mat-button routerLink="/login">Login</a>
          <a mat-button routerLink="/register">Register</a>
        </ng-container>
      </div>
      <button mat-icon-button [matMenuTriggerFor]="menu" class="sm:hidden">
        <mat-icon>menu</mat-icon>
      </button>
    </mat-toolbar>

    <mat-menu #menu="matMenu">
      <a mat-menu-item routerLink="/">Home</a>
      <ng-container *ngIf="authService.isLoggedIn()">
        <a mat-menu-item routerLink="/history">My URLs</a>
        <button mat-menu-item (click)="logout()">Logout</button>
      </ng-container>
      <ng-container *ngIf="!authService.isLoggedIn()">
        <a mat-menu-item routerLink="/login">Login</a>
        <a mat-menu-item routerLink="/register">Register</a>
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
