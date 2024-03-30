

import React from 'react';
import {RecipeCard} from './recipeCard';
import './all_recipes.css';

//let socket;
export function MyRecipes() {

    const [recipes, setRecipes] = React.useState([]); //array of recipes
    const [username, setUsername] = React.useState("default"); //username for display

    async function generate_recipes(){
      try{
        const response = await fetch('/api/myRecipes');
        console.log("about to make request generate_recipes");
        const theRecipes = await response.json(); // extracts body

        const recipeComponents = theRecipes.map((recipe, index) => (
            <RecipeCard key={recipe._id} recipe={recipe} deleteButton={true} onDelete={()=>delete_recipe(recipe._id, index)}/>
        ));
        setRecipes(recipeComponents);

        const theUsername = response.headers.get('username');
        setUsername(theUsername);    
      }
      catch{
          console.log("Error generating recipes in my_recipes.js");
      }
  }


    React.useEffect(() => { //called when recipes state v changes
        console.log('recipes has changed:');
    }, [recipes]); 

    React.useEffect(() => { 
        generate_recipes(); //called when page refreshes??
    }, []);

    async function delete_recipe(RecipeID, index){

        setRecipes(prevRecipes => {
            const copiedArray = [...prevRecipes]; // Create a copy of the current state
            copiedArray.splice(index, 1); // Remove recipe from array
            return copiedArray; // Update state variable
        });
        

        try{
            const response = await fetch('/api/recipes', {
                method: 'DELETE',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(deleteRequestObject),
              });
        }
        catch{
            console.log("deleting error");
        }
      }



    return (
        <>
        <h2 id="title">My Recipes: {username}</h2>
        <div className="grid">
            {recipes.map((recipe) => (
                recipe
            ))}
        </div>
        </>
    );



}