import {default as express } from "express";
import * as recipeController from "../controllers/recipeController.mjs";

const router = express.Router();

router.get("/", recipeController.browseRecipes); 
router.get("/:id", recipeController.recipeById);


export default router;