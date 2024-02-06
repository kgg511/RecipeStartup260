
//update makes in the database when the userclicks on a make
//update the number of makes displayed

// const recipe = {
//     RecipeName: document.getElementById('#exampleName').value,
//     RecipeImage: document.getElementById('#imageFile').value, //hmm its optional
//     RecipeIngredients: ingredients,
//     RecipeInstructions: document.getElementById('#formInstructions').value,
// };

//find the recipe that they clicked on
function add_make(){
    //update the number of makes displayed
    //figure out which one they clicked on



}

//locate the person's recipes
//
//generate Recipes

function generate_Recipes(){
   //read the recipes from the database
   //build the card
   //when make button is created, add event listener for makes
   //when delete button is created add event listener for delete
   const People = localStorage.getItem("People"); //list of ids

  People.forEach(element => {
    
   });

   const storedRecipes = JSON.parse(localStorage.getItem(`recipes_${personId}`)) || [];
   

}



function generateCard(Recipe){
// const rowElement = document.createElement("div");
   // rowElement.setAttribute("class", "row");
   // colElement1.appendChild(inputElement1);
   //assume Recipe is an object

   //{Name: name, Amount: amount}

    const title = document.createElement("h5");
    title.setAttribute("class", "card-title");
    title.textContent = Recipe.RecipeName;

    const ul = document.createElement("ul");
    ul.setAttribute("class", "list-group list-group-flush");
    Recipe.RecipeIngredients.forEach(ingredient => {
      //create a list item for each ingredient
        const li = document.createElement("li");
        li.setAttribute("class", "list-group-item");
        li.textContent = `${ingredient.Amount} ${ingredient.Name}`;
        ul.appendChild(li);
   });
}


// const recipe = {
//     RecipeName: document.getElementById('#exampleName').value,
//     RecipeImage: document.getElementById('#imageFile').value, //hmm its optional
//     RecipeIngredients: ingredients,
//     RecipeInstructions: document.getElementById('#formInstructions').value,
//     RecipesMakes: 0,
//     RecipeID: RecipeID
// };

function makeCard(Recipe){ //pass in recipe OBJECT
    const RecipeName = Recipe.RecipeName;
    const RecipeImage = Recipe.RecipeImage;
    const userName = Recipe.UserName;
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
    subtitleFront.textContent = userName;

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

    // Create the ol element for directions
    //const olElement = document.createElement("ol");

    // Add directions to the ol element
    // const recipeDirections = ["Cream butter and sugar.", "Sacrifice your firstborn child.", "Put in oven."];
    // recipeDirections.forEach((step) => {
    //     const liElement = document.createElement("li");
    //     liElement.textContent = step;
    //     olElement.appendChild(liElement);
    // });
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

    const pElement = document.createElement("p");
    pElement.className = "makes";
    pElement.textContent = RecipeMakes;

    // Append button and paragraph elements to the main container
    cardDiv.appendChild(flipCardDiv);
    cardDiv.appendChild(buttonElement);
    cardDiv.appendChild(pElement);

    // Append the card to grid
    document.querySelector("div.grid").appendChild(cardDiv);

}