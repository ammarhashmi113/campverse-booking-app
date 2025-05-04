# Campverse

Campverse is a full-stack web application that allows users to host and book campgrounds. The platform features user authentication, booking management, and campground reviews. It's designed with access control to ensure fair usage and protect user actions.

## 🌐 Features

- 🛡️ User authentication (Register/Login)
- 🏕️ Add/Edit/Delete campgrounds (campground owner only)
- 📅 Booking system:
  - Only logged-in users can send booking requests.
  - Campground owners can accept or decline requests (with mandatory reason on decline).
  - Incoming and outgoing requests are separated and shown clearly.
- ✍️ Reviews:
  - Only users with accepted bookings can leave reviews.
  - Reviews can be deleted only by their owners.
- 🔐 Authorization:
  - Campground owners cannot review or book their own camps.
  - Campground owners cannot delete other users' reviews.
  - Owners cannot undo their booking decision after accepting or declining.
- ⚠️ Protected routes and 404 page
- ✅ Frontend UI includes toast notifications, confirmation modals, and client-side route guarding.

## 🛠️ Tech Stack

### Frontend
- React (with Vite)
- React Router
- Toast Notifications
- Custom confirmation modals

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Joi for request validation
- Custom `AppError` class and centralized error handling
- JWT authentication

## 🚀 How to Run Locally

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ammarhashmi113/campverse-booking-app.git
   cd campverse-booking-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create a .env file with:
   # MONGO_URI=<your_mongodb_connection_string>
   # JWT_SECRET=<your_secret_key>
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## 🌍 Live Link

🚧 **Deployment in progress** — Stay tuned for the live version!

## 📂 Folder Structure

```
campverse-booking-app/
├── backend/         # Node.js, Express, MongoDB backend
├── frontend/        # React + Vite frontend
└── README.md        # This file
```

## 📄 License

This project is licensed under the MIT License.
