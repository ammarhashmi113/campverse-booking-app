## ⚠️ Backend Hosting Status

The backend APIs are currently offline due to free-tier limits on Render. You can still:

- Explore the fully functional frontend hosted on Vercel
- Review all backend logic, routes, and authentication in the `backend/` folder
- Run the fullstack app locally by following the instructions below

This is a temporary issue and will be resolved once stable hosting is arranged.

---

# 🏕️ Campverse - Full-Stack Campground Booking App

Campverse is a full-stack web application where users can host and book campgrounds. It features JWT-based user authentication, role-based access control, booking management, reviews, and responsive UI with toast notifications and route protection. Built using modern web technologies, Campverse provides both a robust backend and an intuitive frontend for a seamless user experience.

## 🌍 Live Links

-   🌐 [Live App](https://campverse-booking-app.vercel.app)
-   🛠️ [Backend API (currently unavailable because of usage limits)](https://campverse-booking-app.onrender.com)

---

## 🌟 Features

### 🔐 Authentication & Authorization

-   JWT-based secure authentication (Register/Login)
-   Protected routes using token-based middleware
-   Role-based access control:
    -   Only campground owners can edit/delete their listings
    -   Only booking owners can manage their bookings
    -   Only users with accepted bookings can leave reviews
    -   Camp owners cannot book or review their own listings

### 🏕️ Campground Management

-   Add, edit, and delete campgrounds (owners only)
-   Image URL validation and display
-   Real-time UI updates on campground actions

### 📅 Booking System

-   Users can book available campgrounds by selecting start and end dates
-   Booking requests can be:
    -   Accepted (immutable decision)
    -   Declined (requires a reason)
-   View and manage:
    -   Incoming booking requests (for campground owners)
    -   Outgoing booking requests (for regular users)

### ✍️ Review System

-   Users can leave reviews **only** if their booking was accepted
-   Reviews include star ratings (1–5) and text
-   Only review owners can delete their reviews

### 💻 Frontend UI

-   Built with React (Vite), fully responsive
-   Star rating component with visual colors
-   Custom toast notifications for actions
-   Confirmation modals for deletions
-   Mobile-friendly collapsible navigation bar
-   404 Not Found page with friendly UX

### ⚙️ Backend Capabilities

-   Node.js + Express server
-   MongoDB with Mongoose ODM
-   Joi schema validation on all inputs
-   Custom `AppError` class for consistent error handling
-   Centralized error-handling middleware
-   CORS configuration for frontend/backend communication
-   Secure environment variable usage (`.env`)
-   `/api/health` endpoint for deployment status checks

---

## 🛠️ Tech Stack

### Frontend

-   React (with Vite)
-   React Router DOM
-   React Context (Global User State)
-   Toast Notifications
-   Bootstrap (for optional loading skeletons)
-   Custom confirmation modals
-   Vanilla CSS

### Backend

-   Node.js + Express.js
-   MongoDB Atlas + Mongoose
-   JWT Authentication
-   Joi for schema validation
-   Centralized error handling (AppError)
-   CORS

---

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

## 📂 Folder Structure

```
campverse-booking-app/
├── backend/         # Node.js, Express, MongoDB backend
│   ├── models/      # Mongoose models (User, Campground, Booking, Review)
│   ├── routes/      # Express route handlers
│   ├── middleware/  # Auth, error handlers
│   └── utils/       # AppError, validators
├── frontend/        # React + Vite frontend
│   ├── components/  # Reusable React components
│   ├── pages/       # Main route-based views
│   └── context/     # Global state
└── README.md        # This file
```

## 📄 License

This project is licensed under the MIT License.

## 🙌 Acknowledgments

This project is part of a full-stack portfolio to demonstrate proficiency in MERN-based development. Special thanks to all open-source libraries for making this project possible.
