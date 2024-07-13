const rowData = document.getElementById("rowData");
const searchContainer = document.getElementById("searchContainer");

$(document).ready(() => {
    searchByName("").then(() => {
        $(".loading-screen").fadeOut(500);
        $("body").css("overflow", "visible");
    });
});

const openSideNav = () => {
    $(".side-nav-menu").animate({ left: 0 }, 500);
    $(".open-close-icon").toggleClass("fa-align-justify fa-x");

    $(".links li").each((i, elem) => {
        $(elem).animate({ top: 0 }, (i + 5) * 100);
    });
};

const closeSideNav = () => {
    const boxWidth = $(".side-nav-menu .nav-tab").outerWidth();
    $(".side-nav-menu").animate({ left: -boxWidth }, 500);
    $(".open-close-icon").toggleClass("fa-align-justify fa-x");
    $(".links li").animate({ top: 300 }, 500);
};

closeSideNav();
$(".side-nav-menu i.open-close-icon").click(() => {
    if ($(".side-nav-menu").css("left") === "0px") {
        closeSideNav();
    } else {
        openSideNav();
    }
});

const displayMeals = (arr) => {
    const meals = arr.map(meal => `
        <div class="col-md-3">
            <div onclick="getMealDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${meal.strMealThumb}" alt="">
                <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>
        </div>
    `).join("");
    rowData.innerHTML = meals;
};

const fetchAndDisplay = async (url, displayFn) => {
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);
    searchContainer.innerHTML = "";

    const response = await fetch(url);
    const data = await response.json();

    displayFn(data.categories || data.meals);
    $(".inner-loading-screen").fadeOut(300);
};

const getCategories = () => fetchAndDisplay("https://www.themealdb.com/api/json/v1/1/categories.php", displayCategories);
const getArea = () => fetchAndDisplay("https://www.themealdb.com/api/json/v1/1/list.php?a=list", displayArea);
const getIngredients = () => fetchAndDisplay("https://www.themealdb.com/api/json/v1/1/list.php?i=list", (meals) => displayIngredients(meals.slice(0, 20)));

const displayCategories = (arr) => {
    const categories = arr.map(category => `
        <div class="col-md-3">
            <div onclick="getCategoryMeals('${category.strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${category.strCategoryThumb}" alt="">
                <div class="meal-layer position-absolute text-center text-black p-2">
                    <h3>${category.strCategory}</h3>
                    <p>${category.strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
            </div>
        </div>
    `).join("");
    rowData.innerHTML = categories;
};

const displayArea = (arr) => {
    const areas = arr.map(area => `
        <div class="col-md-3">
            <div onclick="getAreaMeals('${area.strArea}')" class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${area.strArea}</h3>
            </div>
        </div>
    `).join("");
    rowData.innerHTML = areas;
};

const displayIngredients = (arr) => {
    const ingredients = arr.map(ingredient => `
        <div class="col-md-3">
            <div onclick="getIngredientsMeals('${ingredient.strIngredient}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${ingredient.strIngredient}</h3>
                <p>${ingredient.strDescription.split(" ").slice(0, 20).join(" ")}</p>
            </div>
        </div>
    `).join("");
    rowData.innerHTML = ingredients;
};

const fetchAndDisplayMeals = async (url) => {
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);

    const response = await fetch(url);
    const data = await response.json();

    displayMeals(data.meals);
    $(".inner-loading-screen").fadeOut(300);
};

const getCategoryMeals = (category) => fetchAndDisplayMeals(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
const getAreaMeals = (area) => fetchAndDisplayMeals(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
const getIngredientsMeals = (ingredients) => fetchAndDisplayMeals(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`);

const getMealDetails = async (mealID) => {
    closeSideNav();
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    const data = await response.json();

    displayMealDetails(data.meals[0]);
    $(".inner-loading-screen").fadeOut(300);
};

const displayMealDetails = (meal) => {
    const ingredients = Array.from({ length: 20 }, (_, i) => meal[`strIngredient${i + 1}`] && meal[`strMeasure${i + 1}`] ? `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i + 1}`]} ${meal[`strIngredient${i + 1}`]}</li>` : "").join("");

    const tags = meal.strTags ? meal.strTags.split(",").map(tag => `<li class="alert alert-danger m-2 p-1">${tag}</li>`).join("") : "";

    const mealDetails = `
        <div class="col-md-4">
            <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
            <h2>${meal.strMeal}</h2>
        </div>
        <div class="col-md-8">
            <h2>Instructions</h2>
            <p>${meal.strInstructions}</p>
            <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
            <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
            <h3>Recipes :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${ingredients}
            </ul>
            <h3><span class="fw-bolder">Tags : </span><ul class="list-unstyled d-flex g-3 flex-wrap">
                ${tags}
            </ul></h3>
            <a class="btn btn-success text-white" target="_blank" href="${meal.strSource}">Source</a>
            <a class="btn btn-danger text-white" target="_blank" href="${meal.strYoutube}">Youtube</a>
        </div>
    `;

    rowData.innerHTML = mealDetails;
};

const showSearchInputs = () => {
    searchContainer.innerHTML = `
        <div class="row py-4">
            <div class="col-md-6">
                <input onkeyup="searchByName(this.value)" type="text" class="form-control bg-transparent text-white" placeholder="Search By Name">
            </div>
            <div class="col-md-6">
                <input onkeyup="searchByFirstLetter(this.value)" maxlength="1" type="text" class="form-control bg-transparent text-white" placeholder="Search By First Letter">
            </div>
        </div>
    `;
    rowData.innerHTML = "";
};

