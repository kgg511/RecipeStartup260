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

//{"image":"https://foodish-api.com/images/burger/burger101.jpg"}
//this works 'https://foodish-api.com/images/samosa/samosa20.jpg'
function displayImage() {
  fetch('https://foodish-api.com/api/')
    .then((response) => {
      // Check if the response is OK
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const imageUrl = data["image"];
      console.log(`the image url is ${imageUrl}`);
      
      const containerEl = document.querySelector('#image');
      containerEl.src = imageUrl;
    })
    .catch((error) => {
      console.error('Error fetching or parsing data:', error);
    });
}



//displayPicture();
displayImage();