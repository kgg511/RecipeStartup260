const { ObjectId, MongoClient } = require('mongodb');
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

async function deleteRecipe(recipeID){
  const result = await recipeCollection.deleteOne({"_id": new ObjectId(recipeID)});
}

async function getAllRecipes(){
  const cursor = recipeCollection.find({});
  const recipes = await cursor.toArray();
  return recipes;
}

async function updateMake(recipeId){
  //find the recipe, add one to the makes field, update the recipe
  const query = {"_id": new ObjectId(recipeId)};
  const documents = await recipeCollection.find(query).toArray();
  if (documents.length == 0) {
    return 0;
  }

  const updateOperation = { $inc: { RecipeMakes: 1 } };
  await recipeCollection.updateOne(query, updateOperation);

  const cursor = recipeCollection.find(query);
  const updatedRecipe = await cursor.next();
  //return the number of makes
  return updatedRecipe.RecipeMakes;
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

