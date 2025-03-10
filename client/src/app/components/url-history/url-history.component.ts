import { Component, OnInit, inject } from '@angular/core';
import { NgIf, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { UrlService, ShortenedUrl } from '../../services/url.service';

@Component({
  selector: 'app-url-history',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    RouterLink,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  template: `
    <div class="container mx-auto mt-8 p-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Your URL History</h2>
        <button mat-raised-button color="primary" (click)="loadHistory()">
          <mat-icon>refresh</mat-icon> Refresh
        </button>
      </div>

      <div *ngIf="isLoading" class="text-center py-8">
        <mat-spinner diameter="40" class="mx-auto"></mat-spinner>
        <p class="mt-4 text-gray-500">Loading your URL history...</p>
      </div>

      <div
        *ngIf="!isLoading && urlHistory.length === 0"
        class="text-center py-12 bg-gray-50 rounded-lg"
      >
        <mat-icon class="text-gray-400 text-6xl">link_off</mat-icon>
        <p class="mt-4 text-xl text-gray-600">
          You haven't shortened any URLs yet.
        </p>
        <a routerLink="/" mat-raised-button color="primary" class="mt-4">
          Shorten a URL now
        </a>
      </div>

      <mat-card *ngIf="!isLoading && urlHistory.length > 0">
        <table mat-table [dataSource]="urlHistory" class="w-full">
          <!-- Original URL Column -->
          <ng-container matColumnDef="originalUrl">
            <th mat-header-cell *matHeaderCellDef>Original URL</th>
            <td mat-cell *matCellDef="let url">
              <div class="max-w-xs truncate">{{ url.originalUrl }}</div>
            </td>
          </ng-container>

          <!-- Short URL Column -->
          <ng-container matColumnDef="shortUrl">
            <th mat-header-cell *matHeaderCellDef>Short URL</th>
            <td mat-cell *matCellDef="let url">
              http://localhost:5178/api/Url/{{ url.shortCode }}
            </td>
          </ng-container>

          <!-- Created At Column -->
          <ng-container matColumnDef="createdAt">
            <th mat-header-cell *matHeaderCellDef>Created</th>
            <td mat-cell *matCellDef="let url">
              {{ url.createdAt | date : 'medium' }}
            </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let url">
              <button
                mat-icon-button
                color="primary"
                (click)="copyToClipboard(url.shortCode)"
                matTooltip="Copy to clipboard"
              >
                <mat-icon>content_copy</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </mat-card>
    </div>
  `,
})
export class UrlHistoryComponent implements OnInit {
  private urlService = inject(UrlService);
  private snackBar = inject(MatSnackBar);
  private clipboard = inject(Clipboard);

  urlHistory: ShortenedUrl[] = [];
  isLoading = true;
  displayedColumns: string[] = [
    'originalUrl',
    'shortUrl',
    'createdAt',
    'actions',
  ];

  ngOnInit(): void {
    this.loadHistory();
    this.urlService.getUrlHistory().subscribe({
      next: () => {
        // handle the history data
      },
      error: (error) => {
        console.error('Error fetching URL history:', error);
      },
    });
  }

  loadHistory(): void {
    this.isLoading = true;
    this.urlService.getUrlHistory().subscribe({
      next: (history) => {
        this.urlHistory = history;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load URL history.', 'Close', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  copyToClipboard(shortCode: string): void {
    const shortUrl = `http://localhost:5178/api/Url/${shortCode}`;
    this.clipboard.copy(shortUrl);
    this.snackBar.open('URL copied to clipboard!', 'Close', {
      duration: 3000,
    });
  }
}
