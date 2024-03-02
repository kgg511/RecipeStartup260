async function generate_recipes(){
    try{
        const usernames = JSON.parse(localStorage.getItem("Usernames"));
        const response = await fetch(`/api/recipes?usernames=${usernames}`, {
            method: 'GET',
            headers: {'content-type': 'application/json'},
        });
        const recipes = await response.json();
        for (const recipe of recipes){
            const result = await makeCard(recipe);
            document.querySelector("div.grid").appendChild(result);
        }        
    }
    catch{
        console.log("generate_recipes local fallback");
        await generateLocal();
    }
  }
async function generateLocal(){
    const usernames = JSON.parse(localStorage.getItem("Usernames"));
    for(let user of usernames) 
    {
        const RecipesDict = JSON.parse(localStorage.getItem(`recipes_${user}`)) || {}
        for(let key in RecipesDict){
            const result = await makeCard(RecipesDict[key]);
            document.querySelector("div.grid").appendChild(result);
        }
    };
}

function makeCard(Recipe){ //pass in recipe OBJECT
    const RecipeName = Recipe.RecipeName; //add this one
    const RecipeImage = Recipe.RecipeImage;
    const UserName = Recipe.UserName;
    const ingredients = Recipe.RecipeIngredients;
    const RecipeInstructions = Recipe.RecipeInstructions;
    const RecipeMakes = Recipe.RecipeMakes;
    const RecipeID = Recipe.RecipeID;

    // Create the main container div
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.style.width = "18rem";
    cardDiv.id = Recipe.RecipeID;

    // Create the flip-card container
    const flipCardDiv = document.createElement("div");
    flipCardDiv.className = "flip-card";

    // Create the flip-card-inner container
    const flipCardInnerDiv = document.createElement("div");
    flipCardInnerDiv.className = "flip-card-inner";

    // Create the flip-card-front container
    const flipCardFrontDiv = document.createElement("div");
    flipCardFrontDiv.className = "flip-card-front";

    // Create the image element
    const imgElement = document.createElement("img");
    imgElement.className = "card-img-top";
    imgElement.src = RecipeImage;
    imgElement.alt = "Recipe Image";

    // Create the card-body container for front
    const cardBodyFrontDiv = document.createElement("div");
    cardBodyFrontDiv.className = "card-body";

    // Add content to the front of the card
    const titleFront = document.createElement("h5");
    titleFront.className = "card-title";
    titleFront.textContent = RecipeName;

    const subtitleFront = document.createElement("h6");
    subtitleFront.className = "card-subtitle mb-2 text-muted";
    subtitleFront.Personid = UserName; //id is their username
    subtitleFront.textContent = UserName;

    // Append elements to the front of the card
    cardBodyFrontDiv.appendChild(titleFront);
    cardBodyFrontDiv.appendChild(subtitleFront);

    flipCardFrontDiv.appendChild(imgElement);
    flipCardFrontDiv.appendChild(cardBodyFrontDiv);

    // Create the flip-card-back container
    const flipCardBackDiv = document.createElement("div");
    flipCardBackDiv.className = "flip-card-back";

    // Create the card-body container for back
    const cardBodyBackDiv = document.createElement("div");
    cardBodyBackDiv.className = "card-body";

    // Add content to the back of the card
    const titleBack = document.createElement("h5");
    titleBack.className = "card-title";
    titleBack.textContent = RecipeName;

    // Create the list group for ingredients
    const listGroup = document.createElement("ul");
    listGroup.className = "list-group list-group-flush";

    // Add ingredients to the list group
    ingredients.forEach((ingredient) => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item";
        listItem.textContent = `${ingredient.Amount} ${ingredient.Name}`;
        listGroup.appendChild(listItem);
    });

    // Create the hr element
    const hrElement = document.createElement("hr");

    // Create the directions section
    const directions = document.createElement("h6");
    directions.textContent = "Directions:";

    const instruct= document.createElement("p");
    instruct.textContent = RecipeInstructions;

    // Append elements to the back of the card
    cardBodyBackDiv.appendChild(titleBack);
    cardBodyBackDiv.appendChild(listGroup);
    cardBodyBackDiv.appendChild(hrElement);
    cardBodyBackDiv.appendChild(directions);
    cardBodyBackDiv.appendChild(instruct);
    //cardBodyBackDiv.appendChild(olElement);

    flipCardBackDiv.appendChild(cardBodyBackDiv);

    // Append inner containers to the main container
    flipCardInnerDiv.appendChild(flipCardFrontDiv);
    flipCardInnerDiv.appendChild(flipCardBackDiv);

    flipCardDiv.appendChild(flipCardInnerDiv);

    // Create the button and paragraph elements
    const buttonElement = document.createElement("button");
    buttonElement.className = "btn btn-primary";
    buttonElement.innerHTML = '<i class="fa-solid fa-cookie"></i>';
    buttonElement.addEventListener("click", async () => {
        await press_make(RecipeID, UserName);
    });

    const pElement = document.createElement("p");
    pElement.className = "makes";
    pElement.textContent = RecipeMakes;

    // Append button and paragraph elements to the main container
    cardDiv.appendChild(flipCardDiv);
    cardDiv.appendChild(buttonElement);
    cardDiv.appendChild(pElement);

    // Append the card to grid
    return cardDiv;
}


async function press_make(RecipeID, username){
    //update recipe in the database
    try{
        const makeRequestObject = {"id": RecipeID, "username": username};
        const response = await fetch(`/api/make`, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(makeRequestObject),
        });
        const recipes = await response.json();
        await alter_db(`recipes_${username}`, JSON.stringify(recipes[`recipes_${username}`]));
        const elementToReplace = document.getElementById(RecipeID);
        const makes = elementToReplace.querySelector(".makes");
        makes.textContent = recipes[`recipes_${username}`][RecipeID].RecipeMakes;
    }
    catch{
        const RecipesDict = await fetch_db(`recipes_${username}`); //get the recipes
        console.log("press_make local fallback");
        make_local(RecipesDict, RecipeID, username);
    }
};
async function make_local(RecipesDict, RecipeID, username){
    //recipesDict is for ONE user
    RecipesDict[RecipeID].RecipeMakes += 1;
    await alter_db(`recipes_${username}`, JSON.stringify(RecipesDict));
    const elementToReplace = document.getElementById(RecipeID);
    const makes = elementToReplace.querySelector(".makes");
    makes.textContent = RecipesDict[RecipeID].RecipeMakes;
}

async function fetch_db(name){
    return JSON.parse(localStorage.getItem(name));
}
 
async function alter_db(name, value){
    localStorage.setItem(name, value);
}


function runRandomlyEvery6Seconds() {
    // Function to be called every 6 seconds
    setInterval(alterRandomRecipe, 6000); // 6000 milliseconds = 6 seconds
}

async function alterRandomRecipe(){
    //random username
    const currentUser = localStorage.getItem("UserName");
    const usernames = JSON.parse(localStorage.getItem("Usernames"));
    const randomIndex = Math.floor(Math.random() * usernames.length);
    const randomUsername = usernames[randomIndex];

    //pick a random recipe and press_make on it
    const RecipesDict = JSON.parse(localStorage.getItem(`recipes_${randomUsername}`)) || {};
    if(Object.keys(RecipesDict).length > 0){
        const randomRecipeID = Object.keys(RecipesDict)[Math.floor(Math.random() * Object.keys(RecipesDict).length)];
        await press_make(randomRecipeID, randomUsername);
    }
}
