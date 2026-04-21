import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

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
      listing_id: this.listingId,
      check_in: this.checkIn,
      check_out: this.checkOut,
      guests_count: this.guests
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Бронь успешно создана!';
        setTimeout(() => this.router.navigate(['/my-bookings']), 1500);
      },
      error: (err) => {
  this.loading = false;
  this.errorMessage = err.error?.error || 'Эти даты уже заняты. Выберите другой период.';
  this.cdr.detectChanges();
}
    });
  }

  goBack(): void {
    this.router.navigate(['/listing', this.listingId]);
  }
}
