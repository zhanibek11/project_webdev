import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ListingService } from '../../services/listing.service';
import { Listing } from '../../core/models/listing.model';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './listing-detail.component.html',
  styleUrls: ['./listing-detail.component.css']
})
export class ListingDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private listingService = inject(ListingService);
  private cdr = inject(ChangeDetectorRef);
  private http = inject(HttpClient);
  authService = inject(AuthService);

  listing: Listing | null = null;
  loading = true;
  errorMessage = '';
  reviews: any[] = [];
  showReviewForm = false;
  rating = 5;
  comment = '';
  reviewError = '';
  reviewSuccess = '';
  stars = [1,2,3,4,5];


  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.listingService.getListing(id).subscribe({
      next: (data) => {
        this.listing = data;
        this.loading = false;
        this.cdr.detectChanges();
        this.loadReviews(id);
      },
      error: () => {
        this.errorMessage = 'Не удалось загрузить юрту.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadReviews(id: number): void {
  this.http.get<any[]>(`${environment.apiUrl}/listings/${id}/reviews/`).subscribe({
    next: (data) => {
      this.reviews = data;
      this.cdr.detectChanges();
    }
  });
}

setRating(r: number): void {
  this.rating = r;
}

submitReview(): void {
  if (!this.comment.trim()) {
    this.reviewError = 'Напишите комментарий';
    return;
  }
  this.http.post(`${environment.apiUrl}/listings/${this.listing?.id}/reviews/`, {
    rating: this.rating,
    comment: this.comment,
    listing: this.listing?.id
  }).subscribe({
    next: () => {
      this.reviewSuccess = 'Отзыв добавлен!';
      this.comment = '';
      this.rating = 5;
      this.showReviewForm = false;
      this.loadReviews(this.listing!.id);
      this.cdr.detectChanges();
    },
    error: (err) => {
      this.reviewError = err.error?.detail || 'Ошибка при отправке';
      this.cdr.detectChanges();
    }
  });
}

  goToBooking(): void {
    if (this.listing) {
      this.router.navigate(['/booking', this.listing.id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/listings']);
  }
}
