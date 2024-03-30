import React from 'react';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCookie } from '@fortawesome/free-solid-svg-icons';
{/* <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
<link href="https://getbootstrap.com/docs/5.1/assets/css/docs.css" rel="stylesheet">

<script src="https://kit.fontawesome.com/6dcbbbd878.js" crossorigin="anonymous"></script> */}


export function RecipeCard({recipe, deleteButton}) {
  console.log("made:", recipe.RecipeMakes)
  const [makes, setMakes] = React.useState(recipe.RecipeMakes);
  const [hasDelete, setHasDelete] = React.useState(deleteButton); //true for myRecipes, false for allRecipes
  const [deleted, setDeleted] = React.useState(false);

  function createItem(ingredient, index){
      return (
        <li key ={index} className="list-group-item">
        {ingredient.amount} {ingredient.ingredient}
      </li>
      )
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
        }
        setMakes(result.makes);
         
    }
    catch{
        console.log("press_make error");
    }
};


    return (
        <div className="card" id = {recipe._id} style={{ width: "18rem" }}>
          
          <div className="flip-card">

          {hasDelete == true && (<div style={{ alignItems: "flex-start" }}><a href="#" className="delete"><FontAwesomeIcon icon={faTimes} /></a></div>)}
            <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img className="card-img-top" src={recipe.RecipeImage} alt="Recipe Image" />
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

//{authState === AuthState.Unauthenticated && (<ul><h1>TasteTrove <i className="fa-solid fa-utensils"></i></h1> </ul>)}