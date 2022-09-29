const menu = [
  {
    id: 1,
    name: "American breakfast",
    category: "breakfast",
    author: "Werito",
    img: "https://brianthacker.tv/wp-content/uploads/2015/08/img_2408-1030x986.jpg",
    time: 5,
    serving: 1,
    description: "Delicious meal for many people",
    ingredients: ["1 Carrot", "1/2 tablespoon of nies", "10 lemons"],
    steps: ["Bake the potato", "This is a test", "Done"],
  },
  {
    id: 2,
    name: "Broccoli Pesto Pasta",
    category: "lunch",
    author: "Ivan Mendoza",
    img: "https://cdn.loveandlemons.com/wp-content/uploads/2020/03/bean-recipes-1.jpg",
    time: 10,
    serving: 1,
    description: `This is a test. Testing the description`,
    ingredients: ["1 Carrot", "1/2 tablespoon of nies", "10 lemons"],
    steps: ["Bake the potato", "This is a test", "Done"],
  },
  {
    id: 3,
    name: "Instant Pot Chicken Marinara With Polenta",
    category: "dinner",
    author: "Morita Chicken",
    img: "https://images.immediate.co.uk/production/volatile/sites/30/2022/06/Chicken-chow-mein-7aeec1d.png",
    time: 15,
    serving: 2,
    description: "chicken",
    ingredients: ["1 Carrot", "1/2 tablespoon of nies", "10 lemons"],
    steps: ["Bake the potato", "This is a test", "Done"],
  },
  {
    id: 4,
    name: "Nies beakfast",
    category: "breakfast",
    author: "Werito",
    img: "https://brianthacker.tv/wp-content/uploads/2015/08/img_2408-1030x986.jpg",
    time: 30,
    serving: 10,
    description: "american",
    ingredients: ["1 Carrot", "1/2 tablespoon of nies", "10 lemons"],
    steps: ["Bake the potato", "This is a test", "Done"],
  },
  {
    id: 5,
    name: "Poop snack",
    category: "lunch",
    author: "Dino",
    img: "https://m.media-amazon.com/images/I/71FwZF-COHL._AC_SL1500_.jpg",
    time: 65,
    serving: 4,
    description: "american",
    ingredients: ["1 Carrot", "1/2 tablespoon of nies", "10 lemons"],
    steps: ["Bake the potato", "This is a test", "Done"],
  },
];

const navToggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".links");
const hero = document.querySelector(".hero-container");
const selectors = document.querySelector(".selector-container");
const btns = document.querySelectorAll(".selector-btn");
const sectionCenter = document.querySelector(".meals-container");
const search = document.querySelector(".search-container");
const input = document.querySelector(".search-input");
const recipeEl = document.querySelector(".recipe-container");

window.addEventListener("DOMContentLoaded", () => {
  displayMeals(selectMealsOfDay(menu), true);
});

navToggle.addEventListener("click", () => {
  links.classList.toggle("show-links");
  navToggle.classList.toggle("fix-toggle");
});

search.addEventListener("submit", (e) => {
  e.preventDefault();
  let searchMeals = [];
  if (input.value.length > 0) {
    menu.forEach((meal) => {
      if (meal.name.toLowerCase().includes(input.value.toLowerCase()) || meal.author.toLowerCase().includes(input.value.toLowerCase())) {
        searchMeals.push(meal);
      }
    });
    displayMeals(searchMeals);
    const searchFor = document.createElement("h1");
    searchFor.classList.add("search-for");
    searchFor.innerHTML = `Searching for: <i>${input.value}</i>`;
    sectionCenter.prepend(searchFor);
    input.value = "";
  }
});

btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const category = e.currentTarget.dataset.id;
    const mealCategory = menu.filter((mealItem) => {
      if (mealItem.category === category) {
        return mealItem;
      }
    });

    let favorites = getLocalStorage();
    const mealFavorite = menu.filter((mealItem) => {
      if (favorites[mealItem.id]) {
        return mealItem;
      }
    });
    if (category === "today") {
      displayMeals(selectMealsOfDay(menu), true);
    } else if (category === "favorite") {
      displayMeals(mealFavorite);
    } else {
      displayMeals(mealCategory);
    }
  });
});

