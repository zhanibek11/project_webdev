import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../core/models/booking.model';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css'],
})
export class MyBookingsComponent implements OnInit {
  private bookingService = inject(BookingService);
  private router = inject(Router);

  bookings: Booking[] = [];
  loading = true;
  errorMessage = '';
  cancellingId: number | null = null;

  readonly statusLabels: Record<string, string> = {
    pending: '🕐 Ожидает',
    confirmed: '✅ Подтверждено',
    cancelled: '❌ Отменено',
    completed: '🏁 Завершено',
  };

  readonly statusClasses: Record<string, string> = {
    pending: 'status-pending',
    confirmed: 'status-confirmed',
    cancelled: 'status-cancelled',
    completed: 'status-completed',
  };

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.bookingService.getMyBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Не удалось загрузить брони';
        this.loading = false;
      },
    });
  }

  cancelBooking(id: number): void {
    if (!confirm('Отменить эту бронь?')) return;
    this.cancellingId = id;
    this.bookingService.cancelBooking(id).subscribe({
      next: () => {
        this.cancellingId = null;
        this.loadBookings();
      },
      error: () => {
        this.cancellingId = null;
        this.errorMessage = 'Не удалось отменить бронь';
      },
    });
  }

  openListing(listingId: number): void {
    this.router.navigate(['/listing', listingId]);
  }

  calcNights(checkIn: string, checkOut: string): number {
    const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.round(ms / (1000 * 60 * 60 * 24));
  }
}
