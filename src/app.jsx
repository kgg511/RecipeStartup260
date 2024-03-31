import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { AuthState } from './login/authState';
import {Login} from './login/login';
//import {myRecipes} from './myRecipes/m_recipes';
import {AllRecipes} from './Recipes/all_recipes';
import {MyRecipes} from './Recipes/m_recipes';
import {AddRecipe} from './addRecipes/add_recipe';
import {Logout} from './Logout/logout';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';


//authstate is just a variable, not additional component
function App() {
    const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
    const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated; // used to alter header
    const [authState, setAuthState] = React.useState(currentAuthState);

    return (
        <BrowserRouter>
      <div className='body'>
        <header>
            {authState === AuthState.Unauthenticated && (<ul><h1>TasteTrove <FontAwesomeIcon icon={faUtensils} /></h1> </ul>)}
            {authState === AuthState.Authenticated && (
                <nav>
                <ul><h1>TasteTrove <FontAwesomeIcon icon={faUtensils} /></h1> </ul>
                    <ul><NavLink className="headerLink" to='AllRecipes'>All Recipes</NavLink></ul>
                    <ul><NavLink className="headerLink" to='MyRecipes'>My Recipes</NavLink></ul>
                    <ul><NavLink className="headerLink" to='AddRecipe'>Add Recipe</NavLink></ul>
                    <ul><NavLink className="headerLink" to='/Logout'>Logout</NavLink></ul>
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
            <Route path='/AllRecipes' element={<AllRecipes />} exact />
            <Route path='/MyRecipes' element={<MyRecipes />} exact />
            <Route path='/AddRecipe' element={<AddRecipe />} exact />
            <Route path='/Logout' element={<Logout changeAuthstate={setAuthState}/>} exact />
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