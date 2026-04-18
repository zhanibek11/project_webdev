import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ListingService } from '../../services/listing.service';
import { Listing } from '../../core/models/listing.model';

@Component({
  selector: 'app-listings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css']
})
export class ListingsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private listingService = inject(ListingService);

  listings: Listing[] = [];
  loading = false;
  errorMessage = '';

  selectedCity = '';
  selectedType = '';
  selectedMeal = '';
  searchQuery = '';

  readonly cityOptions = [
    { value: 'almaty', label: '🏔️ Алматы' },
    { value: 'astana', label: '🏙️ Астана' },
    { value: 'aktau', label: '🌊 Актау' },
    { value: 'shymkent', label: '🌿 Шымкент' },
  ];

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
    this.route.queryParams.subscribe(params => {
      this.selectedCity = params['city'] || '';
      this.loadListings();
    });
  }

  loadListings(): void {
    this.loading = true;
    this.errorMessage = '';
    this.listingService.getListings(this.selectedCity, this.selectedType, this.selectedMeal).subscribe({
      next: (data) => {
        this.listings = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Не удалось загрузить юрты. Проверьте что бэкенд запущен.';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.router.navigate(['/listings'], {
      queryParams: {
        city: this.selectedCity || null,
        type: this.selectedType || null,
        meal: this.selectedMeal || null,
      },
      queryParamsHandling: 'merge'
    });
    this.loadListings();
  }

  resetFilters(): void {
    this.selectedCity = '';
    this.selectedType = '';
    this.selectedMeal = '';
    this.searchQuery = '';
    this.loadListings();
  }

  searchNow(): void {
    if (this.searchQuery.trim()) {
      this.listingService.searchListings(this.searchQuery).subscribe({
        next: (data) => this.listings = data,
        error: () => this.errorMessage = 'Ошибка поиска'
      });
    } else {
      this.loadListings();
    }
  }

  openListing(id: number): void {
    this.router.navigate(['/listing', id]);
  }

  getTypeLabel(type: string): string {
    return this.typeOptions.find(o => o.value === type)?.label || type;
  }

  getMealLabel(meal: string): string {
    return this.mealOptions.find(o => o.value === meal)?.label || meal;
  }
}
