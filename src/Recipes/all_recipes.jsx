

import React from 'react';
import {RecipeCard} from './recipeCard';
import './all_recipes.css';

//let socket;
export function AllRecipes() {

    const [recipes, setRecipes] = React.useState([]); //array of recipes

    async function generate_recipes(){
    //     document.addEventListener("DOMContentLoaded", (event) => {
    //       console.log("DOM fully loaded and parsed");
    //       document.getElementById("SignOut").addEventListener("click", function(event) {
    //         // Prevent the default behavior of the anchor tag
    //         event.preventDefault();
    //         signOut();
    //       });
    //   });
      try{
          const response = await fetch(`/api/recipes`, {
              method: 'GET',
              headers: {'content-type': 'application/json'},
          });
          const theRecipes = await response.json();
          setRecipes(theRecipes);
          //await configureWebSocket(); //create websocket whenever page is loaded     
      }
      catch{
          console.log("Error generating recipes in my_recipes.js");
      }
  }

  

      //let data = <p>hi</p>;

    //   React.useEffect(() => {
    //     const fetchData = async () => {
    //         data = await generate_recipes();
    //         // Do something with the data if needed
    //     };
    
    //     fetchData(); // Call the async function inside useEffect
    // }, []);


    React.useEffect(() => { //called when recipes state v changes
        console.log('recipes has changed:');
    }, [recipes]); 

    React.useEffect(() => { 
        generate_recipes(); //called when page refreshes??
    }, []);

    
    return (
        <div className="grid">
            {recipes.map((recipe) => (
                <RecipeCard recipe={recipe} />
            ))}
        </div>
    );



}