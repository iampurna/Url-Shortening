import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { UrlService, ShortenedUrl } from '../../services/url.service';

@Component({
  selector: 'app-url-shortener',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  template: `
    <div class="max-w-2xl mx-auto">
      <!-- Main Input Card -->
      <div
        class="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 mb-8"
      >
        <form [formGroup]="urlForm" (ngSubmit)="shortenUrl()" class="space-y-6">
          <!-- URL Input -->
          <div class="form-group">
            <label
              for="urlInput"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter your long URL
            </label>
            <div class="relative">
              <input
                id="urlInput"
                formControlName="url"
                type="url"
                placeholder="https://example.com/very-long-url-that-needs-shortening"
                class="w-full px-4 py-4 pr-12 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                [class.border-red-300]="
                  urlForm.get('url')?.invalid && urlForm.get('url')?.touched
                "
                [class.border-green-300]="
                  urlForm.get('url')?.valid && urlForm.get('url')?.touched
                "
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-4">
                <mat-icon class="text-gray-400">link</mat-icon>
              </div>
            </div>
            <div
              *ngIf="urlForm.get('url')?.invalid && urlForm.get('url')?.touched"
              class="mt-2 text-sm text-red-600"
            >
              <span *ngIf="urlForm.get('url')?.hasError('required')"
                >URL is required</span
              >
              <span *ngIf="urlForm.get('url')?.hasError('pattern')"
                >Please enter a valid URL (including http:// or https://)</span
              >
            </div>
          </div>

          <!-- Shorten Button -->
          <button
            type="submit"
            [disabled]="urlForm.invalid || isLoading"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-2xl font-semibold text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <mat-icon *ngIf="!isLoading">content_cut</mat-icon>
            <div
              *ngIf="isLoading"
              class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></div>
            <span>{{ isLoading ? 'Shortening...' : 'Shorten URL' }}</span>
          </button>
        </form>

        <!-- Error Message -->
        <div
          *ngIf="errorMessage"
          class="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl"
        >
          <div class="flex items-center">
            <mat-icon class="text-red-500 mr-2">error</mat-icon>
            <span class="text-red-700">{{ errorMessage }}</span>
          </div>
        </div>
      </div>

      <!-- Result Card -->
      <div
        *ngIf="shortenedUrl"
        class="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-8 border border-green-200 animate-fade-in"
      >
        <div class="text-center mb-6">
          <div
            class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <mat-icon class="text-green-600 text-2xl">check_circle</mat-icon>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            Your URL has been shortened!
          </h3>
          <p class="text-gray-600">Share your new short link anywhere</p>
        </div>

        <!-- Shortened URL Display -->
        <div class="bg-white rounded-2xl p-6 border border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex-1 mr-4">
              <label class="block text-sm font-medium text-gray-500 mb-1"
                >Shortened URL</label
              >
              <input
                readonly
                [value]="shortenedUrl"
                class="w-full text-lg font-medium text-blue-600 bg-transparent border-none outline-none cursor-pointer"
                (click)="selectUrl($event)"
              />
            </div>
            <button
              (click)="copyToClipboard()"
              class="bg-blue-100 hover:bg-blue-200 text-blue-600 p-3 rounded-xl transition-colors duration-200 flex items-center space-x-2"
              title="Copy to clipboard"
            >
              <mat-icon>content_copy</mat-icon>
              <span class="hidden sm:inline">Copy</span>
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            (click)="resetForm()"
            class="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <mat-icon>refresh</mat-icon>
            <span>Shorten Another</span>
          </button>
          <a
            [href]="shortenedUrl"
            target="_blank"
            class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <mat-icon>open_in_new</mat-icon>
            <span>Test Link</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @keyframes fade-in {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fade-in {
        animation: fade-in 0.3s ease-out;
      }
    `,
  ],
})
export class UrlShortenerComponent {
  private fb = inject(FormBuilder);
  private urlService = inject(UrlService);
  private snackBar = inject(MatSnackBar);
  private clipboard = inject(Clipboard);

  urlForm = this.fb.group({
    url: ['', [Validators.required, Validators.pattern('https?://.*')]],
  });

  shortenedUrl: string | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  shortenUrl(): void {
    if (this.urlForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    const url = this.urlForm.get('url')?.value;

    if (url) {
      this.urlService.shortenUrl(url).subscribe({
        next: (response: ShortenedUrl) => {
          this.shortenedUrl = `http://localhost:5178/api/Url/${response.shortCode}`;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage =
            error.error?.message || 'Failed to shorten URL. Please try again.';
          this.isLoading = false;
        },
      });
    }
  }

  copyToClipboard(): void {
    if (this.shortenedUrl) {
      this.clipboard.copy(this.shortenedUrl);
      this.snackBar.open('✓ Copied to clipboard!', '', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['success-snackbar'],
      });
    }
  }

  selectUrl(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  resetForm(): void {
    this.urlForm.reset();
    this.shortenedUrl = null;
    this.errorMessage = null;
  }
}
