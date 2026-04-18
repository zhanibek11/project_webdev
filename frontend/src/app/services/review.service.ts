import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../core/models/review.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getReviews(listingId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/listings/${listingId}/reviews/`);
  }

  createReview(listingId: number, data: { rating: number; comment: string }): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/listings/${listingId}/reviews/`, data);
  }
}
