async function login() {
  loginCreate('/auth/login');
}

async function register() {
  loginCreate('/auth/create');
}

async function loginCreate(endpoint){
  const username = document.querySelector("#exampleUsername").value;
  const password = document.querySelector("#examplePassword").value;

  const makeRequestObject = {"username": username, "password": password};
  const request = await fetch(endpoint, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(makeRequestObject),
  });
  const response = await request.json(); //returns userid in body, authToken in header

  if(response.ok){
    localStorage.setItem("UserName", username);
    await update_usernames(username);
    console.log(`your username is ${username}`);
    window.location.href = "all_recipes.html";
  }
  else{ //you're not going anywhere if you couldn't log in or create correctly
    console.log("it failed");
    const div = document.querySelector("div.Login");
    const p = document.createElement("p");
    const type = endpoint.slice(6);
    p.textContent = `${type} failed. Please try again.`;
    div.appendChild(p);
  }
}


async function update_usernames(username){
  const usernames = JSON.parse(localStorage.getItem("Usernames")) || [];

  const inUsernames = usernames.some(item => item === username);
  if(!inUsernames){
    usernames.push(username);
    localStorage.setItem("Usernames", JSON.stringify(usernames));
  }
}

function displayImage() {
  fetch('https://foodish-api.com/api/')
    .then((response) => {
      if (!response.ok) { // Check if the response is OK
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


displayImage();