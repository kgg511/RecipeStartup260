import React from 'react';

export function AddRecipe() {
  return (
    <main>
    <h2>Add Recipe</h2>

    <div id="recipeForm">
      <div className="form-group">
        <label for="nameLabel">Recipe Name</label>
        <input type="text" className="form-control" id="exampleName" aria-describedby="nameHelp" placeholder="name" required/>
      </div>

      <div className="form-group" id = "imageDiv">
        <label for="imageFile">Image</label>
        <input type="file" className="form-control-file" id="imageFile" required/>
      </div>

      <div className = "ingredients">
        <div id = "ingredientList"> Ingredients
          <div className="row">
            <div className="col">
              <input type="text" id = "ingredientName" className="form-control" placeholder="ingredient (flour)" required/>
            </div>
            <div className="col">
              <input type="text" id = "ingredientAmount" className="form-control" placeholder="amount (1/2 cups)" required/>
            </div>
          </div>
        </div>
        <button className="btn btn-primary" id="addIngredient" onclick = "add_ingredient_line()">Add More Ingredients</button>
      </div>
      

      <div className="form-group">
        <label for="instructions">Instructions (Please number)</label>
        <textarea className="form-control" id="formInstructions" rows="3" required></textarea>
      </div>

      <button className="btn btn-primary" onclick = "submit_recipe()" type="submit">Add Recipe</button>
      
    </div>
    
  </main>
  );
}