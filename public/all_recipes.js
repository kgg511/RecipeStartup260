async function generate_recipes(){
    try{
        const response = await fetch(`/api/recipes`, {
            method: 'GET',
            headers: {'content-type': 'application/json'},
        });
        const recipes = await response.json();
        for (const recipe of recipes){
            const result = makeCard(recipe);
            document.querySelector("div.grid").appendChild(result);
        }        
    }
    catch{
        console.log("Error generating recipes in my_recipes.js");
    }
  }

async function signOut(){
    //make fetch request to the sign out endpoint 
    // if successful, change the page
    const response = await fetch(`/api/auth/logout`, {
        method: 'DELETE',
        headers: {'content-type': 'application/json'},
    });
    response.status === 204 ? window.location.href = "index.html" : console.log("sign out failed");
};


async function press_make(RecipeID){
    //update recipe in the database
    try{
        const makeRequestObject = {"id": RecipeID};
        const response = await fetch(`/api/make`, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(makeRequestObject),
        });
        const result = await response.json();
        const elementToReplace = document.getElementById(RecipeID);
        const makes = elementToReplace.querySelector(".makes");
        makes.textContent = result.makes;
    }
    catch{
        console.log("press_make error");
    }
};

async function update_makes(RecipeID, makes){
    //updates the UI when receive weboscket message
    const recipeCard = document.getElementById(RecipeID);
    const makesElement = recipeCard.querySelector('.makes');
    makesElement.textContent = makes;
}

function runRandomlyEvery6Seconds() {
    // Function to be called every 6 seconds
    setInterval(alterRandomRecipe, 6000); // 6000 milliseconds = 6 seconds
}

async function alterRandomRecipe(){
    //possibly later on add the stand in websocket code using mongodb if necessary
    //random username
    const currentUser = localStorage.getItem("UserName");
    const usernames = JSON.parse(localStorage.getItem("Usernames"));
    const randomIndex = Math.floor(Math.random() * usernames.length);
    const randomUsername = usernames[randomIndex];

    //pick a random recipe and press_make on it
    const RecipesDict = JSON.parse(localStorage.getItem(`recipes_${randomUsername}`)) || {};
    if(Object.keys(RecipesDict).length > 0){
        const randomRecipeID = Object.keys(RecipesDict)[Math.floor(Math.random() * Object.keys(RecipesDict).length)];
        await press_make(randomRecipeID);
    }
}


function makeCard(Recipe){ //pass in recipe OBJECT
    const RecipeName = Recipe.RecipeName; //add this one
    const RecipeImage = Recipe.RecipeImage;
    const UserName = Recipe.Username;
    const ingredients = Recipe.RecipeIngredients;
    const RecipeInstructions = Recipe.RecipeInstructions;
    const RecipeMakes = Recipe.RecipeMakes;
    const RecipeID = Recipe._id;

    // Create the main container div
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.style.width = "18rem";
    cardDiv.id = RecipeID;

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
        await press_make(RecipeID);
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
