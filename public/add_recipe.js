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

//<label for="imageFile">size too big! (Must be under 400 bytes)</label>

function image_warning(){
  if(document.querySelector("#warning")){ //if warning already there
    return;
  }
  //create label to add
  const warningLabel = document.createElement("label");
  warningLabel.setAttribute("for", "imageFile");
  warningLabel.setAttribute("id", "warning");
  warningLabel.textContent = 'size too big! (Must be under 20 megabytes)';

  const div = document.querySelector("#imageDiv");
  const imageFile = document.querySelector("#imageFile"); //insert before this

  div.insertBefore(warningLabel, imageFile);
}

//submit the recipe to the database when they hit submit
async function submit_recipe() {
  if (!filled_form()) { // Do nothing
    console.log("Form not filled so recipe not submitted!");
    window.location.href = "my_recipes.html";
    return;
  }
  
  // Update recipe list for this person
  const username = localStorage.getItem("UserName");

  // Code to unpack the form and turn it into an object
  const recipe_form = document.querySelector("#recipeForm");
  const ingredients = []; // List of objects
  const ingredientRows = Array.from(document.querySelectorAll("#ingredientList .row"));

  // Selects elements with class "row" that are descendants of element with ID "ingredientList"
  ingredientRows.forEach(row => { 
    // Fill ingredients list with objects
    let name = row.querySelector("#ingredientName").value;
    let amount = row.querySelector("#ingredientAmount").value;
    ingredients.push({ Name: name, Amount: amount });
  });

  let RecipeID = await generateUniqueRandomID();

  const formData = new FormData();
  const fileInput = document.getElementById('imageFile').files[0]; // Take first image file
  const fileSizeMB = fileInput.size/ 1048576;
  if(fileSizeMB > 20){ //file
    image_warning();
    return;
  }
  formData.append('image', fileInput);

  // Upload the image to the server
  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    console.log('File uploaded successfully:', data);
    const filename = data.filename;
    const path = data.path;
    let choppedStr = path.replace(/^public\//, '');

    const recipe = {
      RecipeName: document.getElementById('exampleName').value,
      RecipeImage: choppedStr,
      RecipeIngredients: ingredients,
      RecipeInstructions: document.getElementById('formInstructions').value,
      RecipeMakes: 0,
      RecipeID: RecipeID,
      Username: username
    };

    const recipeResponse = await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(recipe),
    });

    const recipeDict = await recipeResponse.json();
    // Process data from second fetch
    localStorage.setItem(`recipes_${username}`, JSON.stringify(recipeDict[`recipes_${username}`]));
    console.log("Recipe submitted!");
    window.location.href = "my_recipes.html";
  } 
  catch (error) {
    console.error('Error:', error.message);
    // Handle errors gracefully, e.g., display an error message to the user
    if (recipe) {
      addRecipeLocal(recipe);
    }
  }
}
 

async function addRecipeLocal(recipe){
  //update recipe list for this person
  const username = localStorage.getItem("UserName");
  console.log("start submit_recipe");
  const RecipesDict = JSON.parse(localStorage.getItem(`recipes_${username}`)) || {}; //fetch one person's recipes
  RecipesDict[recipe.RecipeID] = recipe; //update map
  console.log(recipe);
  localStorage.setItem(`recipes_${username}`, JSON.stringify(RecipesDict));

  console.log("recipe submitted!");
  window.location.href = "my_recipes.html";

}

function filled_form(){
  //confirms that no fields are empty
  
  //Name
  if(document.getElementById('exampleName').value == ""){
    return false;
  }
  //Image
  else if(document.getElementById('imageFile').value == ""){
    return false;
  }
  //Instructions
  else if(document.getElementById('formInstructions').value == ""){
    return false;
  }
  //Ingredients
  Array.from(document.querySelectorAll("#ingredientList .row")).forEach(row => {
    if(row.querySelector("#ingredientName").value == "" || row.querySelector("#ingredientAmount").value == ""){
      return false;
    }
  });

  return true;
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



