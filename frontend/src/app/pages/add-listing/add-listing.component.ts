import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ListingService } from '../../services/listing.service';
import { Location } from '../../core/models/listing.model';

@Component({
  selector: 'app-add-listing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-listing.component.html',
  styleUrls: ['./add-listing.component.css'],
})
export class AddListingComponent implements OnInit {
  private listingService = inject(ListingService);
  private router = inject(Router);

  locations: Location[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

  title = '';
  description = '';
  selectedLocation = '';
  listingType = '';
  mealPlan = '';
  pricePerNight: number | null = null;
  maxGuests: number | null = null;
  imageUrl = '';

  readonly typeOptions = [
    { value: 'family', label: '👨‍👩‍👧 Для семьи' },
    { value: 'couple', label: '💑 Для двоих' },
    { value: 'solo', label: '🧍 Соло' },
    { value: 'group', label: '👥 Для компании' },
  ];

  readonly mealOptions = [
    { value: 'all_inclusive', label: '🍽️ Всё включено' },
    { value: 'breakfast', label: '☕ Только завтрак' },
    { value: 'half_board', label: '🥗 Полупансион' },
    { value: 'self_catering', label: '🛒 Без питания' },
  ];

  ngOnInit(): void {
    this.listingService.getLocations().subscribe({
      next: (data) => (this.locations = data),
      error: () => (this.errorMessage = 'Не удалось загрузить список городов'),
    });
  }

  submit(): void {
    this.errorMessage = '';
    if (
      !this.title ||
      !this.description ||
      !this.selectedLocation ||
      !this.listingType ||
      !this.mealPlan ||
      !this.pricePerNight ||
      !this.maxGuests
    ) {
      this.errorMessage = 'Заполните все обязательные поля';
      return;
    }
    this.loading = true;
    this.listingService
      .createListing({
        title: this.title,
        description: this.description,
        location: Number(this.selectedLocation),
        listing_type: this.listingType,
        meal_plan: this.mealPlan,
        price_per_night: this.pricePerNight,
        max_guests: this.maxGuests,
        image_url: this.imageUrl,
      })
      .subscribe({
        next: (listing) => {
          this.loading = false;
          this.successMessage = '✅ Юрта добавлена!';
          setTimeout(() => this.router.navigate(['/listing', listing.id]), 1500);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.detail || 'Ошибка при создании';
        },
      });
  }

  reset(): void {
    this.title = '';
    this.description = '';
    this.selectedLocation = '';
    this.listingType = '';
    this.mealPlan = '';
    this.pricePerNight = null;
    this.maxGuests = null;
    this.imageUrl = '';
    this.errorMessage = '';
  }
}
