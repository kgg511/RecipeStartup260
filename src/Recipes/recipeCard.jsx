import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCookie } from '@fortawesome/free-solid-svg-icons';
import './all_recipes.css';
import { ws } from './notifier';

export function RecipeCard({recipe, deleteButton, onDelete}) {
  const [makes, setMakes] = React.useState(recipe.RecipeMakes);
  const [hasDelete, setHasDelete] = React.useState(deleteButton);
  const [deleted, setDeleted] = React.useState(false);

  const [recipeImage, setRecipeImage] = React.useState(null);

  React.useEffect(() => {
    ws.addHandler(update_makes);
    return () => {
      ws.removeHandler(update_makes);
    };
  });

  React.useEffect(() => {
    // Fetch the image from the backend
    fetch("/api/image", {
      method: 'GET',
      headers: { 'Accept': 'image/png', 'X-FilePath': recipe.RecipeImage},

    })
    .then(response => {
      if (response.ok) {
        return response.arrayBuffer();
      }
      throw new Error('Network response was not ok.');
    })
    .then(arrayBuffer => {
      // Convert the array buffer to a base64 string
      const base64String = btoa(
        new Uint8Array(arrayBuffer)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      setRecipeImage(base64String);
    })
    .catch(error => console.error('Error fetching image:', error));
}, []);
  function createItem(ingredient, index){
      return (
        <li key ={index} className="list-group-item">
          {`${ingredient.amount} ${ingredient.name}`}
      </li>
      )
  }
  function update_makes(RecipeID){
    console.log(RecipeID, recipe._id.toString());
    if(RecipeID == recipe._id.toString()){
      setMakes(makes + 1);
    }
  }

  async function press_make(RecipeID){
    //update recipe in the database
    try{
        const makeRequestObject = {"id": RecipeID};
        const response = await fetch(`/api/make`, { //update in database
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(makeRequestObject),
        });
        const result = await response.json();
        
        if(result.makes == 0){
          setDeleted(true);
        }
        else{
          setMakes(result.makes);
          ws.broadcast_makes(RecipeID, result.makes);
        }  
    }
    catch (error){
        console.log("press_make error", error);
        console.error("An error occurred:", error);
    }
};
    return (
        <div className="card" id = {recipe._id} style={{ width: "18rem" }}>
          {hasDelete == true && (<div style={{ alignItems: "flex-start" }}><a id="deleteIcon" href="#" className="delete" onClick={() => {onDelete()}} ><FontAwesomeIcon icon={faTimes} /></a></div>)}
          <div className="flip-card">
            <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img className="card-img-top" src={`data:image/png;base64,${recipeImage}`} alt="Recipe Image" />
                  <div className="card-body">
                    <h5 className="card-title">{recipe.RecipeName}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{recipe.Username}</h6>
                  </div>
                </div>
  
                <div className="flip-card-back">
                  <div className="card-body">
                    <h5 className="card-title">{recipe.RecipeName}</h5>
                    <ul className="list-group list-group-flush">
                        {recipe.RecipeIngredients.map((ingredient, index) => (createItem(ingredient, index))
                      )}

                    </ul>
                    <hr />
                    <h6>Directions:</h6>
                    <div className="instructions">
                      <p>{recipe.RecipeInstructions}</p>
                    </div>
                  </div>
                </div>
            </div>
          </div>

          <div><button className="btn btn-primary" onClick={() => press_make(recipe._id)} ><FontAwesomeIcon icon={faCookie} /></button></div>
          <div><p>{makes}</p></div>
          {{deleted} == true && (<div><p>Recipe Deleted. Refresh page.</p></div>)}
        </div>
    );
}