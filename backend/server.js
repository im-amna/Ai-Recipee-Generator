import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import pantryRoutes from "./routes/pantry.js";
import recipeRoutes from "./routes/recipes.js";
import mealPlanRoutes from "./routes/mealPlan.js";
import shoppingListRoutes from "./routes/shoppingList.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-recipee-generator.vercel.app",
  /https:\/\/ai-recipee-generator-.*-im-amnas-projects\.vercel\.app/
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.some(allowed =>
        typeof allowed === 'string'
          ? allowed === origin
          : allowed.test(origin)
      );
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "AI Recipe Generator API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pantry", pantryRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/meal-plan", mealPlanRoutes);
app.use("/api/shopping-list", shoppingListRoutes);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
