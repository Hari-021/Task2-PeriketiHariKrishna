# SubTracker 3D 🌌

SubTracker 3D is a premium, production-quality **3D Subscription Tracker** web application designed to feel like a modern fintech SaaS dashboard. Users can manage all recurring subscriptions (Netflix, Spotify, AWS, software licenses, etc.) while exploring expense distributions through interactive 3D elements and animated charts.

The site is built with a **Hybrid Database Sync** design. If a connection to MongoDB fails, the system automatically falls back to a lightweight, local JSON file-based database. This ensures the app is fully functional out of the box with zero external dependencies.

---

## 🛠 Tech Stack

### Frontend
* **React + Vite** – Fast bundling and compilation.
* **Three.js & React Three Fiber** – Interactive 3D credit cards, starfield particles, and connection globes.
* **Tailwind CSS v4** – Modern, high-performance CSS-first styling.
* **Framer Motion** – Smooth page transitions, modal animations, and micro-interactions.
* **Recharts** – Custom-glow area charts, donut distributions, and vertical cost rankings.
* **Axios** – Synchronized API requests with automatic JWT interception.
* **Lucide Icons** – Modern fintech and category vector icons.

### Backend & Database
* **Node.js + Express** – REST API server.
* **Mongoose + MongoDB** – Document schemas (fallback to local `backend/data/db.json`).
* **JWT Authentication** – Secure sessions and route protections.
* **Bcrypt.js** – Secure password hashing.
* **Express Validator** – Request body schema validation.
* **Helmet, Rate Limiter, CORS** – Production-grade security configuration.
* **Morgan** – HTTP request logging.

---

## 💎 Key Features

1. **3D Interactive Hero Canvas**:
   - Floating physical credit card that tilts dynamically to track cursor movements.
   - Orbiting indicator nodes representing top subscription services (Netflix, Spotify, ChatGPT).
   - Rotating floor grids and glowing particle stars.

2. **3D Financial Globe Console**:
   - Rotating wireframe globe displaying geographic nodes.
   - Hoverable category cubes representing expense distributions that scale up and show details.

3. **Complete Subscription CRUD**:
   - Add, edit, delete, pause, resume, and archive subscriptions.
   - Captures Service Name, Plan, Amount, Billing Cycle, Renewal Date, Auto-Renew status, and Notes.

4. **Fintech Analytics**:
   - Normalized monthly and estimated yearly cost summaries.
   - Color-coded indicators tracking remaining days before renewals.
   - **AI Spending Insights**: Heuristic analysis checking for overlapping streaming services, billing cycle recommendations (annual vs. monthly savings), and concentration warnings.

5. **Search, Filter & Sort**:
   - Case-insensitive search on service names.
   - Filters for Category, Billing Cycle, Status, and Min/Max Price.
   - Sorting by Renewal Date, Cost, and Alphabetical order.

6. **Data Exporter**:
   - Download subscription indexes as CSV spreadsheets.
   - Generate printable financial PDF statements.

---

## 📂 Project Directory Structure

