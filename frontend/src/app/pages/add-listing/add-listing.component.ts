import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ListingService } from '../../services/listing.service';

@Component({
  selector: 'app-add-listing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-listing.component.html',
  styleUrls: ['./add-listing.component.css']
})
export class AddListingComponent {
  private listingService = inject(ListingService);
  private router = inject(Router);

  title = '';
  description = '';
  price = 0;
  maxGuests = 1;
  listingType = 'family';
  mealPlan = 'breakfast';
  imageUrl = '';
  errorMessage = '';
  successMessage = '';
  loading = false;

  readonly typeOptions = [
    { value: 'family', label: 'Для семьи' },
    { value: 'couple', label: 'Для двоих' },
    { value: 'solo', label: 'Соло' },
    { value: 'group', label: 'Для компании' },
  ];

  readonly mealOptions = [
    { value: 'all_inclusive', label: 'Всё включено' },
    { value: 'breakfast', label: 'Только завтрак' },
    { value: 'half_board', label: 'Полупансион' },
    { value: 'self_catering', label: 'Без питания' },
  ];

  onSubmit(): void {
    if (!this.title || !this.description || !this.price) {
      this.errorMessage = 'Заполните все обязательные поля';
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.listingService.createListing({
      title: this.title,
      description: this.description,
      price_per_night: this.price,
      max_guests: this.maxGuests,
      listing_type: this.listingType as any,
      meal_plan: this.mealPlan as any,
      image_url: this.imageUrl
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Юрта успешно добавлена!';
        setTimeout(() => this.router.navigate(['/listings']), 1500);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Ошибка при добавлении. Проверьте данные.';
      }
    });
  }
}
