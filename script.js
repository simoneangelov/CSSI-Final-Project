console.log("Script is running!");

// Helper function - gets a random integer up to (but not including) the maximum
const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

// recipe stuff
const recipeSectionDiv = document.querySelector("#recipe_section");
const inputField = document.querySelector("#search");
const submitButton = document.querySelector("#submitButton");
const recipeName = document.querySelector("#recipe-name");
const recipeImage = document.querySelector("#recipe-image");
// const recipeIngredients = document.querySelector("#recipe-ingredients");
const recipeLink = document.querySelector("#recipe-link");
const recipeCalories = document.querySelector("#recipe-calories");

// console.log(recipeSectionDiv);
// console.log(inputField);
// console.log(submitButton);
//console.log(recipeLink);

// diet restriction stuff -- commented it out so it wouldnt cause errors for the time being:)
const c1_highProtein = document.querySelector("#Check1"); //high protein
const c2_lowCarb = document.querySelector("#Check2"); //low carb
const c3_keto = document.querySelector("#Check3"); //keto
const c4_veget = document.querySelector("#Check4"); //vegetarian
const c5_vegan = document.querySelector("#Check5"); //vegan

// Checking to see if the 
//console.log(c1_highProtein);
// console.log(c2_lowCarb);
// console.log(c3_keto);
// console.log(c4_veget);
// console.log(c5_vegan);

// test out if checkboxes work
// cb.onclick = () => {
//   alert(cb.value);
// };

// The function below enables the user to check only one checkbox
// Forcing user to only pick 1 dietary restriction, look at ID names of checkbox values 
function selectOnlyThis(id) {
  for (var i = 1; i <= 5; i++) {
    document.getElementById("Check" + i).checked = false;
  }
  document.getElementById(id).checked = true;
}

// ############################# RECIPE FUNCTIONALITY #############################
async function getRecipe(userInput) {
  //setting up connection with the Edamam API
  const myKey = "dea80f07cf13d098706d5b4bc837e307";
  const appId = "614d20c6";
  let beginning = `https://api.edamam.com/api/recipes/v2?type=public&q=`;
  let end = `&app_id=${appId}&app_key=${myKey}`;

  // add all ingredients to the url. We interate through the userInput array and add values at each index to the myQuery url
  // example ["banana, apple, oatmeal"] 
  for (let i = 0; i < userInput.length; i++) {
    beginning = beginning + userInput[i];
    if (i === userInput.length - 1) { // if we are at the last element
      break;
    }
    // otherwise we add a space at the end so we can keep adding ingredients to the url
    else {
      beginning = beginning + "%20";
    }
  }


  //editing the end of the url to add diet restrictions
  // if they selected high protein or low carb diet, then add this to the url
  if (c1_highProtein.checked === true) {
    end = end + `&diet=high-protein`;
    console.log("end has been edited");
  }
  else if (c2_lowCarb.checked === true) {
    end = end + `&diet=low-carb`;
  }
  //else if they selected keto, vegetarian, or vegan, then add this to the url
  else if (c3_keto.checked === true) {
    end = end + `&health=keto-friendly`;
  }
  else if (c4_veget.checked === true) {
    end = end + `&health=vegetarian`;
  }
  else if (c5_vegan.checked === true) {
    end = end + `&health=vegan`;
  }

  // make API connection
  // In alignment with Dave's API metaphor, `myQuery` is the list of things you want to buy.
  console.log(beginning + end);
  const myQuery = beginning + end;
  //const myQuery = `https://api.edamam.com/api/recipes/v2?type=public&q=${banana}%20${userInput[1]}&app_id=${appId}&app_key=${myKey}`;
  console.log("myQuery:", myQuery);

  // `fetch(myQuery)` is placing the order.
  // `response` or `await fetch(myQuery)` is the confirmation email.
  const response = await fetch(myQuery);
  console.log("Fetching 'confirmation email' from Edamam API to our query:", response);

  // `response.json()`` is the package is on its way.
  // `myJson` or `await response.json()`` is receiving the package.
  const myJson = await response.json();

  // if the API returns something but it found nothing for our query (ex. there are no high-protein oatmeal options), the length of the data/myJson is length zero. If length of data iz zero, that means no recipes will show up, so an alert will pop up.
  if (myJson.hits.length === 0) {
    alert("There are no recipes:( Try again!");
    return; // returning nothing to break out of the function early
  }
  console.log("Response to our query/package recieved from Edamam API:", myJson);

  //console.log(myJson.hits);
  //console.log(myJson.hits[getRandomInt(myJson.hits.length)]);
  // `myJson.data[0].title` is opening the package and using what's inside.
  //console.log("Length of JSON:", myJson.data.length);
  const recipe = myJson.hits[getRandomInt(myJson.hits.length)].recipe;
  //console.log("Recipe", recipe);


  // make the recipe show up on the html webpage
  // recipeLink.innerHTML = recipe.url;  -- link added
  recipeLink.innerHTML = `Recipe Link = <a href='${recipe.url}'>` + recipe.url + "</a>";
  recipeName.innerHTML = recipe.label;
  recipeImage.src = recipe.image;
  //this is so that when the user enters another recipe...the ingredients for last one erases.
  // recipeIngredients.innerHTML = "";
  // //for loop to allow us to list the ingredients
  // for (const i of recipe.ingredients) {
  //   recipeIngredients.innerHTML += `<div> ${i.food} </div>`;
  //   console.log(i);
  // }
  recipeCalories.innerHTML = `Calories = ${recipe.calories}`;
}


// After the user submits their ingredients of choice, the webpage will show a recipe they could use
submitButton.addEventListener("click", async (e) => {
  // Confirming eventlistener is working and setting up variables
  console.log("Submit button clicked!");

  // creating array of user's ingredients
  let userInput = inputField.value.split(" "); //user input converted from object into array

  // making sure the input field is not empty (otherwise request to API won't work)
  if (inputField.value == "" || inputField.value === null) {
    alert("Please enter at least one ingredient in the input box!");
  }
  else {
    getRecipe(userInput);
  }
});


// ############################# GROCERY LIST FUNCTIONALITY #############################
const groceryListDiv = document.querySelector("#grocery-list"); //this is where the grocery list will show displayed
const groceryInputField = document.querySelector("#grocery-input-field");
const groceryAddButton = document.querySelector("#add-grocery-button");

// console.log(groceryListDiv);
// console.log(groceryInputField);
// console.log(groceryAddButton);

//after the user enters a grocery item, the grocery list will be updated
// 'change' is an event of a text box/input field. it's triggered when you type in your response and click somewhere else or press ENTER
// how to find out more info about event listeners like "change": look up element type (ex. text, button, etc) with the language (ex. js) and try including things like "event", "input", etc.
groceryInputField.addEventListener('change', (e) => {
  const newGroceryItem = groceryInputField.value;
  groceryListDiv.innerHTML = groceryListDiv.innerHTML + `<li>${newGroceryItem}</li>`;

  groceryInputField.value = "";// clear input field after the grocery item has been added to the list
});
