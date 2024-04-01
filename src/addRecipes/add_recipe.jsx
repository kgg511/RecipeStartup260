import React from 'react';
import { useState } from 'react';
import { RecipeRow } from './recipe_row';
import { MessageDialog } from '../messageDialogue';
import { useNavigate } from 'react-router-dom';
import './add_recipe.css';
import { AuthState } from '../login/authState';

export function AddRecipe({changeAuthstate}) {
  const [recipeName, setRecipeName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [ingredients, setIngredients] = useState([{name: '', amount: '' }, {name: '', amount: '' }]);
  const [instructions, setInstructions] = useState('');
  const [displayError, setDisplayError] = React.useState(null); 
  const navigate = useNavigate();

  React.useEffect(() => {
    if(localStorage.getItem("userName") == null){
      changeAuthstate(AuthState.Unauthenticated);
      navigate('/');}
  }, []);

  function onUpdate(event) { 
    if (event.target.id === 'exampleName') { //recipe name
      setRecipeName(event.target.value);
    } else if (event.target.id === 'imageFile') {
      setImageFile(event.target.files[0]);
    }
    else if (event.target.id === 'formInstructions') {
      setInstructions(event.target.value);
    }
  }

  function handleRowEdit(rowIndex, columnName, newValue){
    const newData = [...ingredients]; // copy ingredient list
    newData[rowIndex] = {
        ...newData[rowIndex], // Copy the existing row object
        [columnName]: newValue // Update the specific column value
      };
    setIngredients(newData); // update state variable
  };

  const addRow = () => {
    setIngredients([...ingredients, { name: '', amount: '' }]);
  };


//submit the recipe to the database when they hit submit
async function submit_recipe() {
  if (!filled_form()) { // Do nothing
    console.log("Form not filled so recipe not submitted!");
    setDisplayError('Must fill out all fields!');
    return;
  }

  const data = await fetch("/api/getUsername",{
    method: 'GET',
    headers: {'content-type': 'application/json'},
  })
  const userObject = await data.json();
  const username = userObject.username;
  const formData = new FormData();
  const fileSizeMB = imageFile.size/ 1048576;
  if(fileSizeMB > 20){ //file
    setDisplayError('File size too big! (Must be under 20 megabytes)');
    return;
  }
  formData.append('image', imageFile);

  // Upload the image to the server
  try {
    const response = await fetch('/api/upload', {
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

    const recipe = {
      RecipeName: recipeName,
      RecipeImage: path,
      RecipeIngredients: ingredients,
      RecipeInstructions: instructions,
      RecipeMakes: 0,
      Username: username
    };
    // Send to add recipe endpoint
    const recipeResponse = await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(recipe),
    });

    navigate('/MyRecipes');
  } 
  catch (error) {
    console.error('Error:', error.message);
    console.log("Error submitting recipe");
  }
}



function filled_form(){//confirms that no fields are empty
  //Name, image, instructions
  if(recipeName == "" || imageFile == null || instructions == ""){
    return false;
  }
  ingredients.forEach(ingredient => {
    if(ingredient.name == "" || ingredient.amount == ""){
      return false;
    }
  });
  return true;
}
////htmlFor="imageFile"
  return (
    <main>
    <h2>Add Recipe</h2>

    <div id="recipeForm">


      <div className="form-group">
        <label htmlFor="nameLabel">Recipe Name</label>
        <input type="text" className="form-control" id="exampleName" onChange={(e) => onUpdate(e)} aria-describedby="nameHelp" placeholder="name" required/>
      </div>

      <div className="form-group" id = "imageDiv">
        <label>Image</label>
        <input type="file" name="image" className="form-control-file" id="imageFile" onChange={(e) => onUpdate(e)} required/>
      </div>

      <div className = "ingredients">
        <div id = "ingredientList"> Ingredients
          {ingredients.map((ingredient, index) => (
                  <RecipeRow onChange={(columnName, newValue) => handleRowEdit(index, columnName, newValue)}/>
              ))}
        </div>
        <button className="btn btn-primary" id="addIngredient" onClick={() => addRow()}>Add More Ingredients</button>
      </div>
      

      <div className="form-group">
        <label htmlFor="instructions">Instructions (Please number)</label>
        <textarea className="form-control" id="formInstructions" onChange={(e) => onUpdate(e)} rows="3" required></textarea>
      </div>

      <button className="btn btn-primary" onClick={() => submit_recipe()} type="submit">Add Recipe</button>
    </div>
    <MessageDialog message={displayError} onHide={() => setDisplayError(null)} />
    
  </main>
  );
}