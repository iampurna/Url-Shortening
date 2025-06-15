import { Component, OnInit, inject } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
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
    NgFor,
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
    <div class="min-h-screen px-4 py-12">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Your URL History</h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage and track all your shortened URLs in one place
          </p>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="text-center py-16">
          <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-600">Loading your URL history...</p>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading && urlHistory.length === 0" 
             class="text-center py-16">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <mat-icon class="text-gray-400 text-4xl">link_off</mat-icon>
          </div>
          <h3 class="text-2xl font-semibold text-gray-900 mb-4">No URLs yet</h3>
          <p class="text-gray-600 mb-8 max-w-md mx-auto">
            You haven't shortened any URLs yet. Start creating your first short link!
          </p>
          <a routerLink="/" 
             class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-2">
            <mat-icon>add</mat-icon>
            <span>Create Your First URL</span>
          </a>
        </div>

        <!-- URL History Grid -->
        <div *ngIf="!isLoading && urlHistory.length > 0" class="space-y-6">
          <!-- Actions Bar -->
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-600">
              {{ urlHistory.length }} shortened URL{{ urlHistory.length !== 1 ? 's' : '' }}
            </div>
            <button (click)="loadHistory()" 
                    class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2">
              <mat-icon>refresh</mat-icon>
              <span>Refresh</span>
            </button>
          </div>

          <!-- URL Cards -->
          <div class="grid gap-6">
            <div *ngFor="let url of urlHistory" 
                 class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <!-- URL Info -->
                <div class="flex-1 min-w-0">
                  <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Original URL
                    </label>
                    <p class="text-gray-900 font-medium truncate" [title]="url.originalUrl">
                      {{ url.originalUrl }}
                    </p>
                  </div>
                  
                  <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Short URL
                    </label>
                    <div class="flex items-center space-x-2">
                      <code class="text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-lg">
                        http://localhost:5178/api/Url/{{ url.shortCode }}
                      </code>
                    </div>
                  </div>

                  <div class="flex items-center text-sm text-gray-500">
                    <mat-icon class="mr-1 text-xs">schedule</mat-icon>
                    Created {{ url.createdAt | date : 'medium' }}
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center space-x-3 lg:ml-6">
                  <button (click)="copyToClipboard(url.shortCode)"
                          class="bg-blue-100 hover:bg-blue-200 text-blue-600 p-3 rounded-xl transition-colors duration-200"
                          matTooltip="Copy short URL">
                    <mat-icon>content_copy</mat-icon>
                  </button>
                  
                  <a [href]="'http://localhost:5178/api/Url/' + url.shortCode" 
                     target="_blank"
                     class="bg-green-100 hover:bg-green-200 text-green-600 p-3 rounded-xl transition-colors duration-200"
                     matTooltip="Open in new tab">
                    <mat-icon>open_in_new</mat-icon>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Create New URL CTA -->
          <div class="text-center pt-8">
            <a routerLink="/" 
               class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-2">
              <mat-icon>add</mat-icon>
              <span>Shorten Another URL</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class UrlHistoryComponent implements OnInit {
  private urlService = inject(UrlService);
  private snackBar = inject(MatSnackBar);
  private clipboard = inject(Clipboard);

  urlHistory: ShortenedUrl[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadHistory();
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
    this.snackBar.open('✓ URL copied to clipboard!', '', {
      duration: 2000,
    });
  }
}