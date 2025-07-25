# Payment Gateway System

A full-stack payment gateway system built with **Node.js/Express/MongoDB** (Backend) and **React/Vite** (Frontend), supporting user authentication, Stripe payments, and an admin dashboard.

---

## Features

- User registration and login (JWT-based)
- Role-based access: user and admin
- Stripe payment integration
- Transaction history for users and admins
- Admin can view all transactions with usernames
- Secure backend with CORS and environment variable support

---

## Project Structure

```
Payment-gateway-system/
  ├── Backend/
  │   ├── app.js
  │   ├── config/
  │   ├── controllers/
  │   ├── middleware/
  │   ├── models/
  │   ├── routes/
  │   ├── package.json
  └── Frontend/
      ├── src/
      ├── public/
      ├── package.json
      ├── vite.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB
- Stripe account (for API keys)
- [Stripe CLI](https://stripe.com/docs/stripe-cli) (for local webhook testing)

---

### 1. Backend Setup

```bash
cd Backend
npm install
```

#### Create a `.env` file in `Backend/`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

#### Start the backend server:

```bash
node app.js
```

---

### 2. Frontend Setup

```bash
cd Frontend
npm install
```

#### Create a `.env` file in `Frontend/`:

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
```

#### Start the frontend dev server:

```bash
npm run dev
```

---

### 3. Stripe Webhook (Local Development)

To test payment status updates, use the Stripe CLI:

```bash
stripe listen --forward-to localhost:5000/api/payment/webhook
```

Copy the webhook secret from the CLI output and set it as `STRIPE_WEBHOOK_SECRET` in your backend `.env`.

---

## Usage

- **User:** Can register, login, make payments, and view their own transactions.
- **Admin:** Can login and view all transactions, including the username of each user.

---

## Stripe Test Card

To test payments in development, use the following Stripe test card number:

- **Card Number:** `4242 4242 4242 4242`
- **Expiry:** Any future date (e.g., 12/34)
- **CVC:** Any 3 digits (e.g., 123)
- **ZIP:** Any 5 digits (e.g., 12345)

See more test cards in the [Stripe docs](https://stripe.com/docs/testing#international-cards).

---

## Environment Variables

**Backend (`Backend/.env`):**
- `PORT` - Port for backend server (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- `STRIPE_SECRET_KEY` - Stripe secret key (from Stripe dashboard)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret (from Stripe CLI or dashboard)

**Frontend (`Frontend/.env`):**
- `VITE_API_BASE_URL` - URL of the backend API
- `VITE_REACT_APP_STRIPE_PUBLIC_KEY` - Stripe publishable key

---

## Scripts

**Backend:**
- `node app.js` — Start backend server

**Frontend:**
- `npm run dev` — Start frontend dev server
- `npm run build` — Build frontend for production

---

## Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose, Stripe, JWT, CORS
- **Frontend:** React, Vite, Axios, Stripe.js, Tailwind CSS

---

## License

ISC

---

## Author

Ansh Garg

---

**Tip:**  
- Never commit your real `.env` files to GitHub. Use `.env.example` to show required variables.
