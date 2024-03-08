const express = require('express');
const multer = require('multer');

const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const DB = require('./database.js');

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
    if (await DB.getUser(req.body.username)) {
      res.status(409).send({ msg: 'Existing user' });
    } 
    else {
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
    console.log("error in create user endpoint");
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
apiRouter.delete('/recipes', async (req, res) => {
  //send the updated recipes
  const recipeID = req.body.id;
  await DB.deleteRecipe(recipeID); //RECIPEID
  const recipes = DB.getAllRecipes();
  res.send(recipes);
});

// AddRecipe
apiRouter.post('/recipes', (req, res) => {
  //send the updated recipes
  DB.addRecipe(req.body); //expecting a recipe
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
  res.set("username", username);
  const recipesList = await DB.getRecipes(username);
  // const recipesList = getMyRecipes(username); //body stores the username
  res.send(recipesList);
});

// makeRecipe ('make' the specified recipe, send RECIPE)
apiRouter.post('/make', async (req, res) => {
  const makes = await DB.updateMake(req.body.id);
  console.log(`makes is ${makes}`);
  console.log(typeof makes); // Output: object
  res.status(200);
  res.send({makes: makes});
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