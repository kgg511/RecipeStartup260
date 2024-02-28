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


async function displayImaged() {
  fetch('https://foodish-api.com/images/samosa/samosa20.jpg')
    .then((response) => response.json())
    .then((data) => {
      console.log("i got the data");
      const containerEl = document.querySelector('#image');
      image_url = data['image']
      containerEl.src = image_url
    });
}
//{"image":"https://foodish-api.com/images/burger/burger101.jpg"}
//https://foodish-api.herokuapp.com/api/'

//this works 'https://foodish-api.com/images/samosa/samosa20.jpg'
function displayImage() {
  fetch('https://foodish-api.com')
  //src="/images/samosa/samosa21.jpg"
    .then((response) => {
      // Check if the response is OK
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob(); // Get the response as a Blob
    })
    .then((blob) => {
      // Convert the Blob to a URL
      const imageUrl = URL.createObjectURL(blob);
      console.log(`the image url is ${imageURL}`);
      
      // Set the image URL to the container's src attribute
      const containerEl = document.querySelector('#image');
      containerEl.src = imageUrl;
    })
    .catch((error) => {
      console.error('Error fetching or parsing data:', error);
    });
}

function displayPicture() {
  const random = Math.floor(Math.random() * 1000);
  fetch(`https://picsum.photos/v2/list?page=${random}&limit=1`)
    .then((response) => response.json())
    .then((data) => {
      console.log("i got the data");
      const containerEl = document.querySelector('#image');
      //image_url = data['image']
      //containerEl.src = data.content
      //containerEl.src = image_url
      const imgUrl = `https://picsum.photos/id/${data[0].id}/${width}/${height}?grayscale`;
      //const imgEl = document.createElement('img');
      containerEl.src = imgUrl
      //imgEl.setAttribute('src', imgUrl);
      //containerEl.appendChild(imgEl);
    });
}

//displayPicture();
//displayImage();