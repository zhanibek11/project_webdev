"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api import views

urlpatterns = [
    path('admin/', admin.site.urls),
    # Auth
    path('api/register/', views.register_view),
    path('api/login/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
    path('api/me/', views.UserProfileView.as_view()),
    # Locations
    path('api/locations/', views.locations_view),
    # Listings
    path('api/listings/', views.ListingListCreateView.as_view()),
    path('api/listings/<int:pk>/', views.ListingDetailView.as_view()),
    path('api/listings/<int:pk>/booked-dates/', views.listing_booked_dates_view),
    path('api/listings/<int:pk>/amenities/', views.ListingAmenitiesView.as_view()),
    path('api/listings/<int:pk>/reviews/', views.ReviewView.as_view()),
    # Bookings
    path('api/bookings/', views.BookingView.as_view()),
    path('api/my-bookings/', views.my_bookings_view),
    path('api/bookings/<int:pk>/cancel/', views.cancel_booking_view),
    # Search & extras
    path('api/search/', views.search_listings_view),
    path('api/amenities/', views.amenities_view),
    path('api/contact/', views.contact_view),
    path('api/stats/', views.StatsView.as_view()),
]