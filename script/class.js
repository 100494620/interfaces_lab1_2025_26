class User {
    constructor(username, password, email, city, country, gender, numOfChildren, children, loginStatus) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.city = city;
        this.country = country;
        this.gender = gender;
        this.numOfChildren = numOfChildren;
        this.children = children;
        this.loginStatus = loginStatus;
    }
}

class Child {
    constructor(nameOfChild, ageOfChild, toysOfChild) {
        this.nameOfChild = nameOfChild;
        this.ageOfChild = ageOfChild;
        this.toysOfChild = toysOfChild;
    }
}

class Card {
    constructor(id, name, email, city, country, message) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.city = city;
        this.country = country;
        this.message = message;
    }
}