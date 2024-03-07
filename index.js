
const express = require('express');
const multer = require('multer');

const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const DB = require('./database.js');
//const DB = require('./database.js');
// Importing specific functions from the database module


const app = express();
const upload = multer({ dest: 'public/uploads/' }); //configure for file uploads
const authCookieName = 'token';
// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the frontend static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);


// Create User: add to database, set the cookie header, send the user id
apiRouter.post('/auth/create', async (req, res) => {
  try{
    
  console.log("in create user");
  if (await DB.getUser(req.body.username)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createUser(req.body.username, req.body.password);

    // Set the cookie
    setAuthCookie(res, user.token);

    res.status(200);
    res.send({
      id: user._id,
    });
  }

}


  catch{
    res.status(409).send({ msg: 'Existing user' });
  }
  
});


//Login existing user
apiRouter.post('/auth/login', async (req, res) => {
  const user = await DB.getUser(req.body.username);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token); //authToken in header
      res.status(200);
      res.send({ id: user._id }); // put user id in the body
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized'});
});


//uploadImages to server
app.post('/upload', upload.single('image'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.send({
    filename: file.filename,
    path: file.path
  });
});

// DeleteRecipes
apiRouter.delete('/recipes', (req, res) => {
  //send the updated recipes
  DB.deleteRecipe(req.body); //expecting a recipe
  const recipes = DB.getAllRecipes();
  res.send(recipes);
  //recipes = deleteRecipe(req.body, recipes); //delete Request object contains id & username
});

// AddRecipe
apiRouter.post('/recipes', (req, res) => {
  //send the updated recipes
  DB.addRecipe(req.body); //expecting a recipe
  //recipes = addRecipe(req.body);
  const recipes = DB.getAllRecipes();
  res.send(recipes);
});

// GetAllRecipes
apiRouter.get('/recipes', async (req, res) => { //no need to send stuff
  //send the updated recipes 
  const recipesList = await DB.getAllRecipes();
  //const recipesList = getAllRecipes(usernames);
  //console.log(`recipes is ${typeof recipes}`); 
  res.status(200);
  res.send(recipesList);
});

// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});


// secureApiRouter verifies credentials for endpoints
var secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  authToken = req.cookies[authCookieName]; //verify that there is a user with the authToken
  const user = await DB.getUserByToken(authToken);
  if (user) {
    req.user = user; //send the user to myRecipes
    next(); //call myRecipes endpoint, etc
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// GetMyRecipes (one user's recipes)
secureApiRouter.get('/myRecipes', async (req, res) => {
  //send the user's recipes
  const username = req.user.username;
  console.log("about to call get my recipes");
  const recipesList = await DB.getRecipes(username);
  // const recipesList = getMyRecipes(username); //body stores the username
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


 // setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

////////////////////////////////////////OLD FUNCTIONS////////////////////////////////////////
let recipes = {}; //recipes_username: {id:recipe, id:recipe}
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

 function getMyRecipes(username){ //instead, fetch from the database
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