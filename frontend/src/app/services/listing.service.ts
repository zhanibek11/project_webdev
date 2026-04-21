import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Listing, Location } from '../core/models/listing.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ListingService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getListing(id: number): Observable<Listing> {
    return this.http.get<Listing>(`${this.apiUrl}/listings/${id}/`);
  }

  getListings(): Observable<Listing[]> {
    return this.http.get<Listing[]>(`${this.apiUrl}/listings/`);
  }

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.apiUrl}/locations/`);
  }

  createListing(data: any): Observable<Listing> {
    return this.http.post<Listing>(`${this.apiUrl}/listings/`, data);
  }
}
