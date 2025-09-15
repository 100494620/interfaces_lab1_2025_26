function init() {
    if (localStorage.length === 0) {
        initBasicUsersIfNotExists();
        initCardsForUsers();
    }

    window.onload = function () {
        isLoggedIn();
    };
}

function initBasicUsersIfNotExists() {
    let users = getRegisteredUsers();
    // users.clear();

    let initUsers = [
        new User(
            'Anastasiia Sadova',
            'password',
            'anastasiia.sadova@gmail.com',
            'Kyiv',
            'Ukraine',
            'femenino',
            2,
            [
                new Child('Fifi', 12, 'mickey mouse'),
                new Child('Foofoo', 18, 'sport car'),
            ],
            false,
        ),
        new User(
            'Sergio Cernuda Cueto',
            'password',
            'sergio.cernuda@gmail.com',
            'Madrid',
            'Spain',
            'masculino',
            0,
            [],
            false,
        ),
        new User(
            'Sofiia Dashevska',
            'password',
            'sofiia.dashevska@gmail.com',
            'Kyiv',
            'Ukraine',
            'femenino',
            1,
            [
                new Child('Popo', 11, 'candles'),
            ],
            false,
        )
    ];

    initUsers.forEach(
        (u) => {
            if (!users.has(u.email)) {
                users.set(u.email, u);
            }
        }
    )

    saveRegisteredUsersToStorage(users)
}

function initCardsForUsers() {
    let usersCards = getUsersCards();
    // cards.clear();

    let initCards = new Map()
    initCards.set('anastasiia.sadova@gmail.com',
        [
            new Card(
                getGlobalUniqueCardId(),
                'Anastasiia Sadova',
                'anastasiia.sadova@gmail.com',
                'Kyiv',
                'Ukraine',
                'Hi, my name is Anastasiia Sadova! I am from Kyiv, Ukraine! Happy New Year!'
            ),
            new Card(
                getGlobalUniqueCardId(),
                'Sergio Cernuda Cueto',
                'sergio.cernuda@gmail.com',
                'Madrid',
                'Spain',
                'Hello! I am Sergio from Madrid. I love to explore the world!'
            ),
            new Card(
                getGlobalUniqueCardId(),
                'Nazar Grynko',
                'nazar.grynko@gmail.com',
                'Kyiv',
                'Ukraine',
                'Hey! I am Nazar, a tech enthusiast from Kyiv.'
            ),
            new Card(
                getGlobalUniqueCardId(),
                'Alejandro Sanchez Vega',
                'alejandro.sanchez@gmail.com',
                'Madrid',
                'Spain',
                'Hello! I am Alejandro from Madrid. Let\'s connect!'
            ),
            new Card(
                getGlobalUniqueCardId(),
                'Ines Guillen',
                'ines.guillen@gmail.com',
                'Madrid',
                'Spain',
                'Hi there! I am Ines, a traveler from Madrid!'
            )
        ]
    );

    initCards.set('sofiia.dashevska@gmail.com',
        [
            new Card(
                getGlobalUniqueCardId(),
                'Sofiia Dashevska',
                'sofiia.dashevska@gmail.com',
                'Prague',
                'Czech Republic',
                'Hi! I am Sofiia from Prague. Nice to meet you!'
            ),
        ]
    );

    initCards.forEach(
        (cards, user) => {
            if (!usersCards.has(user)) {
                usersCards.set(user, cards);
            }
        }
    );

    getRegisteredUsers().forEach(
        (cards, user) => {
            if (!usersCards.has(user)) {
                usersCards.set(user, cards);
            }
        }
    )

    console.log(usersCards)

    saveUsersCardsToStorage(usersCards);
}

//init()