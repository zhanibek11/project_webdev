export interface Location {
  id: number;
  name: string;
  city: 'almaty' | 'astana' | 'aktau' | 'shymkent';
  description: string;
  latitude: number;
  longitude: number;
}

export interface Listing {
  id: number;
  host: number;
  host_name: string;
  location: number;
  location_name: string;
  city: string;
  title: string;
  description: string;
  listing_type: 'family' | 'couple' | 'solo' | 'group';
  meal_plan: 'all_inclusive' | 'breakfast' | 'self_catering' | 'half_board';
  price_per_night: number;
  max_guests: number;
  image_url: string;
  is_active: boolean;
  created_at: string;
  average_rating: number;
  reviews_count: number;
}
