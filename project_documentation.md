# SubTracker 3D - Project Documentation 🌌

SubTracker 3D is a premium, production-quality **3D Subscription Tracker** web application designed to feel like a modern fintech SaaS dashboard. Users can manage all recurring subscriptions (Netflix, Spotify, AWS, software licenses, etc.) while exploring expense distributions through interactive 3D elements and animated charts.

The site is built with a **Hybrid Database Sync** design. If a connection to MongoDB fails, the system automatically falls back to a lightweight, local JSON file-based database. This ensures the app is fully functional out of the box with zero external dependencies.

---

## 🖼️ Application Visual Walkthrough

Browse through the screenshots of SubTracker 3D below to see its premium 3D design and layout:

````carousel
![Landing Page](/C:/Users/user/.gemini/antigravity-ide/brain/76a0800b-1207-463f-aa62-c367f70ed588/landing_page.png)
<!-- slide -->
![User Dashboard](/C:/Users/user/.gemini/antigravity-ide/brain/76a0800b-1207-463f-aa62-c367f70ed588/dashboard.png)
<!-- slide -->
![Subscriptions Manager](/C:/Users/user/.gemini/antigravity-ide/brain/76a0800b-1207-463f-aa62-c367f70ed588/subscriptions.png)
<!-- slide -->
![Analytics Dashboard](/C:/Users/user/.gemini/antigravity-ide/brain/76a0800b-1207-463f-aa62-c367f70ed588/analytics.png)
````

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

## 📂 Interactive Project Directory Structure

You can navigate directly to the workspace files by clicking the links below:

