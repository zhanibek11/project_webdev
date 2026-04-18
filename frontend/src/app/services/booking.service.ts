import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, BookedDate } from '../core/models/booking.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/my-bookings/`);
  }

  getBookedDates(listingId: number): Observable<BookedDate[]> {
    return this.http.get<BookedDate[]>(`${this.apiUrl}/listings/${listingId}/booked-dates/`);
  }

  createBooking(data: {
    listing_id: number;
    check_in: string;
    check_out: string;
    guests_count: number;
  }): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/bookings/`, data);
  }

  cancelBooking(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/bookings/${id}/cancel/`);
  }
}
