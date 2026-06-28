# 🍳 AI Recipe Generator & Meal Planner

An intelligent, full-stack web application that leverages **Google Gemini AI** to generate personalized recipes based on ingredients you already have, while helping you manage your pantry, schedule meals, and auto-generate grocery shopping lists.

---
## 🚀 [Live Demo](https://ai-recipee-generator-65os.vercel.app) | [Try Demo — No signup needed](https://ai-recipee-generator-65os.vercel.app/login)

## 🚀 Key Features

### 🧠 Smart Recipe Generation & AI Integration
- **Ingredient-Based Suggestions**: Input ingredients manually or sync them automatically from your pantry.
- **Customized Preferences**: Generate recipes according to your dietary restrictions (e.g., Vegetarian, Vegan, Gluten-Free, Keto), preferred cuisines (e.g., Italian, Mexican, Indian, Japanese), serving sizes, and prep/cooking times.
- **Gemini-Powered Engine**: Built with the latest `@google/genai` SDK using `gemini-2.5-flash` to structure instructions, ingredients, exact nutritional information (calories, protein, carbs, fats), and smart cooking tips.
- **Pantry Idea Generator**: Recommends 5 recipe ideas based on ingredients in your pantry, highlighting those expiring soon.

### 🥫 Smart Pantry Manager
- **Stock Management**: Track quantities, measurement units, categories (e.g., Produce, Dairy, Pantry Staples), and expiry dates.
- **Low Stock & Expiry Warnings**: Get clear indicators for ingredients running low or nearing their expiry dates to reduce food waste.
- **AI Auto-Population**: Sync your recipe ingredients straight to your pantry.

### 📅 Interactive Weekly Meal Planner
- **Breakfast, Lunch, & Dinner Scheduling**: Plan your meals day-by-day for the entire week.
- **Recipe Linking**: Search and add your saved AI-generated recipes to any meal slot.
- **Weekly Overview**: Automatic trackers showing total planned meals, recipe statistics, and upcoming dates.

### 🛒 Dynamic Shopping List
- **Auto-Syncing**: Items from your meal plans can be pushed directly to your shopping list.
- **Category Grouping**: Shopping list items are organized by categories for easy in-store navigation.
- **Checklist Mode**: Mark off items as you buy them.

### ⚙️ User Profiles & Dietary Defaults
- Set persistent preferences including default serving size, preferred unit system (metric/imperial), dietary restrictions, and allergic items.
- Dynamic profile updating and secure password change.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4.0, React Router v7, Lucide Icons, React Hot Toast, Date-Fns |
| **Backend** | Node.js, Express (v5.x), PostgreSQL (Neon Serverless Postgres), JWT Authentication, bcryptjs |
| **AI Integration** | Google GenAI SDK (`gemini-2.5-flash`) |
| **Deployment** | Serverless HTTP integration ready for Vercel Functions |

---

## 📁 Project Structure

```
AIRECIPEGENERATOR/
├── backend/
│   ├── api/                  # Vercel serverless function entrypoint
│   ├── config/
│   │   ├── db.js             # PostgreSQL connection pool utilizing pg
│   │   └── schema.sql        # Database schema definitions, indexes, and triggers
│   ├── controllers/          # Backend controllers holding business logic
│   │   ├── authController.js
│   │   ├── mealPlanController.js
│   │   ├── pantryController.js
│   │   ├── recipeController.js
│   │   ├── shoppingListController.js
│   │   └── userController.js
│   ├── middleware/           # Express middleware (JWT token verification)
│   │   └── auth.js
│   ├── models/               # Database models (raw SQL interface classes)
│   │   ├── MealPlan.js
│   │   ├── PantryItem.js
│   │   ├── Recipe.js
│   │   ├── ShoppingList.js
│   │   ├── User.js
│   │   └── UserPreference.js
│   ├── routes/               # API route definitions
│   ├── utils/
│   │   └── gemini.js         # Google Gemini AI connection & parsing helpers
│   ├── migrate.js            # SQL database migration runner script
│   ├── server.js             # Local Express development server
│   └── package.json
├── frontend/
│   ├── public/               # Public static assets
│   ├── src/
│   │   ├── components/       # Shared UI components (Navbar, ProtectedRoute)
│   │   ├── context/          # React Context (AuthContext)
│   │   ├── pages/            # Frontend page views
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── Pantry.jsx
│   │   │   ├── RecipeGenerator.jsx
│   │   │   ├── MyRecipes.jsx
│   │   │   ├── RecipeDetail.jsx
│   │   │   ├── MealPlanner.jsx
│   │   │   ├── ShoppingList.jsx
│   │   │   └── Settings.jsx
│   │   ├── services/         # API connection layer (Axios instance with interceptors)
│   │   │   └── api.js
│   │   ├── App.jsx           # Main routing & application configuration
│   │   ├── index.css         # Tailwind global entry
│   │   └── main.jsx          # React DOM bootstrap
│   ├── package.json
│   └── vite.config.js        # Vite + Tailwind compiler settings
├── vercel.json               # Monorepo service routing configuration
└── README.md
```

---

## 🗄️ Database Schema

The PostgreSQL database uses a relational schema with tables connected via foreign keys and configured with cascade deletes and triggers to auto-update timestamps.

- **`users`**: Account information and encrypted credentials.
- **`user_preferences`**: Dietary requirements, preferred cuisines, and default unit preferences linked to each user.
- **`pantry_items`**: User-added pantry stocks including quantities, units, and optional expiry dates.
- **`recipes`**: AI-generated and saved recipes featuring instructions stored as `JSONB`, difficulty tags, and descriptions.
- **`recipe_ingredients`**: Breakdown of ingredients required for each saved recipe.
- **`recipe_nutrition`**: Macros and caloric details for specific recipes.
- **`meal_plans`**: Meal scheduling records mapping `user_id` and `recipe_id` to a specific date and type (`breakfast`/`lunch`/`dinner`).
- **`shopping_list_items`**: Custom or meal-plan-derived grocery checklists.

---

## ⚙️ Local Setup and Installation

Follow these steps to set up the backend and frontend services locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or higher)
- PostgreSQL (Local server or a hosted service like [Neon DB](https://neon.tech/))
- A Google Gemini API Key (Obtain one from [Google AI Studio](https://aistudio.google.com/))

---

### 1. Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=8000
   DATABASE_URL=postgres://<username>:<password>@<host>/<database>?sslmode=require
   GEMINI_API_KEY=your_gemini_api_key_here
   JWT_SECRET=your_jwt_secret_token_here
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. **Run Database Migrations**:
   This runs the migration script which reads the database schema and generates all the tables, indexes, and trigger functions:
   ```bash
   node migrate.js
   ```

5. **Start the Dev Server**:
   ```bash
   npm run dev
   ```
   The backend server will run on `http://localhost:8000`.

---

### 2. Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `frontend/` directory (or duplicate `.env.example`):
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Vite will serve the frontend client on `http://localhost:5173`.

---

## 🚀 Deployment

The project is structured to deploy directly as a monorepo on **Vercel** via the root `vercel.json` routing configuration:

- **Frontend**: Served as a static Vite build.
- **Backend**: Express routes are loaded inside serverless environment entrypoints (`backend/api/` or via `serverless-http` wrapper in `server.js`).

To deploy using the Vercel CLI:
```bash
vercel
```
Ensure your environment variables (`DATABASE_URL`, `GEMINI_API_KEY`, `JWT_SECRET`) are configured in your Vercel project dashboard settings.
