export interface Listing {
  id: number;
  title: string;
  description: string;
  location_name: string;
  host_name: string;
  listing_type: string;
  meal_plan: string;
  price_per_night: number;
  max_guests: number;
  image_url: string;
}

export interface Location {
  id: number;
  name: string;
}
