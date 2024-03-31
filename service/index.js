const express = require('express');
const multer = require('multer');

const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const DB = require('./database.js');
const { peerProxy } = require('./peerProxy.js');
const path = require('path');
const fs = require('fs');
const app = express();

// // Define storage settings
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, 'uploads/'));
//   },
//   filename: function (req, file, cb) {
//     const fileExtension = path.extname(file.originalname);
//     cb(null, file.fieldname + fileExtension);
//   }
// });

// const upload = multer({ storage: storage });

const upload = multer({ dest: path.join(__dirname, 'uploads/') });

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
    theName = req.body.username;
    pass = req.body.password;
    if (await DB.getUser(theName)) {
      res.status(409).send({ msg: 'Existing user' });
    }
    else {
      const user = await DB.createUser(theName, pass);
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
apiRouter.post('/upload', upload.single('image'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const uploadedFilePath = file.path; // Get the current path of the uploaded file
  const newFilename = file.filename + ".png"; //new name
  const directoryPath = path.dirname(uploadedFilePath); //directory path of file
  const newFilePath = path.join(directoryPath, newFilename); //define new path

  console.log(`New file path: ${newFilePath}`);

  // Rename the file
  fs.rename(uploadedFilePath, newFilePath, (err) => {
    if (err) {
      console.error('Error renaming file:', err);
      return res.status(500).json({ error: 'Error renaming file' });
    }
    console.log('File renamed successfully');
  });

    res.send({
      filename: newFilename,
      path: newFilePath
    });
});

// DeleteRecipes: receives a recipe id, deletes the recipe, sends nothing
apiRouter.delete('/recipes', async (req, res) => {
  const recipeID = req.body.rID;
  
  const fullPath = path.resolve(__dirname, '..', req.body.file);
  
  await DB.deleteRecipe(recipeID);

  //delete file from the uploads directory
  if(fs.existsSync(fullPath)){console.log("FILE EXISTS");}
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      return;
    }
  });
  console.log(`Deleted file: ${fullPath}`);

  res.status(200);
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
  res.status(200);
  res.send(recipesList);
});

// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

apiRouter.get('/getUsername', async (req, res) => {
  // Retrieve the cookie value
  const authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);
  const username = user.username;
  // Send the username
  res.send({ username });
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
  if(makes == 0){
    res.status(404);
    res.send({makes: 0});
  }
  else{
    console.log(`makes is ${makes}`);
    console.log(typeof makes); // Output: object
    res.status(200);
    res.send({makes: makes});
  }
  
});


// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

const httpService = app.listen(port, () => {
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

peerProxy(httpService);
