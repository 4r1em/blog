// Создание юзера

const $createUsersForm = document.querySelector("#create-user");

$createUsersForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = {
        name: this.elements.name.value,
        email: this.elements.email.value,
        password: this.elements.password.value
    };

    await fetch('/api/v1/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then((err) => {
                    const div = document.querySelector("#createuser");
                    const tag = document.createElement('p');
                    tag.innerHTML = `${err}`;
                    div.append(tag);
                    throw err
                })
            }
            return response.json()
        })
        .then((data) => {
            const div = document.querySelector("#createuser");
            const user = data;
            const tag = document.createElement('p');
            tag.innerHTML = `user: ${user.name} <br> id:${user['_id']} <br> email:${user.email}`;
            div.append(tag);
        });
});
