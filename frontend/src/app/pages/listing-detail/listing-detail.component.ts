import { Component, OnInit, inject } from '@angular/core';
<<<<<<< HEAD
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ListingService } from '../../services/listing.service';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { Listing } from '../../core/models/listing.model';
import { Review } from '../../core/models/review.model';
import { ReviewFormComponent } from '../../components/review-form/review-form.component';
=======
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ListingService } from '../../services/listing.service';
import { Listing } from '../../core/models/listing.model';
import { AuthService } from '../../services/auth.service';
>>>>>>> origin/main

@Component({
  selector: 'app-listing-detail',
  standalone: true,
<<<<<<< HEAD
  imports: [CommonModule, RouterLink, ReviewFormComponent],
  templateUrl: './listing-detail.component.html',
  styleUrls: ['./listing-detail.component.css'],
=======
  imports: [CommonModule],
  templateUrl: './listing-detail.component.html',
  styleUrls: ['./listing-detail.component.css']
>>>>>>> origin/main
})
export class ListingDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private listingService = inject(ListingService);
<<<<<<< HEAD
  private reviewService = inject(ReviewService);
  authService = inject(AuthService);

  listing?: Listing;
  reviews: Review[] = [];
  averageRating = 0;
  errorMessage = '';
  loading = true;
  showReviewForm = false;

  readonly typeLabels: Record<string, string> = {
    family: '👨‍👩‍👧 Для семьи',
    couple: '💑 Для двоих',
    solo: '🧍 Соло',
    group: '👥 Для компании',
  };

  readonly mealLabels: Record<string, string> = {
    all_inclusive: '🍽️ Всё включено',
    breakfast: '☕ Только завтрак',
    half_board: '🥗 Полупансион',
    self_catering: '🛒 Без питания',
  };

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
=======
  authService = inject(AuthService);

  listing: Listing | null = null;
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
>>>>>>> origin/main
    this.listingService.getListing(id).subscribe({
      next: (data) => {
        this.listing = data;
        this.loading = false;
      },
      error: () => {
<<<<<<< HEAD
        this.errorMessage = 'Юрта не найдена';
        this.loading = false;
      },
    });
    this.loadReviews(id);
  }

  loadReviews(id: number): void {
    this.reviewService.getReviews(id).subscribe({
      next: (data) => {
        this.reviews = data;
        if (data.length > 0) {
          this.averageRating = data.reduce((s, r) => s + r.rating, 0) / data.length;
        }
      },
    });
  }

  book(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
=======
        this.errorMessage = 'Не удалось загрузить юрту.';
        this.loading = false;
      }
    });
  }

  goToBooking(): void {
>>>>>>> origin/main
    if (this.listing) {
      this.router.navigate(['/booking', this.listing.id]);
    }
  }

<<<<<<< HEAD
  toggleReviewForm(): void {
    this.showReviewForm = !this.showReviewForm;
  }

  onReviewSubmitted(): void {
    this.showReviewForm = false;
    if (this.listing) this.loadReviews(this.listing.id);
  }

  getStars(rating: number): string {
    return '⭐'.repeat(rating);
=======
  goBack(): void {
    this.router.navigate(['/listings']);
>>>>>>> origin/main
  }
}
