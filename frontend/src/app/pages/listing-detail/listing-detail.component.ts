import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ListingService } from '../../services/listing.service';
import { Listing } from '../../core/models/listing.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listing-detail.component.html',
  styleUrls: ['./listing-detail.component.css']
})
export class ListingDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private listingService = inject(ListingService);
  private cdr = inject(ChangeDetectorRef);
  authService = inject(AuthService);

  listing: Listing | null = null;
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.listingService.getListing(id).subscribe({
      next: (data) => {
        this.listing = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Не удалось загрузить юрту.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goToBooking(): void {
    if (this.listing) {
      this.router.navigate(['/booking', this.listing.id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/listings']);
  }
}
