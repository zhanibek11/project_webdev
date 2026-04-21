export interface Booking {
  id: number;
  user: number;
  username: string;
  listing: number;
  listing_title: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_price: number;
  created_at: string;
}

export interface BookedDate {
  check_in: string;
  check_out: string;
}
