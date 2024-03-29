import React from 'react';

export function RecipeCard({recipe}) {

  console.log("made:", recipe.RecipeMakes)
  const [makes, setMakes] = React.useState(recipe.RecipeMakes);
  const [deleted, setDeleted] = React.useState(false);

  function createItem(ingredient){
      return (
        <li className="list-group-item">
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
         
    }
    catch{
        console.log("press_make error");
    }
};

    return (
        <div className="card" id = {recipe._id} style={{ width: "18rem" }}>
          <div style={{ alignItems: "flex-start" }}><a href="#" className="delete"><i className="fa-solid fa-x"></i></a></div>
          <div className="flip-card">
            <div><a href="#" className="delete"><i className="fa-solid fa-x"></i></a></div>
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
                        {recipe.RecipeIngredients.map((ingredient) => (createItem(ingredient))
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

          <div><button className="btn btn-primary" onClick={() => press_make(recipe._id)} ><i className="fa-solid fa-cookie"></i></button></div>
          <div><p>{makes}</p></div>
          {{deleted} && (<div><p>Recipe Deleted. Refresh page.</p></div>)}
        </div>
    );
}

//{authState === AuthState.Unauthenticated && (<ul><h1>TasteTrove <i className="fa-solid fa-utensils"></i></h1> </ul>)}