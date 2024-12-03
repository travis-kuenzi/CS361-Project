import {default as express } from "express";
import * as mealPlanController from "../controllers/mealPlanController.mjs";

const router = express.Router();

router.get("/:userID/:date", mealPlanController.getMealPlan); 


export default router;