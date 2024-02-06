

function login() { //TODO: must have correct username and password
    const nameEl = document.querySelector("#exampleUsername");
    localStorage.setItem("UserName", nameEl.value);
    console.log(`your username is ${nameEl.value}`);
    window.location.href = "all_recipes.html";
    
  }
//Login: username and password must be in the database



//Register: they can't use a username that is already in use
