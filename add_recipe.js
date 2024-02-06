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
    username = localStorage.getItem("userName");
    console.log("start submit_recipe");
    const RecipesDict = JSON.parse(localStorage.getItem(`recipes_${username}`)) || new Map(); //one person's recipes

    const recipe_form = document.querySelector("#recipeForm");
    const ingredients = []; //list of objects
    const ingredientRows = Array.from(document.querySelectorAll("#ingredientList .row"));
    //selects elements with class "row" that are descendants of element with ID "ingredientList

    ingredientRows.forEach(row =>{ //fill ingredients list with objects
        let name = row.querySelector("#ingredientName").value;
        let amount = row.querySelector("#ingredientAmount").value;
        ingredients.push({Name: name, Amount: amount});
    })

    let RecipeID = generateUniqueRandomID();
    const recipe = {
        RecipeName: document.getElementById('#exampleName').value,
        RecipeImage: document.getElementById('#imageFile').value, //hmm its optional
        RecipeIngredients: ingredients,
        RecipeInstructions: document.getElementById('#formInstructions').value,
        RecipesMakes: 0,
        RecipeID: RecipeID,
        UserName: username
    };

    RecipesDict.set(RecipeID, recipe); //update list
    console.log(recipe);
    localStorage.setItem(`recipes_${username}`, JSON.stringify(RecipesDict));
    window.location.href = "my_recipes.html";

    console.log("recipe submitted!");
}

function generateUniqueRandomID() { //database also stores a list of IDs
  const existingIDs = localStorage.getItem("existingIDs"); 
  const max = 1000000;
  const min = 1;
  let newID;
  do {
    newID = Math.random() * (max - min) + min;;
  } while (existingIDs.includes(newID));
  return newID;
}


