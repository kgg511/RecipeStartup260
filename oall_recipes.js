let socket;
async function generate_recipes(){
      document.addEventListener("DOMContentLoaded", (event) => {
        console.log("DOM fully loaded and parsed");
        document.getElementById("SignOut").addEventListener("click", function(event) {
          // Prevent the default behavior of the anchor tag
          event.preventDefault();
          signOut();
        });
    });
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
        await configureWebSocket(); //create websocket whenever page is loaded     
    }
    catch{
        console.log("Error generating recipes in all_recipes.js");
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

        if(result.makes != 0){ //0 is error case (deleted recipe)
            const elementToReplace = document.getElementById(RecipeID);
            const makes = elementToReplace.querySelector(".makes");
            makes.textContent = result.makes;
            broadcast_makes(RecipeID, result.makes);
        }
        else{
            deleted_message(RecipeID);
        }
        
    }
    catch{
        console.log("press_make error");
    }
};

function deleted_message(RecipeID){
    //delete the recipe from the UI
    const elementToDelete = document.getElementById(RecipeID);
    //check if p was already added
    if (elementToDelete.querySelector("#deletedMessage") === null){
        const p = document.createElement("p");
        p.id = "deletedMessage";
        p.textContent = "Recipe Deleted. Refresh page.";
        elementToDelete.appendChild(p);
    }
    //create p element to tell them it deleted
}

function update_makes(RecipeID, makes){
    //updates the UI when receive weboscket message
    const recipeCard = document.getElementById(RecipeID);
    const makesElement = recipeCard.querySelector('.makes');
    makesElement.textContent = makes;
}

function broadcast_makes(RecipeID, makes){
    message = {
        "RecipeID": RecipeID,
        "makes": makes
    };
    socket.send(JSON.stringify(message));
}

async function configureWebSocket() {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
    socket.onopen = (event) => {
        console.log("connected to websocket");
    };
    socket.onclose = (event) => {
        console.log("disconnected from websocket");
    };
    socket.onmessage = async (event) => {
        //the only message are makes. Take out the RecipeID and makes
        console.log(event);
        const msg = JSON.parse(await event.data.text());
        update_makes(msg.RecipeID, msg.makes);
    };
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

generate_recipes();
