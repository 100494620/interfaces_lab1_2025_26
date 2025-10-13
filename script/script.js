const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=(.*\d){2})(?=.*?[#?!.,:;@$%^&*-]).{12}$/;


function onRegistration() {
    console.log("Entered the saving data...")
    let user = readUserRegistrationData()

    /*if (!PASSWORD_REGEX.test(user.password)) {
        alert("Password is not following the correct structure!");
        document.getElementById("passwordR").value = '';
        document.getElementById("passwordRR").value = '';
        return false;
    }*/

    //console.log("Checked passwords...")
    const emailConfirm = document.getElementById("confirmEmailR").value;
    if (user.email !== emailConfirm) {
        alert("Emails don't match");
        document.getElementById("emailR").value = '';
        return false;
    }

    if (!registerUser(user)) {
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