function displayMeals(meals, todayMeal = false) {
  let favorites = getLocalStorage();
  let displayMeals = meals.map((meal) => {
    let selected = favorites[meal.id] ? "heart-clicked" : "";
    let mealTitle = todayMeal ? `<h4 class="meal-day-title">Today's ${meal.category}</h4>` : "";
    return `<div class="meal-day-container">
    ${mealTitle}
    <div class="meal-day" id="${meal.id}">
      <img class="meal-image" src="${meal.img}" alt="${meal.description}" />
      <h4 class="meal-title">${meal.name}</h4>
      <p class="meal-author">${meal.author}</p>
      <i class="heart fa-solid fa-heart ${selected}"></i>
    </div>
  </div>`;
  });
  displayMeals = displayMeals.join("");
  sectionCenter.innerHTML = displayMeals;
  const mealsEls = document.querySelectorAll(".meal-day");
  mealsEls.forEach((mealEl) => {
    let heartEl = mealEl.querySelector(".heart");
    mealEl.addEventListener("dblclick", () => {
      heartEl.classList.add("heart-clicked");
      addToLocalStorage(mealEl.id);
    });
    heartEl.addEventListener("click", () => {
      if (heartEl.classList.contains("heart-clicked")) {
        heartEl.classList.remove("heart-clicked");
        removeFromLocalStorage(mealEl.id);
      } else {
        heartEl.classList.add("heart-clicked");
        addToLocalStorage(mealEl.id);
      }
    });
    const mealName = mealEl.querySelector(".meal-title");
    mealName.addEventListener("click", () => {
      const selectedMeal = menu.filter((meal) => {
        if (meal.id === parseInt(mealEl.id)) {
          return meal;
        }
      })[0];
      let recipeIngredients = selectedMeal.ingredients.map((ingredient) => {
        return `<li>${ingredient}</li>`;
      });
      recipeIngredients = recipeIngredients.join("");
      let recipeSteps = selectedMeal.steps.map((step) => {
        return `<li>${step}</li>`;
      });
      recipeSteps = recipeSteps.join("");
      const recipe = `<img class="recipe-image" src="${selectedMeal.img}" alt="meal" />
      <p class="recipe-name">${selectedMeal.name}</p>
      <div class="prep-container">
        <p class="prep-item"><i class="fa-solid fa-stopwatch"></i>Cook: ${selectedMeal.time} minutes</p>
        <p class="prep-item"><i class="fa-sharp fa-solid fa-utensils"></i>${selectedMeal.serving} serving${selectedMeal.serving > 1 ? "s" : ""}</p>
      </div>
      <p class="recipe-description">${selectedMeal.description}</p>
      <div class="list-container">
        <h4>Ingredients</h4>
        <ul class="ingredients">
        ${recipeIngredients}
        </ul>
      </div>
      <div class="list-container">
        <h4>Steps</h4>
        <ol class="steps">
        ${recipeSteps}
        </ol>
      </div>
      <button class="recipe-btn">Back</button>`;
      window.scroll(0, 0);
      sectionCenter.classList.add("hidden");
      selectors.classList.add("hidden");
      hero.classList.add("hidden");
      recipeEl.classList.remove("hidden");
      recipeEl.innerHTML = recipe;
      document.querySelector(".recipe-btn").addEventListener("click", () => {
        sectionCenter.classList.remove("hidden");
        selectors.classList.remove("hidden");
        hero.classList.remove("hidden");
        recipeEl.classList.add("hidden");
      });
    });
  });
}

function filterMeal(menu, mealCategory) {
  return menu.filter((meal) => {
    if (meal.category === mealCategory) {
      return meal;
    }
  });
}

function selectMealsOfDay(menu) {
  const breakfastMeals = filterMeal(menu, "breakfast");
  const lunchMeals = filterMeal(menu, "lunch");
  const dinnerMeals = filterMeal(menu, "dinner");
  let mealsOfDay = [];
  mealsOfDay.push(breakfastMeals[0]);
  mealsOfDay.push(lunchMeals[0]);
  mealsOfDay.push(dinnerMeals[0]);
  return mealsOfDay;
}

function getLocalStorage() {
  return localStorage.getItem("favorites") ? JSON.parse(localStorage.getItem("favorites")) : {};
}

function addToLocalStorage(id) {
  let favorites = getLocalStorage();
  favorites[id] = true;
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function removeFromLocalStorage(id) {
  let favorites = getLocalStorage();
  delete favorites[id];
  localStorage.setItem("favorites", JSON.stringify(favorites));
}
