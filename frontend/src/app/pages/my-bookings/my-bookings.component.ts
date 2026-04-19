import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  bookings: any[] = [];
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/bookings/`).subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Не удалось загрузить брони.';
        this.loading = false;
      }
    });
  }

  goToListing(listingId: number): void {
    this.router.navigate(['/listing', listingId]);
  }
}
