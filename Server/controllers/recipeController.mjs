
async function browseRecipes(req, res, next) {
    try {
        res.render("browseRecipes.ejs");
    } catch (err) {
        console.error('Something went wrong when trying to display home:', err);
    }
};

async function recipeById(req, res, next) {

    const recipeId = req.params.id;

    const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk?ids=${recipeId}`;
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

        
        const recipeArray = await response.json();
        let recipe = recipeArray[0];

        res.render('singleRecipe.ejs', { recipe: recipe });
 
    } catch (error) {
        console.error(error);
    }

}

export {browseRecipes, recipeById};