import React from 'react';
import { useState } from 'react';
import { RecipeRow } from './recipe_row';

export function AddRecipe() {

  const [recipeName, setRecipeName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [ingredients, setIngredients] = useState([{ name: '', amount: '' }, { name: '', amount: '' }]);
  const [instructions, setInstructions] = useState('');

  function onChange(event) { 
    if (event.target.id === 'exampleName') { //recipe name
      setRecipeName(event.target.value);
      console.log(`recipe name changed ${recipeName}`);
    } else if (event.target.id === 'imageFile') {
      setImageFile(event.target.value);
      console.log(`your password has been changed to ${imageFile}`);
    }
    else if (event.target.id === 'formInstructions') {
      setInstructions(event.target.value);
      console.log(`instructions: ${instructions}`);
    }
  }

  const addRow = () => {
    setIngredients([...ingredients, { name: '', amount: '' }]);
  };


      // else if (event.target.id === 'ingredientName') {
    //   setIngredients(event.target.value);
    //   console.log(`your password has been changed to ${ingredients}`);
    // }
    // else if (event.target.id === 'ingredientAmount') {
    //   setIngredients(event.target.value);
    //   console.log(`your password has been changed to ${ingredients}`);
    // }

  //id="addIngredient"



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

    return rowElement;

    //const ingredientList = document.querySelector("#ingredientList");
    //ingredientList.appendChild(rowElement);
  }

  //<MessageDialog message={displayError} onHide={() => setDisplayError(null)} />

function image_warning(){
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

const data = await fetch("/api/getUsername",{
  method: 'GET',
  headers: {'content-type': 'application/json'},
})
const userObject = await data.json();
const username = userObject.username;

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
    Username: username
  };
   // Send to add recipe endpoint
  const recipeResponse = await fetch('/api/recipes', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(recipe),
  });


  // Process data from second fetch
  console.log("Recipe submitted!");
  window.location.href = "my_recipes.html";
} 
catch (error) {
  console.error('Error:', error.message);
  console.log("Error submitting recipe");
}
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

  return (
    <main>
    <h2>Add Recipe</h2>

    <div id="recipeForm">
      <div className="form-group">
        <label for="nameLabel">Recipe Name</label>
        <input type="text" className="form-control" id="exampleName" onChange={(e) => onChange(e)} aria-describedby="nameHelp" placeholder="name" required/>
      </div>

      <div className="form-group" id = "imageDiv">
        <label for="imageFile">Image</label>
        <input type="file" className="form-control-file" id="imageFile" onChange={(e) => onChange(e)} required/>
      </div>

      <div className = "ingredients">
        <div id = "ingredientList"> Ingredients
          {ingredients.map((ingredient) => (
                  <RecipeRow onChange={(newValue) => handleRowChange(index, newValue)}/>
              ))}
        </div>
        <button className="btn btn-primary" id="addIngredient" onClick={() => addRow()}>Add More Ingredients</button>
      </div>
      

      <div className="form-group">
        <label for="instructions">Instructions (Please number)</label>
        <textarea className="form-control" id="formInstructions" onChange={(e) => onChange(e)} rows="3" required></textarea>
      </div>

      <button className="btn btn-primary" onClick={() => submit_recipe()} type="submit">Add Recipe</button>
      
    </div>
    
  </main>
  );
}