# Qazaq Rent

## 🏕️ Qazaq Rent

---

## 👥 Team Members

* Kuanysh Zhanibek
* Yessentay Adil
* Mukhantay Imangali

---

## 📌 Project Description

Qazaq Rent is a web platform for discovering and booking unique nature accommodations across Kazakhstan — yurts, eco-houses, glamping sites, and mountain retreats.

Kazakhstan has some of the most stunning landscapes in Central Asia, yet there is no dedicated platform for booking authentic local stays. **Qazaq Rent** fills that gap by connecting guests with local hosts offering one-of-a-kind nature experiences.

The system provides functionality for:

* User authentication (registration and login)
* Listing and managing properties for hosts
* Browsing and filtering accommodations by location and type
* Submitting booking requests linked to authenticated users
* Writing reviews and ratings after a completed stay

This project is developed as part of the Web Development course at KBTU using Angular 17 for the frontend and Django REST Framework for the backend.

### Project Goals

The main goal of this project is to build a full-stack web application that demonstrates:

* Frontend-backend interaction via REST API
* User authentication with JWT
* CRUD operations for managing listings and bookings
* Clean UI with basic user experience

---

## ⚙️ Tech Stack

**Frontend**
* Angular 17 (TypeScript)
* HTML, CSS
* Angular Router
* HttpClient

**Backend**
* Django
* Django REST Framework (DRF)

**Database**
* SQLite (development)
* PostgreSQL (optional)

**Authentication**
* JWT (JSON Web Token)

---

## 🚀 Planned Features

### 🔐 Authentication
* User registration
* User login / logout
* JWT-based authentication

### 🏠 Listings
* Add new property listing
* View all listings
* Update listing details
* Delete a listing

### 📅 Bookings
* Submit a booking request for a listing
* View personal bookings
* Track booking status

### ⭐ Reviews
* Add a review for a completed stay
* Rate accommodations (1–5 stars)
* View all reviews for a listing

---

## 🔗 API Endpoints (Planned)

* `POST /api/register/`
* `POST /api/login/`
* `GET /api/listings/`
* `POST /api/listings/`
* `GET /api/listings/{id}/`
* `PUT /api/listings/{id}/`
* `DELETE /api/listings/{id}/`
* `GET /api/bookings/`
* `POST /api/bookings/`
* `GET /api/reviews/`
* `POST /api/reviews/`

---

## 🛠 Installation & Setup (Planned)

**Frontend**
```
cd frontend
npm install
ng serve
```

**Backend**
```
cd backend
pip install -r requirements.txt
python manage.py runserver
```

---

## 📎 Repository Link

[https://github.com/zhanibek11/project_webdev](https://github.com/zhanibek11/project_webdev)
