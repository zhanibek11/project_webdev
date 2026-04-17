from django.db import models
from django.contrib.auth.models import User


# Custom Manager #1
class ActiveListingManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)


# Custom Manager #2
class ConfirmedBookingManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(status='confirmed')


# Модель 1
class Location(models.Model):
    CITY_CHOICES = [
        ('almaty', 'Алматы'),
        ('astana', 'Астана'),
        ('aktau', 'Актау'),
        ('shymkent', 'Шымкент'),
        ('turkestan', 'Туркестан'),
        ('karaganda', 'Караганда'),
    ]
    name = models.CharField(max_length=100)
    city = models.CharField(max_length=50, choices=CITY_CHOICES)
    description = models.TextField(blank=True)
    latitude = models.FloatField(default=0)
    longitude = models.FloatField(default=0)
    image_url = models.URLField(blank=True, default='')

    def __str__(self):
        return f"{self.name} ({self.city})"


# Модель 2
class Amenity(models.Model):
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.name


# Модель 3
class Listing(models.Model):
    TYPE_CHOICES = [
        ('family', 'Для семьи'),
        ('couple', 'Для двоих'),
        ('solo', 'Соло'),
        ('group', 'Группа'),
    ]
    MEAL_CHOICES = [
        ('all_inclusive', 'Всё включено'),
        ('breakfast', 'Только завтрак'),
        ('self_catering', 'Без питания'),
        ('half_board', 'Полупансион'),
    ]

    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')          # FK 1
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='listings')  # FK 2
    title = models.CharField(max_length=200)
    description = models.TextField()
    listing_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    meal_plan = models.CharField(max_length=20, choices=MEAL_CHOICES)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    max_guests = models.IntegerField(default=2)
    image_url = models.URLField(blank=True, default='')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()
    active = ActiveListingManager()

    def __str__(self):
        return self.title

    def average_rating(self):
        reviews = self.reviews.all()
        if reviews:
            return round(sum(r.rating for r in reviews) / len(reviews), 1)
        return 0


# Модель 4
class ListingAmenity(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='amenities')  # FK 3
    amenity = models.ForeignKey(Amenity, on_delete=models.CASCADE)                            # FK 4

    class Meta:
        unique_together = ('listing', 'amenity')

    def __str__(self):
        return f"{self.listing.title} — {self.amenity.name}"


# Модель 5
class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Ожидает'),
        ('confirmed', 'Подтверждено'),
        ('cancelled', 'Отменено'),
        ('completed', 'Завершено'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')        # FK 5
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='bookings')  # FK 6
    check_in = models.DateField()
    check_out = models.DateField()
    guests_count = models.IntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()
    confirmed = ConfirmedBookingManager()

    def __str__(self):
        return f"{self.user.username} → {self.listing.title}"


# Модель 6
class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')        # FK 7
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='reviews')  # FK 8
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'listing')

    def __str__(self):
        return f"{self.user.username} — {self.rating}⭐"


# Модель 7
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')  # FK 9
    phone = models.CharField(max_length=20, blank=True)
    bio = models.TextField(blank=True)
    avatar_url = models.URLField(blank=True, default='')

    def __str__(self):
        return f"Профиль {self.user.username}"