
async function browseRecipes(req, res, next) {
    try {
        console.log("\nRunning browseRecipes in the recipeController.\n");
        res.render('browseRecipes'); // Render the page for authenticated users
    } catch {
        console.error('Something went wrong when trying to display home:');
    }
};

async function recipeById(req, res, next) {

    const recipeId = req.params.id;

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
        if (response.status != 200)
            throw response.status + " " + response.statusText;


        const recipe = await response.json();

        res.render('singleRecipe.ejs', { recipe: recipe });

    } catch (error) {
        console.error(error);
    }
}

async function addFavorite(req, res, next) {
    const { userID, recipeID, recipeImage, recipeTitle, recipeServings, recipeReadyInMinutes } = req.body;

    const favoriteData = {
        data: {
            userID,
            recipeID,
            recipeImage,
            recipeTitle,
            recipeServings,
            recipeReadyInMinutes
        }
    }

    console.log(favoriteData);

    const url = `http://localhost:3003/addFavorite`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(favoriteData) // Convert the JavaScript object to a JSON string
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Add Favorite Response: ${data.message}`);

        res.render("favoriteAdded", { recipeID, data })
    } catch (error) {
        console.error('Error making the request:', error);
    }
}

async function getFavorites(req, res, next) {

    const userID = req.params.userID;

    const url = `http://localhost:3003/favorites/${userID}`;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const results = await response.json();

        //console.log(`Get Favorites Response: ${JSON.stringify(results, null, 2)}`);

        res.render("favorites", { data: results.data });
    } catch (error) {
        console.error('Error making the request:', error);
    }
}


export { browseRecipes, recipeById, addFavorite, getFavorites };