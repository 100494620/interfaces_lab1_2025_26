const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=(.*\d){2})(?=.*?[#?!.,:;@$%^&*-]).{12}$/;

function openRegisterForm() {
    document.getElementById("popupRegistrar").style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeRegisterForm() {
    let confirmClosing = confirm("Are u sure you want to close the form?");
    if (confirmClosing) {
        document.getElementById("registerForm").reset();
        document.getElementById("popupRegistrar").style.display = "none";
        document.body.style.overflow = "";
    }
}

function myProfilePopUp() {
    hideDropDown();
    document.body.style.overflow = "hidden";

    let user = getMyInfo()

    $("#myProfileUsername").text(user.username);
    $("#myProfileEmail").text(user.email);
    $("#myProfileCity").text(user.city);
    $("#myProfileCountry").text(user.country);
    $("#myProfileGender").text(user.gender);

    $("#myProfileChildren").empty();
    user.children.forEach(child => {
        $("#myProfileChildren").append(`<li>${child.nameOfChild}, ${child.ageOfChild} años, ${child.toysOfChild}</li>`);
    });

    $("#popupMyProfile").fadeIn(500).removeClass("hidden");
}

function closeProfileForm() {
    $("#popupMyProfile").fadeOut(500, function () {
        $(this).addClass("hidden");
        document.body.style.overflow = "";
    });
}

function openEditForm() {
    $("#popupMyProfile").fadeOut(500, function () {
        let user = getMyInfo();

        $("#usernameE").val(user.username);
        $("#emailE").val(user.email);
        $("#cityE").val(user.city);
        $("#countryE").val(user.country);
        $("#genderE").val(user.gender);

        $("#childrenE").empty();
        user.children.forEach((child, index) => addChildWithParams(child, index));

        $("#popupEditProfile").fadeIn(500).removeClass("hidden");
    });
}

function addNewChild() {
    addChildWithParams(new Child('', null, ''), $(".child").length)
}

function addChildWithParams(child, i) {
    const childHtml = `
        <div id="child-${i + 1}" class="child">
            <p style="margin-left: 50%;">Hijo ${i + 1}</p>
            <label for="child-${i + 1}-name">Nombre</label>
                <input type="text" placeholder="Enter child's name" id="child-${i + 1}-name" name="child-${i + 1}-name" minlength="3" value="${child.nameOfChild}">
                
                <label for="child-${i + 1}-age">Edad</label>
                <input type="number" placeholder="Enter child's age" id="child-${i + 1}-age" name="child-${i + 1}-age" value="${child.ageOfChild}">
                 
                <label for="child-${i + 1}-toys">Juguetes favoritos</label>
                <input type="text" placeholder="Enter child's favourite toys/games" id="child-${i + 1}-toys" name="child-${i + 1}-toys" value="${child.toysOfChild}">
                <div class="children-container">
                    <button class="button-remove-child" type="button" data-index="${i}">Remove Child</button>
                </div>
        </div>
    `;
    $("#childrenE").append(childHtml);
}
$(document).on("click", ".button-remove-child", function() {
    const index = $(this).data("index");
    $(`#child-${index+1}`).remove();
});

function cancelEdit() {
    $("#popupEditProfile").fadeOut(500, function () {
        $("#popupMyProfile").fadeIn(500).removeClass("hidden");
    }).reset();
}

$("#editForm").on("submit", function () {
    let children = [];
    $(".child").each(function(index) {
        children.push(new Child(
            $(this).find(`input[name="child-${index + 1}-name"]`).val(),
            $(this).find(`input[name="child-${index + 1}-age"]`).val(),
            $(this).find(`input[name="child-${index + 1}-toys"]`).val())
        );
    });

    const updatedUser = {
        username: $("#usernameE").val(),
        city: $("#cityE").val(),
        country: $("#countryE").val(),
        gender: $("#genderE").val(),
    };

    let user = getMyInfo();
    user.username = updatedUser.username;
    user.city = updatedUser.city;
    user.country = updatedUser.country;
    user.gender = updatedUser.gender;
    user.children = children;

    saveUser(user);

    $("#popupEditProfile").fadeOut(500);

    myProfilePopUp()

    return false;
});

function clearRegisterForm() {
    let confirmCleaning = confirm("Are u sure you want to clear all the fields?");
    console.log(confirmCleaning);
    if (confirmCleaning) {
        document.getElementById("registerForm").reset();
    }
}

$("#registerForm").submit(onRegistration)

function onRegistration() {
    console.log("Entered the saving data...")
    let user = readUserRegistrationData()

    if (!PASSWORD_REGEX.test(user.password)) {
        alert("Password is not following the correct structure!");
        document.getElementById("passwordR").value = '';
        document.getElementById("passwordRR").value = '';
        return false;
    }

    //console.log("Checked passwords...")
    const passwordConfirm = document.getElementById("passwordRR").value;
    if (user.password !== passwordConfirm) {
        alert("Passwords don't match");
        document.getElementById("passwordR").value = '';
        return false;
    }

    registerUser(user);
    confirmStored();
    document.getElementById("registerForm").reset();

    return false;
}

function readUserRegistrationData() {
    return new User(
        document.getElementById("usernameR").value,
        document.getElementById("passwordR").value,
        document.getElementById("emailR").value,
        document.getElementById("cityR").value,
        document.getElementById("countryR").value,
        document.getElementById("gender").value,
        document.getElementById("children").value,
        readUsersChildren(),
        false
    );
}

function readUsersChildren() {
    const numOfChildren = document.getElementById("children").value;
    const children = [];

    for (let i = 0; i < numOfChildren; i++) {
        const c = new Child(
            document.getElementById(`child-${i + 1}-name`).value,
            document.getElementById(`child-${i + 1}-age`).value,
            document.getElementById(`child-${i + 1}-toys`).value
        )
        children.push(c);
    }

    return children;
}

function confirmStored() {
    alert("Your data was stored correctly!")
    document.getElementById("popupRegistrar").style.display = "none";
    document.body.style.overflow = "";
}

function registerUser(user) {
    // save user's information
    let registeredUsers = getRegisteredUsers();

    if (registeredUsers.has(user.email)) {
        alert("User already exists");
    }

    registeredUsers.set(user.email, user);
    saveRegisteredUsersToStorage(registeredUsers);

    // save user's empty cards
    let cards = getUsersCards();
    cards.set(user.email, []);
    saveUsersCardsToStorage(cards);
}

//localStorage.clear();

function openSignInForm() {
    document.getElementById("popupIniciar").style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeSignInForm() {
    document.getElementById("popupIniciar").style.display = "none";
    document.body.style.overflow = "";
    document.getElementById("emailLogin").value = "";
    document.getElementById("passwordLogin").value = "";
}

$("#LoginForm").submit(onLoginUser)

function onLoginUser() {
    let enteredEmail = document.getElementById("emailLogin").value;
    let enteredPassword = document.getElementById("passwordLogin").value;

    const registeredUsers = getRegisteredUsers();

    if (!registeredUsers.has(enteredEmail)) {
        alert("You are not registered!");
        document.getElementById("passwordLogin").value = "";
        return false;
    }

    let user = registeredUsers.get(enteredEmail);
    if (user.password !== enteredPassword) {
        alert("Wrong password!");
        document.getElementById("passwordLogin").value = "";
        return false;
    }

    loadUsersState(user, registeredUsers)

    closeSignInForm();
    isLoggedInWithParams(user);

    return false;
}

function loadUsersState(user, registeredUsers) {
    user.loginStatus = true;
    registeredUsers.set(user.email, user);
    saveRegisteredUsersToStorage(registeredUsers);

    localStorage.setItem(EMAIL_LS_DATA, user.email);
    localStorage.setItem(MY_CARDS_LS_DATA, JSON.stringify(Array.from(getUsersCards().get(user.email))))
}

function isLoggedIn() {
    const username = localStorage.getItem(EMAIL_LS_DATA);
    const user = getRegisteredUsers().get(username);

    isLoggedInWithParams(user);
}

function isLoggedInWithParams(user) {
    if (!user || !user.loginStatus) {
        return;
    }

    showLoggedInNavBar();
}

function showLoggedInNavBar() {
    $('#signIn, #registrar').remove();
    $('#Navegacion').append(`
            <div class="dropdown" id="drop-down">
                <img onclick="showDropDown()" class="login-button" src="../images/login-icon.png" alt="login icon" id="log-icon">
                <div id="showDropDown" class="dropdown-content">
                    <a id="profile" onclick="myProfilePopUp()">Mi Perfil</a>
                    <a id="mis-cartas" onclick="lasCartasPopUp()">Mis cartas</a>
                    <a id="log-out" onclick="onLogOut()">Cerrar sesión</a>
                </div>
            </div>
        `);
}

function onLogOut() {
    let result = confirm("Log out?");

    if (result) {
        logOut();
    }
}

function logOut() {
    const username = localStorage.getItem(EMAIL_LS_DATA);
    const registeredUsers = getRegisteredUsers();
    const user = registeredUsers.get(username);

    removeUsersState(user, registeredUsers)

    $('#log-icon, #drop-down').remove();
    $('#Navegacion').append(`
        <div class="menu-buttons" onclick=" openSignInForm
    ()" id="signIn">Sign In</div>
        <div class="menu-buttons" id="registrar" onclick="openRegisterForm()">Registrar</div>
    `);
}

function removeUsersState(user, registeredUsers) {
    user.loginStatus = false;
    registeredUsers.set(user.email, user);
    saveRegisteredUsersToStorage(registeredUsers)

    localStorage.removeItem(EMAIL_LS_DATA);
    localStorage.removeItem(MY_CARDS_LS_DATA);
}

function showDropDown() {
    $("#showDropDown").toggleClass("show");
}

function hideDropDown() {
    $("#showDropDown").removeClass("show")
}

function lasCartasPopUp() {
    hideDropDown();
    $("#LasCartas").fadeIn();
    lasCartasShowCards()
    document.body.style.overflow = "hidden";
}

function lasCartasShowCards() {
    const $cardsContainer = $("#UsersSentCards")

    $cardsContainer.empty()
    $("#LasCartasNoCartas").addClass("hidden")

    let myCards = getMyCards()

    if (myCards.length === 0) {
        $("#LasCartasNoCartas").removeClass("hidden")
    } else {
        myCards.forEach((card) => {
            const cartaHTML = `
            <div class="carta" id="carta-${card.id}" data-id="${card.id}">
                <div class="carta-header">Carta ${card.id}</div>
                <div class="carta-text">${card.name}<br>${card.city}, ${card.country}</div>
                <img class="carta-photo" src="../images/mr%20kitty.jpg" alt="user photo">
                <button class="cartas-delete-button" onclick="onDeleteCarta('${card.id}')">Delete</button>
            </div>
        `;

            $cardsContainer.append(cartaHTML);
        });
    }

    $cardsContainer.sortable({
        update: function (event, ui) {
            updateOrder();
        }
    });

    $cardsContainer.disableSelection();
}

function updateOrder() {
    const newOrder = [];
    let myCards = getMyCards();

    // get cards' new order
    $("#UsersSentCards .carta").each(function () {
        const cardId = $(this).data("id");
        const card = myCards.find(c => c.id === cardId);
        if (card) {
            newOrder.push(card);
        }
    });

    updateMyCards(newOrder);
}

function closeLasCartasPopUp() {
    $("#LasCartas").fadeOut();
    $("body").css("overflow", "");
    document.body.style.overflow = "";
}

function onDeleteCarta(cardId) {
    if (!confirm("Delete card?")) {
        return;
    }

    deleteCard(cardId)

    if (getMyCards().length === 0) {
        $("#LasCartasNoCartas").toggleClass("hidden")
    }
}

function deleteCard(cardId) {
    $(`#carta-${cardId}`).remove();
    removeCardByIdEverywhere(cardId)
}

$("#NewCardForm").submit(function () {
    let user = getMyInfo();
    if (!user || !user.loginStatus) {
        alert("User must be logged in!");
        return false;
    }

    let formEmail = $("#emailNewCard").val();
    if (user.email !== formEmail) {
        alert("The email does not match your email")
        return false;
    }

    const newCard = new Card(
        getGlobalUniqueCardId(),
        $("#nameNewCard").val(),
        formEmail,
        $("#city").val(),
        $("#countryNewCard").val(),
        $("#cartaNewCard").val()
    );

    saveNewCard(user, newCard);

    $("#NewCardForm")[0].reset();
    alert("New card was successfully added!")

    return false;
});

document.getElementById("children").addEventListener("input", getChildrenInfo);

function getChildrenInfo() {
    let numOfChildren = document.getElementById("children").value;
    $('#childrenInfo').empty();

    if (numOfChildren >= 0) {
        for (let i = 0; i < numOfChildren; i++) {
            $('#childrenInfo').append(`
                <p id="child-${i + 1}" style="margin-left: 50%;">Hijo ${i + 1}</p>
                <label for="child-${i + 1}-name">Nombre</label>
                <input type="text" placeholder="Enter child's name" id="child-${i + 1}-name" name="child-${i + 1}-name" minlength="3">
                
                <label for="child-${i + 1}-age">Edad</label>
                <input type="number" placeholder="Enter child's age" id="child-${i + 1}-age" name="child-${i + 1}-age">
                 
                <label for="child-${i + 1}-toys">Juguetes favoritos</label>
                <input type="text" placeholder="Enter child's favourite toys/games" id="child-${i + 1}-toys" name="child-${i + 1}-toys">
        `);
        }
    }
}