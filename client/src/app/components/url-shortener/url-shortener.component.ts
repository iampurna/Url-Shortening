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
    <mat-card class="max-w-lg w-full p-6 shadow-lg">
      <mat-card-header>
        <mat-card-title class="text-2xl mb-4">Shorten Your URL</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <form [formGroup]="urlForm" (ngSubmit)="shortenUrl()">
          <mat-form-field class="w-full mb-2">
            <mat-label>Enter your URL</mat-label>
            <input
              matInput
              formControlName="url"
              placeholder="https://example.com/very-long-url"
              autocomplete="off"
            />
            <mat-icon matSuffix>link</mat-icon>
            <mat-error *ngIf="urlForm.get('url')?.hasError('required')">
              URL is required
            </mat-error>
            <mat-error *ngIf="urlForm.get('url')?.hasError('pattern')">
              Please enter a valid URL (including http:// or https://)
            </mat-error>
          </mat-form-field>

          <div class="mt-4">
            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="w-full py-2"
              [disabled]="urlForm.invalid || isLoading"
            >
              <mat-icon>content_cut</mat-icon>
              <span *ngIf="!isLoading">Shorten URL</span>
              <span *ngIf="isLoading">Processing...</span>
            </button>
          </div>
        </form>

        <mat-progress-bar
          *ngIf="isLoading"
          mode="indeterminate"
          class="mt-4"
        ></mat-progress-bar>

        <div *ngIf="errorMessage" class="mt-4 text-red-500 text-sm">
          {{ errorMessage }}
        </div>

        <div *ngIf="shortenedUrl" class="mt-6 p-4 bg-gray-100 rounded-lg">
          <div class="text-sm font-medium text-gray-500 mb-1">
            Your shortened URL:
          </div>
          <div class="flex items-center">
            <input
              readonly
              [value]="shortenedUrl"
              class="flex-grow bg-transparent border-none outline-none text-blue-500 font-medium"
            />
            <button
              mat-icon-button
              color="primary"
              (click)="copyToClipboard()"
              matTooltip="Copy to clipboard"
            >
              <mat-icon>content_copy</mat-icon>
            </button>
          </div>
          <div class="mt-4 text-right">
            <button mat-button color="accent" (click)="resetForm()">
              <mat-icon>refresh</mat-icon> Shorten another
            </button>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
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
      this.snackBar.open('Shortened URL copied to clipboard!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    }
  }

  resetForm(): void {
    this.urlForm.reset();
    this.shortenedUrl = null;
    this.errorMessage = null;
  }
}
