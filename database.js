const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('tastetrove');
const userCollection = db.collection('user'); //user, authToken
const recipeCollection = db.collection('recipe'); //recipe info (it will all be inside a recipe object)

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});

function getUser(username){
  return userCollection.findOne({ username: username });
}


function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function createUser(username, password) {
  // Hash the password before we insert it into the database
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    username: username,
    password: passwordHash,
    token: uuid.v4(),
  };
  await userCollection.insertOne(user);
  return user;
}

function addRecipe(recipe) {
  // Add a recipe to the database
  recipeCollection.insertOne(recipe);
}

function getRecipes(username) { //get the list of recipes for one user
  const query = { Username: username };
  //const options = { sort: { name: 1 } };
  const cursor = recipeCollection.find(query);
  return cursor.toArray();
}

function deleteRecipe(Recipe){
  // Delete a recipe from the database
  recipeCollection.deleteOne(Recipe);
}

function getAllRecipes(){
  const cursor = recipeCollection.find({});
  return cursor.toArray();
}

function updateMake(Recipe){
  //find the recipe, add one to the makes field, update the recipe
  const query = { _id: Recipe._id};
  const recipeToUpdate = recipeCollection.find(query);
  recipeToUpdate.makes += 1;
  recipeCollection.updateOne(query, recipeToUpdate);
}



module.exports = {
  getUser,
  getUserByToken,
  createUser,
  addRecipe,
  getRecipes,
  deleteRecipe,
  getAllRecipes,
  updateMake
};

