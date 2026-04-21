
# Create your views here.

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Location, Listing, Booking, Review, Amenity, ListingAmenity
from .serializers import *


# FBV

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'message': 'Регистрация успешна', 'username': user.username}, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([AllowAny])
def locations_view(request):
    city = request.query_params.get('city', None)
    locations = Location.objects.all()
    if city:
        locations = locations.filter(city=city)
    serializer = LocationSerializer(locations, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_bookings_view(request):
    bookings = Booking.objects.filter(user=request.user).order_by('-created_at')
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def cancel_booking_view(request, pk):
    try:
        booking = Booking.objects.get(pk=pk, user=request.user)
        if booking.status == 'cancelled':
            return Response({'error': 'Бронь уже отменена'}, status=400)
        booking.status = 'cancelled'
        booking.save()
        return Response({'message': 'Бронь отменена'})
    except Booking.DoesNotExist:
        return Response({'error': 'Бронь не найдена'}, status=404)


@api_view(['GET'])
@permission_classes([AllowAny])
def listing_booked_dates_view(request, pk):
    bookings = Booking.objects.filter(
        listing_id=pk,
        status__in=['pending', 'confirmed']
    )
    booked = [{'check_in': str(b.check_in), 'check_out': str(b.check_out)} for b in bookings]
    return Response(booked)


@api_view(['GET'])
@permission_classes([AllowAny])
def amenities_view(request):
    amenities = Amenity.objects.all()
    return Response(AmenitySerializer(amenities, many=True).data)


@api_view(['POST'])
@permission_classes([AllowAny])
def contact_view(request):
    serializer = ContactSerializer(data=request.data)
    if serializer.is_valid():
        return Response({'message': f"Спасибо {serializer.validated_data['name']}! Мы свяжемся с вами."})
    return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([AllowAny])
def search_listings_view(request):
    q = request.query_params.get('q', '')
    city = request.query_params.get('city', '')
    listing_type = request.query_params.get('type', '')
    meal_plan = request.query_params.get('meal_plan', '')
    min_price = request.query_params.get('min_price')
    max_price = request.query_params.get('max_price')

    listings = Listing.active.all()
    if q:
        listings = listings.filter(title__icontains=q)
    if city:
        listings = listings.filter(location__city=city)
    if listing_type:
        listings = listings.filter(listing_type=listing_type)
    if meal_plan:
        listings = listings.filter(meal_plan=meal_plan)
    if min_price:
        listings = listings.filter(price_per_night__gte=min_price)
    if max_price:
        listings = listings.filter(price_per_night__lte=max_price)

    return Response(ListingSerializer(listings, many=True).data)


# CBV
class ListingListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        listings = Listing.active.all()
        city = request.query_params.get('city')
        listing_type = request.query_params.get('type')
        meal_plan = request.query_params.get('meal_plan')
        if city:
            listings = listings.filter(location__city=city)
        if listing_type:
            listings = listings.filter(listing_type=listing_type)
        if meal_plan:
            listings = listings.filter(meal_plan=meal_plan)
        return Response(ListingSerializer(listings, many=True).data)

    def post(self, request):
        serializer = ListingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(host=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class ListingDetailView(APIView):
    permission_classes = [AllowAny]

    def get_object(self, pk):
        try:
            return Listing.objects.get(pk=pk)
        except Listing.DoesNotExist:
            return None

    def get(self, request, pk):
        listing = self.get_object(pk)
        if not listing:
            return Response({'error': 'Не найдено'}, status=404)
        return Response(ListingSerializer(listing).data)

    def put(self, request, pk):
        listing = self.get_object(pk)
        if not listing:
            return Response({'error': 'Не найдено'}, status=404)
        if listing.host != request.user:
            return Response({'error': 'Нет доступа'}, status=403)
        serializer = ListingSerializer(listing, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        listing = self.get_object(pk)
        if not listing:
            return Response({'error': 'Не найдено'}, status=404)
        if listing.host != request.user:
            return Response({'error': 'Нет доступа'}, status=403)
        listing.is_active = False
        listing.save()
        return Response({'message': 'Удалено'}, status=204)


class BookingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookings = Booking.confirmed.filter(user=request.user)
        return Response(BookingSerializer(bookings, many=True).data)

    def post(self, request):
        serializer = BookingCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        data = serializer.validated_data
        try:
            listing = Listing.objects.get(pk=data['listing_id'])
        except Listing.DoesNotExist:
            return Response({'error': 'Юрта не найдена'}, status=404)

        conflict = Booking.objects.filter(
            listing=listing,
            status__in=['pending', 'confirmed'],
            check_in__lt=data['check_out'],
            check_out__gt=data['check_in']
        ).exists()

        if conflict:
            return Response({'error': 'Эти даты уже заняты'}, status=400)

        nights = (data['check_out'] - data['check_in']).days
        total = listing.price_per_night * nights

        booking = Booking.objects.create(
            user=request.user,
            listing=listing,
            check_in=data['check_in'],
            check_out=data['check_out'],
            guests_count=data['guests_count'],
            total_price=total,
            status='confirmed'
        )
        return Response(BookingSerializer(booking).data, status=201)


class ReviewView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request, pk):
        reviews = Review.objects.filter(listing_id=pk).order_by('-created_at')
        return Response(ReviewSerializer(reviews, many=True).data)

    def post(self, request, pk):
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, listing_id=pk)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def put(self, request):
        profile = request.user.profile
        if 'phone' in request.data:
            profile.phone = request.data['phone']
        if 'bio' in request.data:
            profile.bio = request.data['bio']
        profile.save()
        return Response({'message': 'Профиль обновлён'})


class ListingAmenitiesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        amenities = ListingAmenity.objects.filter(listing_id=pk)
        return Response(AmenitySerializer([a.amenity for a in amenities], many=True).data)


class StatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            'total_listings': Listing.active.count(),
            'total_bookings': Booking.objects.count(),
            'total_users': User.objects.count(),
            'total_reviews': Review.objects.count(),
            'confirmed_bookings': Booking.confirmed.count(),
            'cities': ['Алматы', 'Астана', 'Актау', 'Шымкент', 'Туркестан', 'Караганда'],
        })