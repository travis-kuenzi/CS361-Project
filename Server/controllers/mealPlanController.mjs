import {default as mongoose} from "mongoose";
import session from 'express-session';

async function recipeById(recipeId) {
    const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeId}/information`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '9817e57fd8mshf7324149cf3ce09p16854fjsnfbdc7fd0ff39',
            'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        }
    };
    
    try {
        const response = await fetch(url, options);

        // check for invalid response
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const recipe = await response.json();

        return recipe;  // Returns the recipe

    } catch (error) {
        console.error('Error fetching recipe:', error);
        throw error;  // Re-throw the error if you want to handle it later
    }
}


async function viewMealPlan(req, res, next) {
    const { userID, date } = req.params;

    // validate user ID
    if (!mongoose.Types.ObjectId.isValid(userID)) {
        console.log(`Invalid user ID: ${ userID }`);
        return res.status(400).json({ error: "Invalid userID format" });
    }
    console.log("Controller received:", { userID, date });  // DEBUGGING

    // information to connect to microservice via HTTP API
    const url = `http://localhost:3002/getMealPlan/${userID}/${date}`;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            return res.status(400).json({ error: "Fetch failed!\n" });
        }

        const data = await response.json();

        // Initialize an object to hold recipes for each day
        const daysWithRecipes = {};
        const recipeList = [];
        const days = data.mealPlan.days;

        // Loop through the days and replace recipe IDs with recipe details
        for (const day in days) {
            const recipeId = days[day];
            if (recipeId) {
                // If recipeId exists, fetch the full recipe details
                try {
                    const recipe = await recipeById(recipeId);
                    const { id, image, title, servings, readyInMinutes, extendedIngredients } = recipe;

                    const ingredients = extendedIngredients.map(ingredient => ({
                        name: ingredient.name,
                        amount: ingredient.measures.us.amount,
                        unit: ingredient.measures.us.unitShort
                    }));

                    const simplifiedRecipe = {
                        id,
                        imageUri: image,  // Renaming 'image' to 'imageUri' for consistency
                        title,
                        servings,
                        readyInMinutes,
                        ingredients: extendedIngredients
                    };

                    daysWithRecipes[day] = simplifiedRecipe;
                    recipeList.push({
                        title,
                        ingredients
                    });
                } catch (error) {
                    console.error(`Error fetching recipe for ${day}:`, error);
                    daysWithRecipes[day] = null; // Set to null if recipe fetch fails
                }
            } else {
                daysWithRecipes[day] = null; // If no recipe ID, set to null
            }
        }

        console.log(daysWithRecipes);

        console.log("Payload to microservice:", JSON.stringify({ recipes: recipeList }, null, 2));
        

        // make request to the ingredients microservice to get the shopping list
        const shoppingListResponse = await fetch('http://localhost:3010/generate-shopping-list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ recipes: recipeList })
        });

        let shoppingList = {};
        if (shoppingListResponse.ok) {
            const shoppingListData = await shoppingListResponse.json();
            shoppingList = shoppingListData.shoppingList;
            console.log("Shopping list:\n");
            console.log(shoppingList);
        } else {
            console.error("Failed to fetch shopping list from microservice.");
        }

        return res.render('mealPlan', {
            mealPlan: daysWithRecipes,
            shoppingList
        });
        
    } catch {
        console.error("Error in viewMealPlan!");
        return res.status(500).json({ error: "Internal server error. Please try again later." });
    }
};

async function addMealForm(req, res, next) {
    const { recipeID } = req.params;

    res.render("addMealForm", { recipeID });
}

async function addMeal(req, res, next) {
    const { date, userID, day, recipeID } = req.body;

    const mealData = {
        data: {
            date,
            userID,
            day,
            recipe: recipeID
        }
    }

    const url = 'http://localhost:3002/updateMealPlan';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // what is this???
        },
        body: JSON.stringify(mealData) // convert the JavaScript object to a JSON string
    };


    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        console.log(`Message from microservice: ${ data.message }`);

        res.redirect(`viewMealPlan/${userID}/${date}`)
    } catch (error) {
        console.error('Error making the request:', error);
        res.redirect(`/recipes/${recipeID}`)
    }
}


export { viewMealPlan, addMealForm, addMeal }