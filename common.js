//will contain the functions for lodaing pages because we want to use the same functions in all pages



async function generate_recipes(){
    const username = localStorage.getItem("UserName"); //get this persons recipes
    const RecipesDict = JSON.parse(localStorage.getItem(`recipes_${username}`)) || {};
   //read the recipes from the database
   //build the card
   //when make button is created, add event listener for makes
   //when delete button is created add event listener for delete
   
    //for each person get their recipes and call makeCard on all of them
  RecipesDict.forEach(element => {
    makeCard(element);
   });
   
}