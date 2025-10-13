const REGISTERED_USERS_LS_DATA = "registeredUsers";
const EMAIL_LS_DATA = "username";

function getRegisteredUsers() {
    let registeredUsersString = localStorage.getItem(REGISTERED_USERS_LS_DATA);
    return !registeredUsersString ? new Map() : new Map(JSON.parse(registeredUsersString));
}

function saveRegisteredUsersToStorage(registeredUsers) {
    const usersString = JSON.stringify(Array.from(registeredUsers));
    localStorage.setItem(REGISTERED_USERS_LS_DATA, usersString);
}

function saveUser(user) {
    let users = getRegisteredUsers();
    users.set(user.email, user);
    saveRegisteredUsersToStorage(users);
}

function getMyInfo() {
    let email = localStorage.getItem(EMAIL_LS_DATA);
    return !email ? null : getRegisteredUsers().get(email)
}
