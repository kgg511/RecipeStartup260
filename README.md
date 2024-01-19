# Taste Trove #
## Description deliverable ##

### Elevator Pitch ###

Do you like cooking or baking? Do you wish you had access to your friends and family’s cookbook recipes? My application, Taste Trove, allows users to post recipes and see those posted by others. Once signed in, scroll through mouth watering recipes till you find one that fits your tastes. Use the number of 'makes' on a recipe to see what is most popular. Click the 'add recipe' button to share one of your own.

### Design ###
![Alt Text](bp/login.png)
![Alt Text](bp/add_recipe.png)
![Alt Text](bp/all_recipes.png)
![Alt Text](bp/flip.png)

### Key Features ###
- Secure login
- Add/delete recipes
- Display user’s recipes
- Display all recipes
- ‘Make’ a recipe
- Users, recipes, ‘makes’, persistently stored

### Technologies ###
I will use the required technologies in the following ways:

- HTML: Three HTML pages using the proper HTML structure. One for login, one for the user’s recipes, one for all recipes.

- CSS: Attractive design that works for different screen size. Scroll through recipes. Colors and fonts that stand out.

- JavaScript: Login, adding/delete recipes, flip to see recipe, increase 'makes' for a recipe, toggle between user recipes and all recipes.

- Service: Login, retrieving recipe info.
  
- Database/Login:
  - Users login info
  - Recipes
  - Who posted each recipe
  - ‘Makes’ on a recipe

- WebSocket: Users can see each other's recipes and its number of 'makes'.

- React: Wrap application into React web framework.

## HTML deliverable ##
For this deliverable I built the structure of my application using HTML.

- HTML: Four HTML pages: login, user recipes, all recipes, and add a recipe.
- Links: 
  - Login page links to all recipes.
  - all recipes links to login and user recipes.
  - Add a recipe has a button that links to user recipes.
- Text: Each recipe has a name, ingredients, and instructions.
- Images:
  - The login page will display a random dessert image from a 3rd party application.
  - Each recipe has an image.
- DB/Login:
  - Login page with username and password.
  - The users, their recipes, and their makes are stored.
- WebSocket:
  - Users can see recipes posted by other users.
  - Users can see how many ‘makes’ a recipe has received.


