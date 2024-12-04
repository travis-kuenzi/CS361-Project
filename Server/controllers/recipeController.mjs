
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

export {browseRecipes, recipeById};