const searchByName = async (term) => {
    await fetchAndDisplayMeals(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
};

const searchByFirstLetter = async (term) => {
    term = term || "a";
    await fetchAndDisplayMeals(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`);
};

const showContacts = () => {
    rowData.innerHTML = `
        <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
            <div class="container w-75 text-center">
                <div class="row g-4">
                    <div class="col-md-6">
                        <input id="nameInput" type="text" class="form-control" placeholder="Enter Your Name">
                        <div class="alert mt-1 alert-danger d-none" id="nameAlert" role="alert">
                            Special Characters and Numbers not allowed
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="emailInput" type="email" class="form-control " placeholder="Enter Email">
                        <div class="alert mt-1 alert-danger d-none" id="emailAlert" role="alert">
                            Enter valid email. *Ex: xxx@yyy.zzz
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="phoneInput" type="text" class="form-control " placeholder="Enter phone">
                        <div class="alert mt-1 alert-danger d-none" id="phoneAlert" role="alert">
                            Enter valid Phone Number
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="ageInput" type="number" class="form-control " placeholder="Enter Age">
                        <div class="alert mt-1 alert-danger d-none" id="ageAlert" role="alert">
                            Enter valid age
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="passwordInput" type="password" class="form-control " placeholder="Enter Password">
                        <div class="alert mt-1 alert-danger d-none" id="passwordAlert" role="alert">
                            Enter valid password. Minimum eight characters, at least one letter and one number
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="rePasswordInput" type="password" class="form-control " placeholder="Enter RePassword">
                        <div class="alert mt-1 alert-danger d-none" id="repasswordAlert" role="alert">
                            Enter valid Repassword
                        </div>
                    </div>
                </div>
                <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
            </div>
        </div>
    `;

    const nameInput = document.getElementById("nameInput");
    const emailInput = document.getElementById("emailInput");
    const phoneInput = document.getElementById("phoneInput");
    const ageInput = document.getElementById("ageInput");
    const passwordInput = document.getElementById("passwordInput");
    const rePasswordInput = document.getElementById("rePasswordInput");

    const validateName = () => {
        const regex = /^[a-zA-Z\s]+$/;
        if (regex.test(nameInput.value)) {
            nameInput.classList.add("is-valid");
            nameInput.classList.remove("is-invalid");
            document.getElementById("nameAlert").classList.add("d-none");
        } else {
            nameInput.classList.add("is-invalid");
            nameInput.classList.remove("is-valid");
            document.getElementById("nameAlert").classList.remove("d-none");
        }
        toggleSubmitButton();
    };

    const validateEmail = () => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (regex.test(emailInput.value)) {
            emailInput.classList.add("is-valid");
            emailInput.classList.remove("is-invalid");
            document.getElementById("emailAlert").classList.add("d-none");
        } else {
            emailInput.classList.add("is-invalid");
            emailInput.classList.remove("is-valid");
            document.getElementById("emailAlert").classList.remove("d-none");
        }
        toggleSubmitButton();
    };

    const validatePhone = () => {
        const regex = /^\d{11}$/;
        if (regex.test(phoneInput.value)) {
            phoneInput.classList.add("is-valid");
            phoneInput.classList.remove("is-invalid");
            document.getElementById("phoneAlert").classList.add("d-none");
        } else {
            phoneInput.classList.add("is-invalid");
            phoneInput.classList.remove("is-valid");
            document.getElementById("phoneAlert").classList.remove("d-none");
        }
        toggleSubmitButton();
    };

    const validateAge = () => {
        const age = parseInt(ageInput.value, 10);
        if (age >= 18 && age <= 100) {
            ageInput.classList.add("is-valid");
            ageInput.classList.remove("is-invalid");
            document.getElementById("ageAlert").classList.add("d-none");
        } else {
            ageInput.classList.add("is-invalid");
            ageInput.classList.remove("is-valid");
            document.getElementById("ageAlert").classList.remove("d-none");
        }
        toggleSubmitButton();
    };

    const validatePassword = () => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (regex.test(passwordInput.value)) {
            passwordInput.classList.add("is-valid");
            passwordInput.classList.remove("is-invalid");
            document.getElementById("passwordAlert").classList.add("d-none");
        } else {
            passwordInput.classList.add("is-invalid");
            passwordInput.classList.remove("is-valid");
            document.getElementById("passwordAlert").classList.remove("d-none");
        }
        validateRePassword();
        toggleSubmitButton();
    };

    const validateRePassword = () => {
        if (rePasswordInput.value === passwordInput.value && rePasswordInput.value !== "") {
            rePasswordInput.classList.add("is-valid");
            rePasswordInput.classList.remove("is-invalid");
            document.getElementById("repasswordAlert").classList.add("d-none");
        } else {
            rePasswordInput.classList.add("is-invalid");
            rePasswordInput.classList.remove("is-valid");
            document.getElementById("repasswordAlert").classList.remove("d-none");
        }
        toggleSubmitButton();
    };

    const toggleSubmitButton = () => {
        if (nameInput.classList.contains("is-valid") &&
            emailInput.classList.contains("is-valid") &&
            phoneInput.classList.contains("is-valid") &&
            ageInput.classList.contains("is-valid") &&
            passwordInput.classList.contains("is-valid") &&
            rePasswordInput.classList.contains("is-valid")) {
            document.getElementById("submitBtn").disabled = false;
        } else {
            document.getElementById("submitBtn").disabled = true;
        }
    };

    nameInput.addEventListener("input", validateName);
    emailInput.addEventListener("input", validateEmail);
    phoneInput.addEventListener("input", validatePhone);
    ageInput.addEventListener("input", validateAge);
    passwordInput.addEventListener("input", validatePassword);
    rePasswordInput.addEventListener("input", validateRePassword);
};

searchByName("");
