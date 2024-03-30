import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { AuthState } from './login/authState';
import {Login} from './login/login';
//import {myRecipes} from './myRecipes/m_recipes';
import {AllRecipes} from './Recipes/all_recipes';
import {MyRecipes} from './Recipes/m_recipes';
import {AddRecipe} from './addRecipes/add_recipe';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';



//authstate is just a variable, not additional component
function App() {
    const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
    const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated; // used to alter header
    const [authState, setAuthState] = React.useState(currentAuthState);

    async function signOut(){
      //make fetch request to the sign out endpoint 
      // if successful, change the page
      const response = await fetch(`/api/auth/logout`, {
          method: 'DELETE',
          headers: {'content-type': 'application/json'},
      });
      setAuthState(AuthState.Unauthenticated); //this will remove the header but it won't bring me to the login page

      // if(response.status === 204){
      //   return <Redirect to="/" />;
      // }
      // console.log("sign out failed")
      
  };

    //not logged in: NO header
    // logged in: logout, all recipes, my recipes, add recipe
    return (
        <BrowserRouter>
      <div className='body'>
        <header>
            {authState === AuthState.Unauthenticated && (<ul><h1>TasteTrove <i className="fa-solid fa-utensils"></i></h1> </ul>)}
            {authState === AuthState.Authenticated && (
                <nav>
                <ul><h1>TasteTrove <i className="fa-solid fa-utensils"></i></h1> </ul>
                    <ul><NavLink className="headerLink" to='AllRecipes'>All Recipes</NavLink></ul>
                    <ul><NavLink className="headerLink" to='MyRecipes'>My Recipes</NavLink></ul>
                    <ul><NavLink className="headerLink" to='AddRecipe'>Add Recipe</NavLink></ul>
                    <ul><NavLink className="headerLink" to='/'>Logout</NavLink></ul>
                    <ul><h5><button className="headerLink" id="SignOut" onClick={signOut}>Sign out</button></h5></ul>
                </nav>
              
              )}
                {/* <ul><h5><button class = "headerLink" id="SignOut" onclick="signOut()">Sign out</button></h5></ul> } */}
        </header>

        <Routes>
            <Route path='/' element={<Login 
                userName={userName}
                authState={authState}
                onAuthChange={(userName, authState) => {
                  setAuthState(authState);
                  setUserName(userName);
                }}
            />} exact />
            <Route path='/AllRecipes' element={<MyRecipes />} exact />
            <Route path='/MyRecipes' element={<MyRecipes />} exact />
            <Route path='/AddRecipe' element={<AddRecipe />} exact />
            <Route path='*' element={<NotFound />} />
        </Routes>

        <footer>
            <hr />
            <span className="text-reset">Katherine Greer</span>
            <a href="https://github.com/kgg511/RecipeStartup260">GitHub</a>
        </footer>

      </div>
      </BrowserRouter>
    );
  }

  function NotFound() {
    return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
  }

  export default App;