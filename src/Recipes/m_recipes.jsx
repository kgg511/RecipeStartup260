import React from 'react';
import {RecipeCard} from './recipeCard';
import './all_recipes.css';
import { useNavigate } from 'react-router-dom';
import { AuthState } from '../login/authState';

export function MyRecipes({changeAuthstate}) {
    const [recipes, setRecipes] = React.useState([]); //array of recipes
    const [username, setUsername] = React.useState("");
    const navigate = useNavigate();

    async function generate_recipes(){
      try{
        const response = await fetch('/api/myRecipes');
        console.log("about to make request generate_recipes");
        const theRecipes = await response.json(); // extracts body

        const recipeComponents = theRecipes.map((recipe, index) => (
            <RecipeCard key={recipe._id} recipe={recipe} deleteButton={true} onDelete={()=>delete_recipe({rID: recipe._id, file: recipe.RecipeImage}, index)}/>
        ));
        setRecipes(recipeComponents);

        const theUsername = response.headers.get('username');
        setUsername(theUsername);    
      }
      catch{
          console.log("Error generating recipes in my_recipes.js");
      }
  }
    React.useEffect(() => {
        console.log('recipes has changed:');
    }, [recipes]); 

    React.useEffect(() => { 
        if(localStorage.getItem("userName") == null){
            changeAuthstate(AuthState.Unauthenticated);
            navigate('/');
        }
        generate_recipes();
    }, []);

    async function delete_recipe(requestObject, index){
            //requestObject holds id & file path
        try{
            setRecipes(prevRecipes => {
                const copiedArray = [...prevRecipes];
                copiedArray.splice(index, 1); // Remove recipe from array
                return copiedArray; // Update state variable
                });
            const response = await fetch('/api/recipes', {
                method: 'DELETE',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(requestObject),
              });
        }
        catch{
            console.log("deleting error");
        }
      }
    return (
        <main>
        <h2 id="title">My Recipes: {username}</h2>
        <div className="grid">
            {recipes.map((recipe) => (
                recipe
            ))}
        </div>
        </main>
    );
}