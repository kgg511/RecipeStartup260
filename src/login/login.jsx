import React from 'react';
import './login.css';
import { MessageDialog } from '../messageDialogue';
import { useNavigate } from 'react-router-dom';
import { AuthState } from './authState';

export function Login(userName, authState, onAuthChange) {//
  const [Username, setUsername] = React.useState(userName); //what they typed in
  const [Password, setPassword] = React.useState(''); 
  const [displayError, setDisplayError] = React.useState(null); 

  function onChange(event) {
    if (event.target.id === 'exampleUsername') {
      setUsername(event.target.value);
      console.log(`your username is ${Username}`);
    } else if (event.target.id === 'examplePassword') {
      setPassword(event.target.value);
      console.log(`your password has been changed to ${Password}`);
    }
  }

  const navigate = useNavigate();

  async function login() {
    loginCreate('/api/auth/login');
  }
  
  async function register() {
    loginCreate('/api/auth/create');
  }
  
  async function loginCreate(endpoint){
    // const username = document.querySelector("#exampleUsername")?.value;
    // const password = document.querySelector("#examplePassword")?.value;
    const makeRequestObject = {username: Username, password: Password}; //using state variables
    try{
      if(Username === "" || Password === ""){loginRegisterError(endpoint); return;}
      const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(makeRequestObject),
      });
  
      if(response.ok){
        console.log(`your username is ${Username}`);
        navigate('/AllRecipes');
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
    //const div = document.querySelector("div.Login");
    //const p = document.createElement("p");
    const type = endpoint.slice(10);
    //p.textContent = `${type} failed. Please try again.`;
    //div.appendChild(p);
    setDisplayError(`${type} failed. Please try again.`);
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

  React.useEffect(() => {
    displayImage();
}, []);
  
  
  return (
    <main>
    <div className = "Login">
      <form method="get">
        <div className="form-group">
          <h3 className="Login">Login</h3>
          <label htmlFor="username">Username</label>
          <input type="text" className="form-control" id="exampleUsername" onChange={(e) => onChange(e)} aria-describedby="emailHelp" placeholder="Username" required/>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input type="password" className="form-control" id="examplePassword" onChange={(e) => onChange(e)} placeholder="Password" required/>
        </div>
        <button type="button" onClick={() => login()} className="btn btn-primary">Sign in</button>
        <button type="button" onClick={() => register()} className="btn btn-primary">Create</button>
        
      </form>
    </div>

    <div className = "login_image">
      <img id = "image" src="" alt="Random baking photo" width="50%"/>
    </div>

    <MessageDialog message={displayError} onHide={() => setDisplayError(null)} />
    
</main>

//


  );
}