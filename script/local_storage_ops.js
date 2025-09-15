const REGISTERED_USERS_LS_DATA = "registeredUsers";
const USERS_CARDS_LS_DATA = "usersCards";
const MY_CARDS_LS_DATA = "myCards";
const EMAIL_LS_DATA = "username";
const GLOBAL_CARD_ID_LS_DATA = "globalCardId";

function getRegisteredUsers() {
    let registeredUsersString = localStorage.getItem(REGISTERED_USERS_LS_DATA);
    return !registeredUsersString ? new Map() : new Map(JSON.parse(registeredUsersString));
}

function saveRegisteredUsersToStorage(registeredUsers) {
    const usersString = JSON.stringify(Array.from(registeredUsers));
    localStorage.setItem(REGISTERED_USERS_LS_DATA, usersString);
}

function getUsersCards() {
    let usersCardsString = localStorage.getItem(USERS_CARDS_LS_DATA);
    return !usersCardsString ? new Map() : new Map(JSON.parse(localStorage.getItem(USERS_CARDS_LS_DATA)));
}

function saveUsersCardsToStorage(usersCards) {
    const cardsString = JSON.stringify(Array.from(usersCards));
    localStorage.setItem(USERS_CARDS_LS_DATA, cardsString);
}

function saveUser(user) {
    let users = getRegisteredUsers();
    users.set(user.email, user);
    saveRegisteredUsersToStorage(users);
}

function getGlobalUniqueCardId() {
    let idStr = localStorage.getItem(GLOBAL_CARD_ID_LS_DATA);

    let id = !idStr ? 0 : parseInt(idStr);
    localStorage.setItem(GLOBAL_CARD_ID_LS_DATA, (id + 1).toString())

    return id + 1
}

function getMyCards() {
    let myCardsString = localStorage.getItem(MY_CARDS_LS_DATA);

    return !myCardsString ? [] : JSON.parse(myCardsString)
}

function saveMyCards(myCards) {
    const myCardsString = JSON.stringify(Array.from(myCards));
    localStorage.setItem(MY_CARDS_LS_DATA, myCardsString);
}

function updateMyCards(myCards) {
    saveMyCards(myCards)

    let allCards = getUsersCards();
    allCards.set(localStorage.getItem(EMAIL_LS_DATA), myCards);
    saveUsersCardsToStorage(allCards)
}

function removeCardByIdEverywhere(cardId) {
    let myCards = getMyCards();
    myCards = myCards.filter(card => card.id !== +cardId)

    updateMyCards(myCards)
}

function getMyInfo() {
    let email = localStorage.getItem(EMAIL_LS_DATA);
    return !email ? null : getRegisteredUsers().get(email)
}

function saveNewCard(user, card) {
    let myCards = getMyCards();
    myCards.push(card);
    saveMyCards(myCards)

    let usersCards = getUsersCards()
    usersCards.set(user.email, myCards)
    saveUsersCardsToStorage(usersCards)
}