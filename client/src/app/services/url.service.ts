import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface UrlEntry {
  id: number;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  userId: number;
}

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Url`;

  shortenUrl(originalUrl: string): Observable<UrlEntry> {
    return this.http.post<UrlEntry>(`${this.baseUrl}/shorten`, { originalUrl });
  }

  getUrl(shortCode: string): Observable<UrlEntry> {
    return this.http.get<UrlEntry>(`${this.baseUrl}/${shortCode}`);
  }

  getUserUrls(userId: number): Observable<UrlEntry[]> {
    return this.http.get<UrlEntry[]>(`${this.baseUrl}/user/${userId}`);
  }
}
