const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!.,:;@$%^&*-]).{8,}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9.]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;


function onRegistration() {
    console.log("Entered the saving data...")
    let user = readUserRegistrationData()

    if ($("#nameR").val().length < 3) {
        alert("Name should be at least 3 characters");
        return false;
    }

    const splits = $("#surnameR").val().trim().split(/\s+/);
    if (splits.length >= 2) {
        for (let split of splits) {
            if (split.length < 3) {
                alert("Each surname should be at least 3 characters!");
                return false;
            }
        }
    } else {
        alert("Surname should be composed at least out of two entries!");
        return false;
    }

    if (!EMAIL_REGEX.test(user.email)) {
        alert("Email is not following the correct structure!");
        document.getElementById("emailR").value = '';
        return false;
    }

    //console.log("Checked passwords...")
    const emailConfirm = document.getElementById("confirmEmailR").value;
    if (user.email !== emailConfirm) {
        alert("Emails don't match");
        document.getElementById("confirmEmailR").value = '';
        return false;
    }

    const birthday = new Date($("#birthdayR").val());
    const today = new Date();
    let curr_age = (today - birthday) / (1000 * 60 * 60 * 24 * 365.25);
    if (curr_age < 16) {
        alert("You should be at least 16 years old!");
        return false;
    }

    if ($("#loginR").val().length < 5) {
        alert("Login should be at least 5 characters");
        return false;
    }

    if (!PASSWORD_REGEX.test(user.password)) {
        alert("Password is not following the correct structure!");
        document.getElementById("passwordR").value = '';
        return false;
    }

    if (!registerUser(user)) {
        document.getElementById("loginR").value = '';
        document.getElementById("passwordR").value = '';
        return false;
    }




    confirmStored();
    const registeredUsers = getRegisteredUsers();
    loadUsersState(user, registeredUsers)
    isLoggedInWithParams(user);
    window.location.href = "versionB.html";
    return false;
}

function readUserRegistrationData() {
    return new User(
        document.getElementById("nameR").value,
        document.getElementById("surnameR").value,
        document.getElementById("passwordR").value,
        document.getElementById("emailR").value,
        document.getElementById("loginR").value,
        document.getElementById("birthdayR").value,
        document.getElementById("fileR").value,
        false
    );
}

function confirmStored() {
    alert("Your data was stored correctly!")
}

function registerUser(user) {
    // save user's information
    let registeredUsers = getRegisteredUsers();

    if (registeredUsers.has(user.login_name)) {
        alert("User already exists");
        return false;
    }
    registeredUsers.set(user.login_name, user);
    saveRegisteredUsersToStorage(registeredUsers);
    return true;
}

//localStorage.clear();

$("#LoginForm").submit(onLoginUser)

function onLoginUser() {
    let enteredUsuario = document.getElementById("usuarioLogin").value;
    let enteredPassword = document.getElementById("passwordLogin").value;

    const registeredUsers = getRegisteredUsers();

    if (!registeredUsers.has(enteredUsuario)) {
        alert("You are not registered!");
        document.getElementById("usuarioLogin").value = "";
        document.getElementById("passwordLogin").value = "";
        return false;
    }

    let user = registeredUsers.get(enteredUsuario);
    if (user.password !== enteredPassword) {
        alert("Wrong password!");
        document.getElementById("passwordLogin").value = "";
        return false;
    }

    loadUsersState(user, registeredUsers)

    isLoggedInWithParams(user);
    window.location.href = "versionB.html";
    return false;
}

function loadUsersState(user, registeredUsers) {
    user.loginStatus = true;
    registeredUsers.set(user.login_name, user);
    saveRegisteredUsersToStorage(registeredUsers);

    localStorage.setItem(EMAIL_LS_DATA, user.login_name);
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
    window.location.href='home.html'
}

function removeUsersState(user, registeredUsers) {
    user.loginStatus = false;
    registeredUsers.set(user.login_name, user);
    saveRegisteredUsersToStorage(registeredUsers)

    localStorage.removeItem(EMAIL_LS_DATA);
}

