import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { ListingService } from '../../services/listing.service';
import { Location } from '../../core/models/listing.model';

const iconDefault = L.icon({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  private router = inject(Router);
  private listingService = inject(ListingService);

  locations: Location[] = [];
  private map!: L.Map;
  private mapReady = false;
  errorMessage = '';

  private defaultCities = [
    { city: 'almaty',   name: 'Алматы',   lat: 43.2220, lng: 76.8512 },
    { city: 'astana',   name: 'Астана',   lat: 51.1694, lng: 71.4491 },
    { city: 'aktau',    name: 'Актау',    lat: 43.6481, lng: 51.1722 },
    { city: 'shymkent', name: 'Шымкент', lat: 42.3417, lng: 69.5901 },
  ];

  ngOnInit(): void {
    this.listingService.getLocations().subscribe({
      next: (data) => {
        this.locations = data;
        if (this.mapReady) this.addMarkers();
      },
      error: () => {
        this.errorMessage = 'Не удалось загрузить данные с сервера.';
        if (this.mapReady) this.addDefaultMarkers();
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
      this.mapReady = true;
      if (this.locations.length > 0) this.addMarkers();
      else this.addDefaultMarkers();
    }, 0);
  }

  private initMap(): void {
    this.map = L.map('map', { zoomControl: true }).setView([48.0196, 66.9237], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(this.map);
  }

  private addMarkers(): void {
    this.locations.forEach(loc => {
      const marker = L.marker([loc.latitude, loc.longitude]).addTo(this.map);
      marker.bindPopup(`
        <div style="text-align:center; padding:8px; min-width:150px">
          <b style="font-size:16px">📍 ${loc.name}</b><br/>
          <p style="margin:6px 0; color:#666; font-size:13px">${loc.description || 'Юрты и эко-жильё'}</p>
          <button onclick="window.__goToCity('${loc.city}')"
            style="background:#1a5c3a;color:white;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:13px;margin-top:4px">
            Смотреть юрты
          </button>
        </div>
      `);
    });
    (window as any).__goToCity = (city: string) => this.goToListings(city);
  }

  private addDefaultMarkers(): void {
    this.defaultCities.forEach(c => {
      const marker = L.marker([c.lat, c.lng]).addTo(this.map);
      marker.bindPopup(`
        <div style="text-align:center; padding:8px; min-width:150px">
          <b style="font-size:16px">📍 ${c.name}</b><br/>
          <button onclick="window.__goToCity('${c.city}')"
            style="background:#1a5c3a;color:white;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:13px;margin-top:8px">
            Смотреть юрты
          </button>
        </div>
      `);
    });
    (window as any).__goToCity = (city: string) => this.goToListings(city);
  }

  goToListings(city?: string): void {
    if (city) {
      this.router.navigate(['/listings'], { queryParams: { city } });
    } else {
      this.router.navigate(['/listings']);
    }
  }
}
