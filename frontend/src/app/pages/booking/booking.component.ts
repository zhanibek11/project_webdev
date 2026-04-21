import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { BookingService } from '../../services/booking.service';
import { ListingService } from '../../services/listing.service';
import { Listing } from '../../core/models/listing.model';
=======
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
>>>>>>> origin/main

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.component.html',
<<<<<<< HEAD
  styleUrls: ['./booking.component.css'],
=======
  styleUrls: ['./booking.component.css']
>>>>>>> origin/main
})
export class BookingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
<<<<<<< HEAD
  private bookingService = inject(BookingService);
  private listingService = inject(ListingService);

  listing?: Listing;
  loading = true;
  submitting = false;
  errorMessage = '';
  successMessage = '';

  checkIn = '';
  checkOut = '';
  guestsCount = 1;

  bookedRanges: { check_in: string; check_out: string }[] = [];
  bookedDatesSet = new Set<string>();

  today = new Date().toISOString().split('T')[0];
  totalPrice = 0;
  nights = 0;

  readonly typeLabels: Record<string, string> = {
    family: '👨‍👩‍👧 Для семьи',
    couple: '💑 Для двоих',
    solo: '🧍 Соло',
    group: '👥 Для компании',
  };

  ngOnInit(): void {
    const listingId = Number(this.route.snapshot.paramMap.get('listingId'));

    this.listingService.getListing(listingId).subscribe({
      next: (data) => {
        this.listing = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Юрта не найдена';
        this.loading = false;
      },
    });

    this.bookingService.getBookedDates(listingId).subscribe({
      next: (ranges) => {
        this.bookedRanges = ranges;
        this.buildBookedDatesSet(ranges);
      },
    });
  }

  private buildBookedDatesSet(ranges: { check_in: string; check_out: string }[]): void {
    this.bookedDatesSet.clear();
    ranges.forEach((r) => {
      const start = new Date(r.check_in);
      const end = new Date(r.check_out);
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        this.bookedDatesSet.add(d.toISOString().split('T')[0]);
=======
  private http = inject(HttpClient);

  listingId = 0;
  checkIn = '';
  checkOut = '';
  guests = 1;
  errorMessage = '';
  successMessage = '';
  loading = false;

  ngOnInit(): void {
    this.listingId = Number(this.route.snapshot.paramMap.get('listingId'));
  }

  onSubmit(): void {
    if (!this.checkIn || !this.checkOut) {
      this.errorMessage = 'Выберите даты';
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.http.post(`${environment.apiUrl}/bookings/`, {
      listing: this.listingId,
      check_in: this.checkIn,
      check_out: this.checkOut,
      guests: this.guests
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Бронь успешно создана!';
        setTimeout(() => this.router.navigate(['/my-bookings']), 1500);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Ошибка при бронировании. Попробуйте снова.';
>>>>>>> origin/main
      }
    });
  }

<<<<<<< HEAD
  onDatesChange(): void {
    this.errorMessage = '';
    this.totalPrice = 0;
    this.nights = 0;

    if (!this.checkIn || !this.checkOut) return;
    if (this.checkIn >= this.checkOut) {
      this.errorMessage = 'Дата выезда должна быть позже даты заезда';
      return;
    }

    const conflict = this.checkDatesConflict(this.checkIn, this.checkOut);
    if (conflict) {
      this.errorMessage = `❌ Даты ${conflict} уже заняты. Выберите другой период.`;
      return;
    }

    if (this.listing) {
      const ms = new Date(this.checkOut).getTime() - new Date(this.checkIn).getTime();
      this.nights = Math.round(ms / (1000 * 60 * 60 * 24));
      this.totalPrice = this.nights * this.listing.price_per_night;
    }
  }

  private checkDatesConflict(checkIn: string, checkOut: string): string | null {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      if (this.bookedDatesSet.has(dateStr)) {
        return dateStr;
      }
    }
    return null;
  }

  submitBooking(): void {
    if (!this.listing) return;
    this.errorMessage = '';

    if (!this.checkIn || !this.checkOut) {
      this.errorMessage = 'Выберите даты заезда и выезда';
      return;
    }
    if (this.checkIn >= this.checkOut) {
      this.errorMessage = 'Дата выезда должна быть позже даты заезда';
      return;
    }
    if (this.guestsCount < 1 || this.guestsCount > this.listing.max_guests) {
      this.errorMessage = `Количество гостей: от 1 до ${this.listing.max_guests}`;
      return;
    }
    const conflict = this.checkDatesConflict(this.checkIn, this.checkOut);
    if (conflict) {
      this.errorMessage = `Дата ${conflict} уже занята`;
      return;
    }

    this.submitting = true;
    this.bookingService
      .createBooking({
        listing_id: this.listing.id,
        check_in: this.checkIn,
        check_out: this.checkOut,
        guests_count: this.guestsCount,
      })
      .subscribe({
        next: () => {
          this.successMessage = '✅ Бронирование подтверждено! Перенаправляем...';
          this.submitting = false;
          setTimeout(() => this.router.navigate(['/my-bookings']), 2000);
        },
        error: (err) => {
          this.submitting = false;
          this.errorMessage = err.error?.error || err.error?.detail || 'Ошибка при бронировании';
        },
      });
  }

  goBack(): void {
    if (this.listing) {
      this.router.navigate(['/listing', this.listing.id]);
    }
  }

  get bookedPeriodsList(): string[] {
    return this.bookedRanges.map((r) => `${r.check_in} → ${r.check_out}`);
=======
  goBack(): void {
    this.router.navigate(['/listing', this.listingId]);
>>>>>>> origin/main
  }
}
