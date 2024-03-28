import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { AuthState } from './login/authState';
import {Login} from './login/login';
//import {myRecipes} from './myRecipes/m_recipes';
import {allRecipes} from './myRecipes/all_recipes';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';




//authstate is just a variable, not additional component
function App() {
    const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
    const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated; // used to alter header
    const [authState, setAuthState] = React.useState(currentAuthState);

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
                    <ul><NavLink className="headerLink" to='AddRecipe'>Logout</NavLink></ul>
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
            <Route path='/AllRecipes' element={<allRecipes />} exact />
            <Route path='/MyRecipes' element={<allRecipes />} exact />
            <Route path='/AddRecipe' element={<allRecipes />} exact />
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