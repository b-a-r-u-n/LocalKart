# LocalKart
# 🛒 LocalKart – MERN Stack E-commerce Application

**LocalKart** is a full-stack e-commerce web application built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**. It enables users to browse products, manage carts, add delivery addresses, and place orders seamlessly.

The project is designed with scalability in mind and can be extended into a **hyperlocal marketplace**, connecting nearby vendors with customers.

---

## 🚀 Live Demo

🔗 **Live Project:** https://your-live-link.com

---

## ✨ Features

* 🔐 Secure Authentication (JWT-based login & registration)
* 🛍️ Product Listing & Detailed View
* 🛒 Cart Management (Add / Update / Remove Items)
* 📦 Order Placement System
* 📍 Address Management (Default Address Support)
* 🖼️ Image Upload via Cloudinary
* ⚡ RESTful API Architecture
* 🔄 Global State Management using Redux Toolkit

---

## 🧱 Tech Stack

### 💻 Frontend (Client)

* React.js
* Redux Toolkit
* Vite

### 🖥️ Backend (Server)

* Node.js
* Express.js
* MongoDB (Mongoose ODM)

### ☁️ Services & Tools

* Cloudinary – Image Storage
* Multer – File Upload Handling

---

## 📁 Project Structure

```bash
LocalKart/
│
├── client/                  # Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── server/                  # Backend (Node + Express)
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── db/              # Database connection
│   │   ├── middlewares/     # Custom middlewares
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   ├── app.js
│   │   ├── constant.js
│   │   └── index.js
│   ├── public/
│   ├── .env
│   └── package.json
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/b-a-r-u-n/LocalKart.git
cd LocalKart
```

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the **server/** directory:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
ORIGIN=your_frontend_url

# JWT Configuration
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=short_duration
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=long_duration

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run the backend server:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file inside the **client/** directory:

```env
VITE_BASE_URL=your_backend_url
VITE_NUMBER=your_whatsapp_number
```

Run the frontend:

```bash
npm run dev
```

---

### 4️⃣ Run the Application

Open your browser and navigate to:

```
http://localhost:5173
```

---

## 🔄 Application Workflow

1. User registers or logs in
2. Browse available products
3. Add items to cart
4. Manage delivery address
5. Place an order

---

## 🎯 Project Objective

The primary objective of LocalKart is to build a **production-ready e-commerce platform** with robust backend architecture and efficient frontend state management.

It also serves as a foundation for building:

* 🏪 Multi-vendor marketplaces
* 📍 Location-based shopping platforms
* ⚡ Hyperlocal delivery systems

---

## 🚀 Future Enhancements

* 💳 Payment Gateway Integration (Razorpay / Stripe)
* 📦 Real-time Order Tracking
* 🛍️ Multi-vendor Dashboard
* 📱 Fully Responsive Mobile UI

---

## 👨‍💻 Author

**Barun Kumar Mahakud**
📍 Bhubaneswar, Odisha, India
🔗 GitHub: https://github.com/b-a-r-u-n

---

## ⭐ Support

If you found this project helpful, please consider giving it a ⭐ on GitHub!
