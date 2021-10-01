// Вход юзера

const $singUsersForm = document.querySelector("#sing-user");

$singUsersForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = {
        email: this.elements.email.value,
        password: this.elements.password.value
    };

    await fetch('/api/v1/user/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then((err) => {
                    const div = document.querySelector("#singuser");
                    const tag = document.createElement('p');
                    tag.innerHTML = `${err}`;
                    div.append(tag);
                    throw err
                })
            }
            return response.json()
        })
        .then((data) => {
            const div = document.querySelector("#singuser");
            const user = data;
            const tag = document.createElement('p');
            tag.innerHTML = `User ID: ${user.id} <br> Token: ${user.token}`;
            div.append(tag);
        });
});
