

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
        setRecipes(theRecipes);
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

    async function delete_recipe(RecipeID){
        if(hasDelete == false){return;}
        const deleteRequestObject = {"id": RecipeID};
        try{
            const response = await fetch('/api/recipes', {
                method: 'DELETE',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(deleteRequestObject),
              });
              setRecipes(recipes.filter(recipe => recipe._id !== RecipeID)); //remove recipe from state variable
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
                <RecipeCard key={recipe._id} recipe={recipe} deleteButton={true} onDelete={()=>delete_recipe(recipe._id)}/>
            ))}
        </div>
        </>
    );



}