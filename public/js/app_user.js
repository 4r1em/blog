const $allUsersForm = document.querySelector("#get-users");

// Вывод всех юзеров

$allUsersForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    fetchGet('/api/v1/users')
        .then(response => {
            return sendError(response, "#getusers")
        })
        .then((data) => {
            for (item in data) {
                const div = document.querySelector("#getusers");
                const users = data[item]
                const tag = document.createElement('p');
                tag.innerHTML = `name: ${users.name} <br> id: ${users['_id']} <br> email: ${users.email}  <hr>`;
                div.append(tag);
            };
        })
});

// Вывод одного юзера по ID

const $userForm = document.querySelector("#get-user");

$userForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const userId = (this.elements['user_id'].value) ? this.elements['user_id'].value : "0"
    fetchGet('/api/v1/user/', userId)
        .then(response => {
            return sendError(response, "#getuser")
        })
        .then((data) => {
            const div = document.querySelector("#getuser");
            const user = data[0]
            const tag = document.createElement('p');
            tag.innerHTML = `name: ${user.name} <br> id: ${user['_id']} <br> email: ${user.email}  <hr>`;
            div.append(tag);
        });
});

// Измененине юзера

const $updateUserForm = document.querySelector("#put-user");

$updateUserForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = {
        id: this.elements.id.value,
        email: this.elements.email.value,
        password: this.elements.password.value,
        name: this.elements.name.value,
        role: this.elements.role.value

    };


    fetchParams('/api/v1/user', 'PUT', form)
        .then(response => {
            return sendError(response, "#putuser")
        })
        .then((data) => {
            const div = document.querySelector("#putuser");
            const user = data[0]
            const tag = document.createElement('p');
            tag.innerHTML = `name: ${user.name} <br> id: ${user['_id']} <br> email: ${user.email}  <hr>`;
            div.append(tag);
        })
});

// Удаление юзера

const $deleteUserForm = document.querySelector("#delete-user");

$deleteUserForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const form = {
        id: this.elements.id.value
    };

    fetchParams('/api/v1/user', 'DELETE', form)
        .then(response => {
            return sendError(response, "#deleteuser")
        })
        .then((data) => {
            const userDiv = document.querySelector("#deleteuser");
            const user = data;
            const tag = document.createElement('p');
            tag.innerHTML = `${user}`;
            userDiv.append(tag);
        })
});

// Подписка на другого юзера

const $submitUserForm = document.querySelector("#follower-user");

$submitUserForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const form = {
        id: this.elements.id.value
    };
    fetchParams('/api/v1/user/submit', 'PUT', form)
        .then(response => {
            return sendError(response, "#followeruser")
        })
        .then((data) => {
            for (item of data[0].follower) {
                const userDiv = document.querySelector("#followeruser");
                const tag = document.createElement('p');
                tag.innerHTML = `Follower: ${item} <br>`;
                userDiv.append(tag);
            }

        })
});

async function fetchParams(url, method, params = {}) {
    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })
    return response
}

async function fetchGet(url, params = '') {
    const response = await fetch(url + params, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    return response
}

function sendError(response, div) {
    if (!response.ok) {
        return response.json().then((err) => {
            const articlesDiv = document.querySelector(div);
            const tag = document.createElement('p');
            tag.innerHTML = `${err}`;
            articlesDiv.append(tag);
            throw err
        })
    }
    return response.json()
}
