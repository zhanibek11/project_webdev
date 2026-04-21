from django.contrib import admin
from .models import Location, Listing, Booking, Review, UserProfile, Amenity, ListingAmenity

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'latitude', 'longitude']
    list_filter = ['city']

@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon']

@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ['title', 'location', 'listing_type', 'meal_plan', 'price_per_night', 'is_active']
    list_filter = ['listing_type', 'meal_plan', 'is_active']

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['user', 'listing', 'check_in', 'check_out', 'status', 'total_price']
    list_filter = ['status']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'listing', 'rating', 'created_at']

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone']

@admin.register(ListingAmenity)
class ListingAmenityAdmin(admin.ModelAdmin):
    list_display = ['listing', 'amenity']