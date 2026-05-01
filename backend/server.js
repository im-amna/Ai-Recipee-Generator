import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import serverless from "serverless-http";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import pantryRoutes from "./routes/pantry.js";
import recipeRoutes from "./routes/recipes.js";
import mealPlanRoutes from "./routes/mealplans.js";
import shoppingListRoutes from "./routes/shoppingList.js";

const app = express();

const frontendUrl = process.env.FRONTEND_URL;
// Middleware
const allowedOrigins = ["http://localhost:5173", frontendUrl];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow non-browser requests

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "AI Recipe Generator API" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pantry", pantryRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/meal-plan", mealPlanRoutes); // ✅ fixed: meal-plans → meal-plan
app.use("/api/shopping-list", shoppingListRoutes);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

export default serverless(app);