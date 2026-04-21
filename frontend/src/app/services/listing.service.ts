import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Listing, Location } from '../core/models/listing.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ListingService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

<<<<<<< HEAD
  getListing(id: number): Observable<Listing> {
    return this.http.get<Listing>(`${this.apiUrl}/listings/${id}/`);
  }

  getListings(): Observable<Listing[]> {
    return this.http.get<Listing[]>(`${this.apiUrl}/listings/`);
  }

=======
>>>>>>> origin/main
  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.apiUrl}/locations/`);
  }

<<<<<<< HEAD
  createListing(data: any): Observable<Listing> {
    return this.http.post<Listing>(`${this.apiUrl}/listings/`, data);
  }
=======
  getListings(city?: string, type?: string, mealPlan?: string): Observable<Listing[]> {
    let params: any = {};
    if (city) params['city'] = city;
    if (type) params['type'] = type;
    if (mealPlan) params['meal_plan'] = mealPlan;
    return this.http.get<Listing[]>(`${this.apiUrl}/listings/`, { params });
  }

  getListing(id: number): Observable<Listing> {
    return this.http.get<Listing>(`${this.apiUrl}/listings/${id}/`);
  }

  createListing(data: Partial<Listing>): Observable<Listing> {
    return this.http.post<Listing>(`${this.apiUrl}/listings/`, data);
  }

  updateListing(id: number, data: Partial<Listing>): Observable<Listing> {
    return this.http.put<Listing>(`${this.apiUrl}/listings/${id}/`, data);
  }

  deleteListing(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/listings/${id}/`);
  }

  searchListings(query: string): Observable<Listing[]> {
    return this.http.get<Listing[]>(`${this.apiUrl}/search/`, { params: { q: query } });
  }
>>>>>>> origin/main
}