```
Subscription Tracker/
├── package.json               # Root monorepo dev orchestrator
├── README.md                  # Project overview
├── backend/
│   ├── package.json           # Backend configuration
│   ├── server.js              # Server entry point & security bindings
│   ├── nodemon.json           # Watch settings (ignores data directory)
│   ├── .env                   # Port & JWT configurations
│   ├── config/
│   │   └── db.js              # DB connector & Hybrid Database Adapter
│   ├── data/
│   │   └── db.json            # Fallback local file database
│   ├── middleware/
│   │   ├── auth.js            # JWT validation
│   │   ├── validation.js      # Input validators
│   │   └── errorHandler.js    # Central exception formatter
│   ├── models/
│   │   ├── User.js            # User model (Mongoose + JSON fallback)
│   │   └── Subscription.js    # Subscription model (Mongoose + JSON fallback)
│   └── routes/
│       ├── auth.js            # Register, Login, Profile endpoints
│       ├── subscriptions.js   # CRUD & filter endpoints
│       ├── dashboard.js       # KPI summaries & charts datasets
│       └── reminders.js       # Upcoming billing notifications
└── frontend/
    ├── package.json           # Frontend configuration
    ├── vite.config.js         # React + Tailwind v4 registrations
    ├── index.html             # Main entry point with SEO metadata
    └── src/
        ├── main.jsx           # App bootstrap
        ├── App.jsx            # Routing and Protected Routes layer
        ├── index.css          # Tailwind imports, fonts, & animations
        ├── utils/
        │   ├── api.js         # Axios client
        │   └── currency.js    # Formatters & converter simulations
        ├── context/
        │   └── AuthContext.jsx # Session tracking
        ├── components/
        │   ├── 3D/
        │   │   ├── HeroCanvas.jsx      # Landing 3D scene
        │   │   └── DashboardCanvas.jsx # Console 3D scene
        │   ├── Navbar.jsx              # Navigation header
        │   ├── Sidebar.jsx             # Collapsible menu
        │   ├── KPICard.jsx             # Animated KPI metrics
        │   ├── SubscriptionModal.jsx   # Form overlay
        │   ├── SubscriptionCard.jsx    # Subscription card
        │   ├── AnalyticsCharts.jsx     # Recharts containers
        │   ├── AISpendingInsights.jsx  # Spending insights engine
        │   └── NotificationToast.jsx   # Feedback toast
        └── pages/
            ├── LandingPage.jsx         # Landing page sections
            ├── Login.jsx               # Auth forms
            ├── Register.jsx
            ├── Dashboard.jsx           # General console hub
            ├── SubscriptionsPage.jsx   # Index list
            └── AnalyticsPage.jsx       # Reports & Exporters
```

---

## ⚡ Setup & Installation

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16.0.0 or higher) and [npm](https://www.npmjs.com/) installed.

### 2. Install Dependencies
Run the command below at the **project root folder** to install root, backend, and frontend dependencies:
```bash
npm run install:all
```

### 3. Environment Configuration
The backend comes pre-configured with default settings, but you can adjust them in `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/subscription-tracker
JWT_SECRET=super_secret_cyber_fintech_key_99812
JWT_EXPIRE=24h
NODE_ENV=development
```

### 4. Running the Development Servers
Launch both the Express API and Vite React server concurrently with a single command from the project root:
```bash
npm run dev
```

* The **Frontend** will launch at: `http://localhost:5173/`
* The **Backend** will bind to: `http://localhost:5000/`

---

## 📡 Backend API Endpoints

### Authentication
* `POST /api/auth/register` - Registers a new user. Returns a signed JWT token and user info.
* `POST /api/auth/login` - Authenticates user. Returns JWT token.
* `GET /api/auth/profile` - Retrieves current user info. *(Protected)*

### Subscriptions
* `GET /api/subscriptions` - Fetches all subscriptions belonging to the user. Supports filtering (`category`, `billingCycle`, `status`, `minPrice`, `maxPrice`) and sorting (`sortBy=cost|renewalDate|serviceName&order=asc|desc`). *(Protected)*
* `GET /api/subscriptions/:id` - Fetches a single subscription by ID. *(Protected)*
* `POST /api/subscriptions` - Creates a new subscription. *(Protected)*
* `PUT /api/subscriptions/:id` - Updates an existing subscription. *(Protected)*
* `DELETE /api/subscriptions/:id` - Deletes a subscription. *(Protected)*

### Dashboard & Analytics
* `GET /api/dashboard/summary` - Aggregates general KPIs and recent activity listings. *(Protected)*
* `GET /api/dashboard/analytics` - Aggregates category distribution ratios and 6-month simulated trends. *(Protected)*
* `GET /api/reminders/upcoming` - Returns a list of active subscriptions renewing within 7 days. *(Protected)*

---

## 🔒 Security Implementations

* **Helmet headers**: Secures requests and masks backend technologies.
* **Express Rate Limiter**: Limits incoming requests to 200 per 15 minutes per IP.
* **CORS configuration**: Limits header connections.
* **Bcrypt Password Hashing**: Passwords are secure in transit and storage.
* **Strict Validator sanitization**: Validates datatypes, ranges, and formats.
* **Global Error handling**: Centralized error capture.
