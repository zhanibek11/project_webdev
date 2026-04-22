from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Location, Listing, Booking, Review, UserProfile, Amenity, ListingAmenity


# ===== serializers.Serializer (4 штуки) =====

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=6, write_only=True)
    password2 = serializers.CharField(min_length=6, write_only=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Пользователь уже существует")
        return value

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Пароли не совпадают")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        UserProfile.objects.create(user=user)
        return user


class BookingCreateSerializer(serializers.Serializer):
    listing_id = serializers.IntegerField()
    check_in = serializers.DateField()
    check_out = serializers.DateField()
    guests_count = serializers.IntegerField(min_value=1, max_value=20)

    def validate(self, data):
        if data['check_in'] >= data['check_out']:
            raise serializers.ValidationError("Дата выезда должна быть позже даты заезда")
        return data


class ContactSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    message = serializers.CharField(max_length=1000)

    def validate_message(self, value):
        if len(value) < 10:
            raise serializers.ValidationError("Сообщение слишком короткое")
        return value


class SearchSerializer(serializers.Serializer):
    query = serializers.CharField(max_length=200, required=False, allow_blank=True)
    city = serializers.CharField(max_length=50, required=False, allow_blank=True)
    listing_type = serializers.CharField(max_length=20, required=False, allow_blank=True)
    meal_plan = serializers.CharField(max_length=20, required=False, allow_blank=True)
    min_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    max_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)


# ===== serializers.ModelSerializer (6 штук) =====

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined']


class LocationSerializer(serializers.ModelSerializer):
    listings_count = serializers.SerializerMethodField()

    class Meta:
        model = Location
        fields = '__all__'

    def get_listings_count(self, obj):
        return obj.listings.filter(is_active=True).count()


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = '__all__'


class ListingSerializer(serializers.ModelSerializer):
    location_name = serializers.CharField(source='location.name', read_only=True)
    city = serializers.CharField(source='location.city', read_only=True)
    host_name = serializers.CharField(source='host.username', read_only=True)
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = '__all__'

    def get_average_rating(self, obj):
        return obj.average_rating()

    def get_reviews_count(self, obj):
        return obj.reviews.count()


class BookingSerializer(serializers.ModelSerializer):
    listing_title = serializers.CharField(source='listing.title', read_only=True)
    listing_image = serializers.CharField(source='listing.image_url', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['user', 'total_price', 'created_at']


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['user', 'listing' , 'created_at']