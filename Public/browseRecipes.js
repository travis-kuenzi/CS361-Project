console.log("Script is running");

let searchBtn = document.querySelector("#searchBtn1");
searchBtn.addEventListener("click", search);
let searchBtn2 = document.querySelector("#searchBtn2");
searchBtn2.addEventListener("click", getRandom);

function delay(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getRandom() {
    const recipesDiv = document.querySelector('#recipes');
    // clear the recipes div
    recipesDiv.replaceChildren([]);

    // connection to the API
    const url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random?tags=main%20course&number=2';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '9817e57fd8mshf7324149cf3ce09p16854fjsnfbdc7fd0ff39',
            'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        }
    };

    // try to get the data
    try {
        // fetch the data
        let response = await fetch(url, options);

        // check for invalid response
        if (response.status != 200)
            throw response.status + " " + response.statusText;

        let recipesArray = await response.json();
        console.log(recipesArray);

        for (const recipe of recipesArray.recipes)
        {
            let recipeElement = createCard(recipe);
            recipesDiv.appendChild(recipeElement);
        }

    } catch (error) {
        console.error(error);
    }
}

async function search() {
    const recipesDiv = document.querySelector('#recipes');
    // clear the recipes div
    recipesDiv.replaceChildren([]);

    const input = document.querySelector('#inputTextbox');
    const recipe = input.value;

    // connection to the API
    const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?query=${recipe}&type=main%20course&instructionsRequired=true&fillIngredients=false&addRecipeInformation=false&addRecipeInstructions=false&addRecipeNutrition=false&ignorePantry=true&sort=max-used-ingredients&offset=0&number=2`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '9817e57fd8mshf7324149cf3ce09p16854fjsnfbdc7fd0ff39',
            'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        }
    };

    // try to get the data
    try {
        // fetch the data
        let response = await fetch(url, options);

        // check for invalid response
        if (response.status != 200)
            throw response.status + " " + response.statusText;

        let recipesArray = await response.json();
        console.log(recipesArray);

        for (const recipe of recipesArray.results)
        {
            let recipeElement = createCard(recipe);
            recipesDiv.appendChild(recipeElement);
        }

    } catch (error) {
        console.error(error);
    }
}

function createCard(recipeObj) {
    // Element that contains the card and insert in layout
    let container = createElement('div', 'col-md-3');

    let card = createElement('div', 'recipe-card card h-100 d-flex justify-content-center align-items-center');
    container.appendChild(card);

    let recipeId = recipeObj.id;
    let link = createElement('a', 'recipe-link');
    link.href = `/recipes/${recipeId}`;

    let title = createElement('h2', 'card-title', recipeObj.title);
    link.appendChild(title);

    let img = createElement('img', 'img-fluid recipeImage');
    img.src = recipeObj.image;
    img.style.width = "75%";
    img.style.height = "auto";

    link.appendChild(img);
    card.appendChild(link);

    let recipeInfo = createElement("ul");

    // Adding " minutes" only if the time value exists
    if (recipeObj.preparationMinutes) {
        let prepTime = createElement('li', '', `${recipeObj.preparationMinutes} minutes`);
        recipeInfo.appendChild(prepTime);
    }
    if (recipeObj.cookingMinutes) {
        let cookTime = createElement('li', '', `${recipeObj.cookingMinutes} minutes`);
        recipeInfo.appendChild(cookTime);
    }
    if (recipeObj.readyInMinutes) {
        let totalTime = createElement('li', '', `${recipeObj.readyInMinutes} minutes`);
        recipeInfo.appendChild(totalTime);
    }

    card.appendChild(recipeInfo);

    return container;
}

function createElement(type, classes, data = null) {
    let element = document.createElement(type);
    element.className = classes;
    if (data) {
      element.innerHTML = data;
    }
    return element;
}
