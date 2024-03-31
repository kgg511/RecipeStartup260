

import React from 'react';
import {RecipeCard} from './recipeCard';
import './all_recipes.css';
import { useNavigate } from 'react-router-dom';

//let socket;
export function AllRecipes() {

    const [recipes, setRecipes] = React.useState([]); //array of recipes
    const navigate = useNavigate();
    async function generate_recipes(){
      try{
          const response = await fetch(`/api/recipes`, {
              method: 'GET',
              headers: {'content-type': 'application/json'},
          });
          const theRecipes = await response.json();
          const recipeComponents = theRecipes.map((recipe, index) => (
            <RecipeCard key={recipe._id} recipe={recipe} deleteButton={false} onDelete={()=>(console.log(""))}/>
        ));
        setRecipes(recipeComponents);  
      }
      catch{
          console.log("Error generating recipes in my_recipes.js");
      }
  }


    React.useEffect(() => { //called when recipes state v changes
        console.log('recipes has changed:');
    }, [recipes]); 

    React.useEffect(() => { 
        navigate('/AllRecipes');
        generate_recipes(); //called when page refreshes??
    }, []);



    return (
        <main>
        <h2 id="title">All Recipes</h2>
            <div className="grid">
                {recipes.map((recipe) => (
                    recipe
                ))}
            </div>
        </main>
    );



}