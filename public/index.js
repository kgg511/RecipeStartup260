async function login() { //TODO: must have correct username and password
    const nameEl = document.querySelector("#exampleUsername");
    localStorage.setItem("UserName", nameEl.value);

    await update_usernames(nameEl.value);

    console.log(`your username is ${nameEl.value}`);
    window.location.href = "all_recipes.html";
    
  }
//Login: username and password must be in the database
//Register: they can't use a username that is already in use

async function update_usernames(username){
  const usernames = JSON.parse(localStorage.getItem("Usernames")) || [];

  const inUsernames = usernames.some(item => item === username);
  if(!inUsernames){
    usernames.push(username);
    localStorage.setItem("Usernames", JSON.stringify(usernames));
  }
}
//const axios = require('axios');

function displayPhoto(data) {
  const headers = {
    Authorization: "PCbQxLsxaK0ESo8IK85zRNhwIYW9OlViBOeO5hHdqmjMHH2JbCHo7jB8",
  };
  const endpoint = 'https://api.pexels.com/v1/search/food%20collection/';
  //fetch('https://api.quotable.io/random')
  fetch(endpoint, {headers})
    .then((response) => response.json())
    .then((data) => {

      //class = "login_image">
      const containerEl = document.querySelector('#image');

      containerEl.src = data.content
      
    });
}

function photo(){

    //import { createClient } from 'pexels';

  const client = createClient('PCbQxLsxaK0ESo8IK85zRNhwIYW9OlViBOeO5hHdqmjMHH2JbCHo7jB8');

  //client.photos.show({ id: 2014422 }).then(photo => {...});


};