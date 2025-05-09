# 🏋️‍♂️ Gym Management System

## 📌 Project Overview

The Gym Management System is a full-stack web application designed to streamline the management of gym memberships, user registrations, slot bookings, and plans. It provides both admins and users with an intuitive interface to handle daily gym activities, ensuring smooth and secure operation of services.

---

## 🚀 Features

- User Registration & Login (JWT-based authentication)
- Membership Plan Management (CRUD operations)
- Slot Booking for Gym Sessions
- Responsive UI for Admin and User dashboards
- RESTful API integration
- Secure data handling with authentication and authorization

---

## 📸 Project Screenshots

### 🔐 Login Page
![Login Screenshot](![Screenshot 2025-03-27 112108](https://github.com/user-attachments/assets/d5a729a4-205c-4ed4-9e09-b4ae6977c33b)
)

### 🏠 User Dashboard
![Dashboard Screenshot](![Screenshot 2025-03-27 112422](https://github.com/user-attachments/assets/2d8b859e-9a51-436b-814f-a3006ac50e21)
)

### 📅 Slot Booking
![Slot Booking Screenshot](![Screenshot 2025-03-27 112502](https://github.com/user-attachments/assets/48093650-bc79-4228-90a5-311b2005b4f7)
)


## ⚙️ Technologies Used

### 🖥️ Frontend
- **React.js** – UI development with reusable components
- **Tailwind CSS** – Utility-first responsive styling
- **Axios** – For making API calls to the backend
- **React Router** – Navigation between pages

### 🌐 Backend
- **Node.js** – JavaScript runtime environment
- **Express.js** – Web application framework for REST APIs
- **MongoDB** – NoSQL database for storing user, plan, and booking data
- **Mongoose** – ODM for MongoDB
- **JWT (JSON Web Token)** – Secure authentication

---

## 📂 Project Structure
gym-management-system/
│
├── client/ # React frontend
│ ├── public/
│ └── src/
│ ├── components/ # Reusable React components (e.g., Navbar, MembershipCard)
│ ├── pages/ # Page components (Dashboard, Login, AddMembership)
│ ├── App.js # App root component with routing
│ └── index.js
│
├── server/ # Node.js + Express backend
│ ├── controllers/ # Logic for handling routes
│ ├── models/ # Mongoose schemas for MongoDB
│ ├── routes/ # API endpoints
│ ├── middleware/ # JWT and error handling middleware
│ ├── config/ # DB connection & environment setup
│ └── index.js # Entry point for backend
│
└── README.md


---

## 🔄 Workflow

1. **User Authentication**  
   Users sign up and log in securely using JWT-based authentication.

2. **Membership Management**  
   Admin can add, fetch, and update membership plans via protected routes.

3. **Slot Booking**  
   Users can book available time slots for gym sessions.

4. **Dashboard**  
   Real-time rendering of data using API integration with Axios.

---

## 🛡️ Security

- Passwords are securely hashed.
- JWT is used for protected routes.
- CORS and cookie-based sessions handled for cross-origin safety.


