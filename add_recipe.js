//add more ingredient lines when they push the button add_ingredient
function add_ingredient_line(){
    //create a new input element
    const rowElement = document.createElement("div");
    rowElement.setAttribute("class", "row");

    const colElement1 = document.createElement("div");
    colElement1.setAttribute("class", "col");
    const inputElement1 = document.createElement("input");
    inputElement1.setAttribute("type", "text");
    inputElement1.setAttribute("class", "form-control");
    inputElement1.setAttribute("placeholder", "ingredient (flour)");
    inputElement1.setAttribute("id", "ingredientName");
    colElement1.appendChild(inputElement1);

    const colElement2 = document.createElement("div");
    colElement2.setAttribute("class", "col");
    const inputElement2 = document.createElement("input");
    inputElement2.setAttribute("type", "text");
    inputElement2.setAttribute("class", "form-control");
    inputElement2.setAttribute("placeholder", "amount (1/2 cups)");
    inputElement2.setAttribute("id", "ingredientAmount");
    colElement2.appendChild(inputElement2);

    rowElement.appendChild(colElement1);
    rowElement.appendChild(colElement2);

    const ingredientList = document.querySelector("#ingredientList");
    ingredientList.appendChild(rowElement);
//<Section class = "ingredients">
}
/* <div class="row">
            <div class="col">
              <input type="text" class="form-control" placeholder="ingredient (flour)">
            </div>
            <div class="col">
              <input type="text" class="form-control" placeholder="amount (1/2 cups)">
            </div>
          </div> */


//submit the recipe to the database when they hit submit
//where does await go
async function submit_recipe(){
    //update recipe list for this person
    const username = localStorage.getItem("UserName");
    console.log("start submit_recipe");
    const RecipesDict = JSON.parse(localStorage.getItem(`recipes_${username}`)) || {}; //one person's recipes

    const recipe_form = document.querySelector("#recipeForm");
    const ingredients = []; //list of objects
    const ingredientRows = Array.from(document.querySelectorAll("#ingredientList .row"));
    //selects elements with class "row" that are descendants of element with ID "ingredientList

    ingredientRows.forEach(row =>{ //fill ingredients list with objects
        let name = row.querySelector("#ingredientName").value;
        let amount = row.querySelector("#ingredientAmount").value;
        ingredients.push({Name: name, Amount: amount});
    })

    let RecipeID = await generateUniqueRandomID();
    const recipe = {
        RecipeName: document.getElementById('exampleName').value,
        RecipeImage: document.getElementById('imageFile').value, //hmm its optional
        RecipeIngredients: ingredients,
        RecipeInstructions: document.getElementById('formInstructions').value,
        RecipesMakes: 0,
        RecipeID: RecipeID,
        UserName: username
    };

    RecipesDict[RecipeID] = recipe; //update map
    console.log(recipe);
    localStorage.setItem(`recipes_${username}`, JSON.stringify(RecipesDict));

    
    console.log("recipe submitted!");
    //await generate_recipes();
    window.location.href = "my_recipes.html";

}

async function generateUniqueRandomID() { //database also stores a list of IDs
  const existingIDs = JSON.parse(localStorage.getItem("existingRecipeIDs")) || []; 
  //woops gotta turn it in 
  const max = 1000000;
  const min = 1;
  let newID;
  do {
    newID = parseInt(Math.random() * (max - min) + min);
  } while (existingIDs.includes(newID));
  existingIDs.push(newID)
  localStorage.setItem("existingRecipeIDs", JSON.stringify(existingIDs)); //add new id
  return newID;
}



async function generate_recipes(){

  const username = localStorage.getItem("UserName"); //get this persons recipes
  const RecipesDict = JSON.parse(localStorage.getItem(`recipes_${username}`)) || {};
 //read the recipes from the database
 //build the card
 //when make button is created, add event listener for makes
 //when delete button is created add event listener for delete
 
  //for each person get their recipes and call makeCard on all of them
  for(let key in RecipesDict){
    await makeCard(RecipesDict[key]);

  }
  
  
 
}

async function makeCard(Recipe){ //pass in recipe OBJECT
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
  document.querySelector("div.grid").appendChild(cardDiv);

}