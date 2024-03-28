

import React from 'react';
import {RecipeCard} from './recipeCard';

export function myRecipes() {

    async function generate_recipes(){
        // document.addEventListener("DOMContentLoaded", (event) => {
        //     console.log("DOM fully loaded and parsed");
        //     document.getElementById("SignOut").addEventListener("click", function(event) {
        //       // Prevent the default behavior of the anchor tag
        //       event.preventDefault();
        //       signOut();
        //     });
        // });
    
        let username = "default";
        try{
            const response = await fetch('/api/myRecipes');
            console.log("about to make request generate_recipes");
            const recipes = await response.json(); // extracts body
            username = response.headers.get('username');
            document.querySelector("#title").textContent = `My Recipes: ${username}`; //display username
            console.log("received about to make cards");

            grid = document.createAttribute("div.grid");
            for (const recipe of recipes){
                grid.appendChild(card(recipe));
            }
            await configureWebSocket(); //create websocket whenever page is loaded
            return grid;         
        }
        catch (e){
            console.error(e);
            console.log("Error generating recipes in my_recipes.js");
        }
      }

      function card(Recipe){
        return (<RecipeCard/>);
      }

      let data = 0;

      React.useEffect(() => {
        const fetchData = async () => {
            data = await generate_recipes();
            // Do something with the data if needed
        };
    
        fetchData(); // Call the async function inside useEffect
    }, []);
    

    return (
        <>
        
        {data};
        </>
    );



}