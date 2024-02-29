
import express from 'express'
//const express = require('express');
const app = express();

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the frontend static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// DeleteRecipes
apiRouter.delete('/recipes', (req, res) => {
  //send the updated recipes
  recipes = deleteRecipe(req.body, recipes); //delete Request object contains id & username
  res.send(recipes);
});

// AddRecipe
apiRouter.post('/recipes', (req, res) => {
  //send the updated recipes
  recipes = addRecipe(req.body);
  res.send(recipes);
});

// GetAllRecipes
apiRouter.get('/recipes', (req, res) => {
  //send the updated recipes
  const usernames = req.query.usernames;
  const recipesList = getAllRecipes(usernames);
  //console.log(`recipes is ${typeof recipes}`); 
  res.send(recipesList);
});

// GetMyRecipes (one user's recipes)
apiRouter.get('/myRecipes', (req, res) => {
  //send the user's recipes
  const username = req.query.username;
  console.log("about to call get my recipes");
  const recipesList = getMyRecipes(username); //body stores the username
  res.send(recipesList);
});

// makeRecipe ('make' the specified recipe, send RECIPE)
apiRouter.post('/make', (req, res) => {
  //send the user's recipes
  //const recipeToMake = req.query.recipe;
  console.log("about to call updatemake");
  recipes = updateMake(req.body); //body stores the username
  res.send(recipes);
});


// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

 app.listen(port, () => {
   console.log(`Listening on port ${port}`);
 });


 let recipes = {}; //recipes_username: {id:recipe, id:recipe}
 //p
 function deleteRecipe(deleteObject){ //find the person, find the recipe delete from dictionary
  const RecipeID = deleteObject.id
  const username = deleteObject.username

  if (recipes.hasOwnProperty(`recipes_${username}`) && recipes[`recipes_${username}`].hasOwnProperty(RecipeID)) {
    delete recipes[`recipes_${username}`][RecipeID];
    console.log(`Recipe deleted successfully.`);
  } else {
      console.log(`Recipe not found in the array.`);
  }
  return recipes
 }

 function addRecipe(recipe){
  if(typeof recipes === 'undefined'){
    recipes = {};
  }
  const a = recipe;
  const b = recipes;
  //mainDict.nestedDict.key1 = 'new value';
  console.log(`recipe passed in ${recipe}`)
  console.log('here are the keys')
  const keys = Object.keys(recipes);
  keys.forEach(key => {
      console.log(key);
  });
  if(!recipes.hasOwnProperty(`recipes_${recipe.UserName}`)){
    console.log(`${recipe.UserName} has nothing time reset`);
    recipes[`recipes_${recipe.UserName}`] = {}; 
  }
  recipes[`recipes_${recipe.UserName}`][recipe.RecipeID] = recipe;
  
  console.log("addRecipe");
  return recipes;
 }
//recipes_username
 function getAllRecipes(usernames){
  const n = usernames.split(",");
  const recipeList = [];
  //console.log(recipes);
  const recipesExample = recipes;
    for(let user of n){
      const userDict = recipes[`recipes_${user}`]
        for(let key in userDict){
          recipeList.push(userDict[key])
        }
    };
    return recipeList;
    //key: recipes_username, value: another dictionary where key = recipeid, value=recipe
 }

 function getMyRecipes(username){
  console.log("in get my recipes");
  const userRecipes = recipes[`recipes_${username}`] || {};
  const recipeList = [];
  console.log("about");
  for(let key in userRecipes){
    recipeList.push(userRecipes[key])
  }
  return recipeList;
 }

 function updateMake(makeRequestObject){
  const RecipeID = makeRequestObject.id
  const username = makeRequestObject.username

  if(recipes[`recipes_${username}`] && recipes[`recipes_${username}`][RecipeID]){
    recipes[`recipes_${username}`][RecipeID].RecipeMakes += 1
  }
  
  return recipes;
 }