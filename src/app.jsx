import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import {Login} from './login/login';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
      <div className='body'>
        <header>
            <nav>
                <ul><h1>TasteTrove <i class="fa-solid fa-utensils"></i></h1> </ul>
                <ul><NavLink class = "headerLink" to=''>Login</NavLink></ul>
                <ul><NavLink class = "headerLink" to='AllRecipes'>All Recipes</NavLink></ul>
                <ul><NavLink class = "headerLink" to='MyRecipes'>My Recipes</NavLink></ul>
                <ul><NavLink class = "headerLink" to='AddRecipe'>Add Recipe</NavLink></ul>
                {/* <ul><h5><button class = "headerLink" id="SignOut" onclick="signOut()">Sign out</button></h5></ul> 
                <ul><h5><button class = "headerLink" onclick = "window.location.href='all_recipes.html'">All Recipes</button></h5></ul>  
                <ul><h5><button class = "headerLink" onclick = "window.location.href='add_recipe.html'">Add Recipe</button></h5></ul>      */}
            </nav>
        </header>

        <Routes>
            <Route path='/' element={<Login />} exact />
            <Route path='/AllRecipes' element={<Login />} exact />
            <Route path='/MyRecipes' element={<Login />} exact />
            <Route path='/AddRecipe' element={<Login />} exact />
            <Route path='*' element={<NotFound />} />
        </Routes>
  
        <footer>
            <hr />
            <span class="text-reset">Katherine Greer</span>
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