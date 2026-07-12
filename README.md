# 🎟️ Kairo Events

**Kairo Events** is a full-stack event ticketing platform where users can discover events, purchase tickets securely, and manage their bookings — while admins get complete control to create and manage events, track sales, and manage users.

🔗 **Live Demo:** [kairo-events-eta.vercel.app](https://kairo-events-eta.vercel.app/)
🖥️ **Frontend Repo:** [kairo-events](https://github.com/nusratjahan7/kairo-events)
⚙️ **Backend Repo:** [kairo-server](https://github.com/nusratjahan7/kairo-server)

---

## ✨ Features

### For Users

- 🔐 Secure authentication (sign up / sign in) via **BetterAuth**
- 🔍 Browse and search upcoming events
- 💳 Buy event tickets securely with **Stripe**
- 🧾 Download purchased tickets as **PDF**
- 👤 Update personal profile information
- 📱 Fully responsive, animated UI

### For Admins

- 📊 Admin dashboard with analytics charts (**Recharts**)
- 🗓️ Create, update, and delete events
- 👥 Manage all users — **promote a user to admin** or **demote an admin to user**
- 📤 **Export ticket/sales data as CSV**
- 🔒 Role-based access control for admin-only routes

---

## 🛠️ Tech Stack

| Category           | Technology                                       |
| ------------------ | ------------------------------------------------ |
| **Language**       | TypeScript                                       |
| **Frontend**       | Next.js, React.js                                |
| **Backend**        | Node.js, Express.js                              |
| **Authentication** | BetterAuth (token-based, secured backend routes) |
| **Payments**       | Stripe                                           |
| **Animation**      | Framer Motion                                    |
| **Icons**          | React Icons, Lucide React                        |
| **Charts**         | Recharts                                         |
| **Deployment**     | Vercel                                           |

---

## 🏗️ Architecture

This project is split into two repositories:

- **`kairo-events`** — Next.js frontend (user & admin dashboards, UI, client-side logic)
- **`kairo-server`** — Express.js backend (API routes, database, auth, Stripe webhooks)

All backend API routes are protected using **BetterAuth tokens**, ensuring only authenticated and authorized (user/admin) requests can access or modify data.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A package manager (npm / yarn / pnpm)
- MongoDB database (or your configured DB)
- Stripe account (for payment keys)

### 1. Clone the repositories

```bash
git clone https://github.com/nusratjahan7/kairo-events.git
git clone https://github.com/nusratjahan7/kairo-server.git
```

### 2. Setup the backend (`kairo-server`)

```bash
cd kairo-server
npm install
```

Create a `.env` file with the required variables (database URL, BetterAuth secret, Stripe secret key, etc.), then run:

```bash
npm run dev
```

### 3. Setup the frontend (`kairo-events`)

```bash
cd kairo-events
npm install
```

Create a `.env.local` file with the required variables (API base URL, BetterAuth config, Stripe publishable key, etc.), then run:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 📁 Environment Variables

**Frontend (`.env.local`)**

```
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_BETTER_AUTH_URL=
MONGODB_URI=
AUTH_DB_NAME=
NEXT_PUBLIC_BACKEND_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

```

**Backend (`.env`)**

```
PORT=
FRONTEND_URL=
MONGODB_URI=
AUTH_DB_NAME=
STRIPE_SECRET_KEY=

```

> ⚠️ Never commit real `.env` values — replace with your own keys.

---

## 🔐 Authentication & Authorization

- Authentication is handled via **BetterAuth**, with secure tokens verified on every protected backend request.
- Two roles exist: **User** and **Admin**.
- Admins can promote/demote users directly from the admin dashboard, dynamically changing their access level.

---

## 🧾 Tickets & CSV Export

- After a successful Stripe payment, users receive a digital ticket which can be **downloaded as a PDF**.
- Admins can **export all ticket/sales data as a CSV file** for record-keeping and reporting.

---

## 📌 Roadmap / Possible Improvements

- [ ] Email notifications for ticket purchase confirmation
- [ ] QR code check-in system for events
- [ ] Refund/cancellation flow
- [ ] Multi-language support

---

## 🤝 Contributing

This is currently a personal/portfolio project, but suggestions and feedback are always welcome — feel free to open an issue.

---

## 📄 License

This project is open for learning and personal use. Feel free to explore the code.

---

## 👩‍💻 Author

**Nusrat Jahan**
Frontend-leaning Full-Stack Developer (MERN)
📍 Dhaka, Bangladesh
