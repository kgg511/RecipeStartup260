import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import {Login} from './login/login';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';

export default function App() {
    return (
      <div className='body'>
        <header>
            <nav>
                <ul><h1>TasteTrove <i class="fa-solid fa-utensils"></i></h1> </ul>
                <ul><h5><button class = "headerLink" id="SignOut" onclick="signOut()">Sign out</button></h5></ul> 
                <ul><h5><button class = "headerLink" onclick = "window.location.href='all_recipes.html'">All Recipes</button></h5></ul>  
                <ul><h5><button class = "headerLink" onclick = "window.location.href='add_recipe.html'">Add Recipe</button></h5></ul>     
            </nav>
        </header>

        
        {/* <header className='container-fluid'>
          <nav className='navbar fixed-top navbar-dark'>
            <div className='navbar-brand'>
              TasteTrove <i class="fa-solid fa-utensils"></i>
            </div>
            <menu className='navbar-nav'>
              <li className='nav-item'>
                <a className='nav-link' href='index.html'>
                  My Recipes
                </a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' href='play.html'>
                  All Recipes
                </a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' href='scores.html'>
                  Add Recipe
                </a>
              </li>
            </menu>
          </nav>
        </header> */}
  
        <main>App components go here</main>
  
        <footer>
            <hr />
            <span class="text-reset">Katherine Greer</span>
            <a href="https://github.com/kgg511/RecipeStartup260">GitHub</a>
        </footer>
        
      </div>
    );
  }