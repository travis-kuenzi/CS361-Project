import {default as express } from "express";
import * as mealPlanController from "../controllers/mealPlanController.mjs";

const router = express.Router();

router.get("/viewMealPlan/:userID/:date", mealPlanController.viewMealPlan);
router.get("/addMealForm/:recipeID", mealPlanController.addMealForm);

router.post("/addMeal", mealPlanController.addMeal);

export default router;