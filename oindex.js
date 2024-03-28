async function login() {
  loginCreate('/api/auth/login');
}

async function register() {
  loginCreate('/api/auth/create');
}

async function loginCreate(endpoint){
  const username = document.querySelector("#exampleUsername")?.value;
  const password = document.querySelector("#examplePassword")?.value;
  const makeRequestObject = {username: username, password: password};
  try{
    if(username === "" || password === ""){loginRegisterError(endpoint); return;}
    const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(makeRequestObject),
    });

    if(response.ok){
      console.log(`your username is ${username}`);
      window.location.href = "all_recipes.html";
    }
    else{ //you're not going anywhere if you couldn't log in or create correctly
      loginRegisterError(endpoint);
    }
}
  catch (error) {
    console.error('Error:', error.message);
    // Handle errors gracefully, e.g., display an error message to the user
  }
}

function loginRegisterError(endpoint){
  if(document.querySelector("#wrong")){ //if warning already there
    document.querySelector("#wrong").remove();
  }
  //updates UI to display error message for incorrect username/password/blank fields
  console.log("it failed");
  const div = document.querySelector("div.Login");
  const p = document.createElement("p");
  const type = endpoint.slice(10);
  p.setAttribute("id", "wrong");
  p.textContent = `${type} failed. Please try again.`;
  div.appendChild(p);
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