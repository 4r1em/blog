const urlV = '/api/v1'


// Вход юзера

const $singUsersForm = document.querySelector("#sing-user");

$singUsersForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = {
        email: this.elements.email.value,
        password: this.elements.password.value
    };

    await fetch(urlV + '/user/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then((err) => {
                    const div = document.querySelector("#singuser");
                    const tag = document.createElement('p');
                    tag.innerHTML = err;
                    div.append(tag);
                    throw err
                })
            }
            return response.json()
        })
        .then((data) => {
            const div = document.querySelector("#singuser");
            const tag = document.createElement('p');
            tag.innerHTML = `You are logged in`;
            div.append(tag);
        });
});


