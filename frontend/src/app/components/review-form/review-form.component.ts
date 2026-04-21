import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css'],
})
export class ReviewFormComponent {
  @Input() listingId!: number;
  @Output() reviewSubmitted = new EventEmitter<void>();

  private reviewService = inject(ReviewService);

  rating = 5;
  comment = '';
  submitting = false;
  errorMessage = '';

  readonly stars = [1, 2, 3, 4, 5];

  setRating(r: number): void {
    this.rating = r;
  }

  submit(): void {
    if (!this.comment.trim()) {
      this.errorMessage = 'Напишите комментарий';
      return;
    }
    this.submitting = true;
    this.errorMessage = '';
    this.reviewService
      .createReview(this.listingId, {
        rating: this.rating,
        comment: this.comment,
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.comment = '';
          this.rating = 5;
          this.reviewSubmitted.emit();
        },
        error: (err) => {
          this.submitting = false;
          this.errorMessage = err.error?.detail || 'Ошибка при отправке';
        },
      });
  }
}