### Root Level Configurations
* [package.json](file:///c:/Users/user/Desktop/Subscription%20Tracker/package.json) – Root monorepo dev orchestrator.
* [README.md](file:///c:/Users/user/Desktop/Subscription%20Tracker/README.md) – Project overview.
* [docker-compose.yml](file:///c:/Users/user/Desktop/Subscription%20Tracker/docker-compose.yml) – Multi-container setup.
* [Dockerfile](file:///c:/Users/user/Desktop/Subscription%20Tracker/Dockerfile) – Backend containerization settings.
* [render.yaml](file:///c:/Users/user/Desktop/Subscription%20Tracker/render.yaml) – Cloud deployment configurations.

### 🌐 Backend Component
* [backend/package.json](file:///c:/Users/user/Desktop/Subscription%20Tracker/backend/package.json) – Backend dependency manifests.
* [backend/server.js](file:///c:/Users/user/Desktop/Subscription%20Tracker/backend/server.js) – Entry point, middleware configurations, security bindings.
* [backend/nodemon.json](file:///c:/Users/user/Desktop/Subscription%20Tracker/backend/nodemon.json) – Server hot-reload watch settings.
* [backend/config/db.js](file:///c:/Users/user/Desktop/Subscription%20Tracker/backend/config/db.js) – Database connection manager and hybrid sync adapter.
* [backend/data/db.json](file:///c:/Users/user/Desktop/Subscription%20Tracker/backend/data/db.json) – Local database fallback file when MongoDB is unavailable.

#### Middleware Settings
* [backend/middleware/auth.js](file:///c:/Users/user/Desktop/Subscription%20Tracker/backend/middleware/auth.js) – JWT authentication & header validator.
* [backend/middleware/validation.js](file:///c:/Users/user/Desktop/Subscription%20Tracker/backend/middleware/validation.js) – Form field validation logic using Express Validator.
* [backend/middleware/errorHandler.js](file:///c:/Users/user/Desktop/Subscription%20Tracker/backend/middleware/errorHandler.js) – Centralized REST exception response wrapper.

#### Database Models
* [backend/models/User.js](file:///c:/Users/user/Desktop/Subscription%20Tracker/backend/models/User.js) – User schema & Local File adapter fallback hooks.
* [backend/models/Subscription.js](file:///c:/Users/user/Desktop/Subscription%20Tracker/backend/models/Subscription.js) – Subscription schema & fallback hooks.

#### Router Endpoints
* [backend/routes/auth.js](file:///c:/Users/user/Desktop/Subscription%20Tracker/backend/routes/auth.js) – Registration, login, and user profile routes.
* [backend/routes/subscriptions.js](file:///c:/Users/user/Desktop/Subscription%20Tracker/backend/routes/subscriptions.js) – CRUD routes for subscriptions (supports sorting and filters).
* [backend/routes/dashboard.js](file:///c:/Users/user/Desktop/Subscription%20Tracker/backend/routes/dashboard.js) – KPI summaries, aggregation, and chart datasets.
* [backend/routes/reminders.js](file:///c:/Users/user/Desktop/Subscription%20Tracker/backend/routes/reminders.js) – Upcoming bills alerts engine.

### 🎨 Frontend Component
* [frontend/package.json](file:///c:/Users/user/Desktop/Subscription%20Tracker/frontend/package.json) – Frontend client dependencies.
* [frontend/vite.config.js](file:///c:/Users/user/Desktop/Subscription%20Tracker/frontend/vite.config.js) – Vite compiler options.
* [frontend/index.html](file:///c:/Users/user/Desktop/Subscription%20Tracker/frontend/index.html) – HTML index template with SEO tags.
* [frontend/src/main.jsx](file:///c:/Users/user/Desktop/Subscription%20Tracker/frontend/src/main.jsx) – Core React root initialization.
* [frontend/src/App.jsx](file:///c:/Users/user/Desktop/Subscription%20Tracker/frontend/src/App.jsx) – Router mappings and authentication middleware page guards.
* [frontend/src/index.css](file:///c:/Users/user/Desktop/Subscription%20Tracker/frontend/src/index.css) – Base design system, custom font loaders, glow variables, and Tailwind bindings.

#### Utilities & Contexts
* [frontend/src/utils/api.js](file:///c:/Users/user/Desktop/Subscription%20Tracker/frontend/src/utils/api.js) – Axios client setup with auto-attached JWT headers.
* [frontend/src/utils/currency.js](file:///c:/Users/user/Desktop/Subscription%20Tracker/frontend/src/utils/currency.js) – Currency normalization & conversion tools.
* [frontend/src/context/AuthContext.jsx](file:///c:/Users/user/Desktop/Subscription%20Tracker/frontend/src/context/AuthContext.jsx) – React context holding active user login state.

#### Reusable UI Components
* [frontend/src/components/3D/HeroCanvas.jsx](file:///c:/Users/user/Desktop/Subscription%20Tracker/frontend/src/components/3D/HeroCanvas.jsx) – 3D floating credit card & space landing canvas.
* [frontend/src/components/3D/DashboardCanvas.jsx](file:///c:/Users/user/Desktop/Subscription%20Tracker/frontend/src/components/3D/DashboardCanvas.jsx) – 3D financial globe and category cubes workspace.
* [frontend/src/components/Navbar.jsx](file:///c:/Users/user/Desktop/Subscription%20Tracker/frontend/src/components/Navbar.jsx) – Top bar dashboard controller.
* [frontend/src/components/Sidebar.jsx](file:///c:/Users/user/Desktop/Subscription%20Tracker/frontend/src/components/Sidebar.jsx) – Left collateral navigation sidebar.
* [frontend/src/components/KPICard.jsx](file:///c:/Users/user/Desktop/Subscription%20Tracker/frontend/src/components/KPICard.jsx) – Small metric indicators.
* [frontend/src/components/SubscriptionModal.jsx](file:///c:/Users/user/Desktop/Subscription%20Tracker/frontend/src/components/SubscriptionModal.jsx) – Create/edit subscription form overlay.
* [frontend/src/components/SubscriptionCard.jsx](file:///c:/Users/user/Desktop/Subscription%20Tracker/frontend/src/components/SubscriptionCard.jsx) – Dashboard index card detailing renewal and price tags.
* [frontend/src/components/AnalyticsCharts.jsx](file:///c:/Users/user/Desktop/Subscription%20Tracker/frontend/src/components/AnalyticsCharts.jsx) – Custom Recharts area, donut, and ranking visualizations.
* [frontend/src/components/AISpendingInsights.jsx](file:///c:/Users/user/Desktop/Subscription%20Tracker/frontend/src/components/AISpendingInsights.jsx) – Heuristic engine presenting intelligent cost optimization.
* [frontend/src/components/NotificationToast.jsx](file:///c:/Users/user/Desktop/Subscription%20Tracker/frontend/src/components/NotificationToast.jsx) – Custom toast alerting success/error states.

#### Console Page Hubs
* [frontend/src/pages/LandingPage.jsx](file:///c:/Users/user/Desktop/Subscription%20Tracker/frontend/src/pages/LandingPage.jsx) – Marketing hero landing page.
* [frontend/src/pages/Login.jsx](file:///c:/Users/user/Desktop/Subscription%20Tracker/frontend/src/pages/Login.jsx) – SignIn page.
* [frontend/src/pages/Register.jsx](file:///c:/Users/user/Desktop/Subscription%20Tracker/frontend/src/pages/Register.jsx) – SignUp page.
* [frontend/src/pages/Dashboard.jsx](file:///c:/Users/user/Desktop/Subscription%20Tracker/frontend/src/pages/Dashboard.jsx) – Dashboard console overview containing charts, 3D globe, and notifications.
* [frontend/src/pages/SubscriptionsPage.jsx](file:///c:/Users/user/Desktop/Subscription%20Tracker/frontend/src/pages/SubscriptionsPage.jsx) – List, search, filter, and sorting actions.
* [frontend/src/pages/AnalyticsPage.jsx](file:///c:/Users/user/Desktop/Subscription%20Tracker/frontend/src/pages/AnalyticsPage.jsx) – Financial analytics details & CSV/PDF exporter actions.

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
