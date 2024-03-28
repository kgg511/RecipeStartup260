import React from 'react';

export function RecipeCard({recipe}) {
  console.log("THe recipe is: ", recipe)

  // const RecipeName = Recipe.RecipeName; //add this one

  //   const UserName = Recipe.Username;
  //   const ingredients = Recipe.RecipeIngredients;
  //   const RecipeInstructions = Recipe.RecipeInstructions;
  //   const RecipeMakes = Recipe.RecipeMakes;
  //   const RecipeID = Recipe._id;
  function createItem(ingredient){
      return (
        <li className="list-group-item">
        {ingredient.Amount} {ingredient.Name}
      </li>
      )
  }

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

          <div><button className="btn btn-primary"><i className="fa-solid fa-cookie"></i></button></div>
          <div><p>{recipe.RecipeMakes}</p></div>
        </div>
    );
}



{/* <li className="list-group-item">6 cups flour</li>
                      <li className="list-group-item">2 cups sugar</li>
                      <li className="list-group-item">1 tsp salt</li> */}