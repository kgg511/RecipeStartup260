async function press_make(RecipeID, username){
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

async function delete_recipe(RecipeID){
    //const RecipesDict = await fetch_db(`recipes_${username}`); //get the recipes
    //const recipe = RecipesDict[RecipeID];
    const elementToDelete = document.getElementById(RecipeID);
    elementToDelete.remove();
    const deleteRequestObject = {"id": RecipeID};
    try{
        const response = await fetch('/api/recipes', {
            method: 'DELETE',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(deleteRequestObject),
          });
        const recipes = await response.json(); //returns the dictionary recipes for specific user
        //await alter_db(`recipes_${username}`, JSON.stringify(recipes[`recipes_${username}`]));
    }
    catch{
        //await delete_local(username, RecipeID);
        console.log("deleting error");
    }
    
}
async function delete_local(username, RecipeID){
    const RecipesDict = await fetch_db(`recipes_${username}`);
    delete RecipesDict[RecipeID];
    await alter_db(`recipes_${username}`, JSON.stringify(RecipesDict));
}

async function fetch_db(name){
    return JSON.parse(localStorage.getItem(name));
}
 
async function alter_db(name, value){
    localStorage.setItem(name, value);
}


function makeCard(Recipe){ //pass in recipe OBJECT
    const RecipeName = Recipe.RecipeName; //add this one
    const RecipeImage = Recipe.RecipeImage; //this is path name
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

    //create the delete button
    const deleteDiv = document.createElement("div");
    const a = document.createElement("a");
    a.className = "delete";
    a.addEventListener("click", async () => {
        await delete_recipe(RecipeID);
    });

    const i = document.createElement("i");
    i.className = "fa-solid fa-x";

    a.appendChild(i);
    deleteDiv.appendChild(a);
    flipCardDiv.appendChild(deleteDiv);

    // Create the flip-card-inner container
    const flipCardInnerDiv = document.createElement("div");
    flipCardInnerDiv.className = "flip-card-inner";

    // Create the flip-card-front container
    const flipCardFrontDiv = document.createElement("div");
    flipCardFrontDiv.className = "flip-card-front";

    // Create the image element
    const imgElement = document.createElement("img");
    imgElement.className = "card-img-top";
    //imgElement.src = "media/cookie.png"; //filler
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

    makeDiv = document.createElement("div");
    makeDiv.appendChild(buttonElement);

    makesDiv = document.createElement("div");
    makesDiv.appendChild(pElement);

    // Append button and paragraph elements to the main container
    cardDiv.appendChild(flipCardDiv);
    cardDiv.appendChild(makeDiv);
    cardDiv.appendChild(makesDiv);

    // Append the card to grid
    return cardDiv;

}

async function generate_recipes(){
    //window.location.href = "my_recipes.html";
    let username = "default";
    try{
        const response = await fetch('/api/myRecipes');
        // const response = await fetch(`/api/myRecipes?username=${username}`, {
        //     method: 'GET',
        //     headers: {'content-type': 'application/json'},
        // });
        console.log("about to make request generate_recipes");
        const recipes = await response.json(); // extracts body
        username = response.headers.get('username');
        
        document.querySelector("#title").textContent = `My Recipes: ${username}`; //display username

        console.log("received about to make cards");
        for (const recipe of recipes){
            const result = await makeCard(recipe);
            document.querySelector("div.grid").appendChild(result);
        }        
    }
    catch (e){
        console.error(e);
        username = localStorage.getItem("UserName"); //get this persons recipes
        document.querySelector("#title").textContent = `My Recipes: ${username}`; //display username

        console.log("generate_recipes for my_recipes local fallback");
        await generateMyRecipesLocal(username);
    }
  }
  async function generateMyRecipesLocal(username){
    //fetches it from local storage instead
    const RecipesDict = JSON.parse(localStorage.getItem(`recipes_${username}`)) || {};
    for(let key in RecipesDict){
        const card = await makeCard(RecipesDict[key]);
        document.querySelector("div.grid").appendChild(card);
    } 
  }


  async function update_recipe(RecipeID, username){
    //update recipe in the database
    const recipes = localStorage.getItem(`recipes_${username}`, JSON.stringify(RecipesDict));
    const recipe = recipes[RecipeID];
    recipe.RecipeMakes += 1;
    localStorage.setItem(`recipes_${username}`, JSON.stringify(RecipesDict));

    //remove card from html
    document.querySelector(`#${RecipeID}`).remove();

    //add updated card to html
    document.querySelector("div.grid").appendChild(makeCard(recipe));

  }