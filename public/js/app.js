const authorization = 'eyJhbGciOiJIUzI1NiJ9.NjE0YjJlMjA5MzJjYmQ1NmM5NjFmNTM3.QKNTSH_80w_nNT_UBtk9AaNFIG6ca0FgkKqLXSQk27A';

// Создание записи

const $createArticlesForm = document.querySelector("#create-articles");

$createArticlesForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = {
        description: this.elements.description.value,
        category_id: this.elements['category_id'].value,
        image_id: this.elements['image_id'].value
    };

    await fetch('/api/v1/article', {
        method: 'POST',
        headers: {
            authorization,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
    })
        .then(response => response.json())
        .then((data) => {
            const articlesDiv = document.querySelector("#createarticles");
            const article = data;
            const tag = document.createElement('p');
            tag.innerHTML = `author_id: ${article.author_id} <br> description: ${article.description} <hr>`;
            articlesDiv.append(tag);
        })
        .catch((err) => {
            console.log(err.massage)
            const articlesDiv = document.querySelector("#createarticles");
            const tag = document.createElement('p');
            tag.innerHTML = `ERROR`;
            articlesDiv.append(tag);
        });
});

// Вывод всех записей

const $allArticlesForm = document.querySelector("#get-articles");

$allArticlesForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    await fetch('/api/v1/articles', {
        method: 'GET',
        headers: {
            authorization,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then((data) => {
            for (item in data) {
                const articlesDiv = document.querySelector("#allarticles");
                const article = data[item];
                const tag = document.createElement('p');
                tag.innerHTML = `author_id: ${article.author_id} <br> description: ${article.description} <hr>`;
                articlesDiv.append(tag);
            };
        }).catch((err) => {
            console.log(err.massage)
            const articlesDiv = document.querySelector("#allarticles");
            const tag = document.createElement('p');
            tag.innerHTML = `ERROR`;
            articlesDiv.append(tag);
        });
});

// Вывод всех своих записей

const $articlesForm = document.querySelector("#get-article");

$articlesForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    await fetch('/api/v1/article', {
        method: 'GET',
        headers: {
            authorization,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then((data) => {
            for (item in data) {
                const articlesDiv = document.querySelector("#articles");
                const article = data[item];
                const tag = document.createElement('p');
                tag.innerHTML = `author_id: ${article.author_id} <br> description: ${article.description} <hr>`;
                articlesDiv.append(tag);
            };
        }).catch((err) => {
            console.log(err.massage)
            const articlesDiv = document.querySelector("#articles");
            const tag = document.createElement('p');
            tag.innerHTML = `ERROR`;
            articlesDiv.append(tag);
        });
});


// Вывод всех записей по категориям

const $articlesCategoryForm = document.querySelector("#get-articlesforcategory");

$articlesCategoryForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const categoryId = this.elements['category_id'].value
    await fetch('/api/v1/article/category/' + categoryId, {
        method: 'GET',
        headers: {
            authorization,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then((data) => {
            for (item in data) {
                const articlesDiv = document.querySelector("#articlesforcategory");
                const article = data[item];
                const tag = document.createElement('p');
                tag.innerHTML = `author_id: ${article.author_id} <br> description: ${article.description} <hr>`;
                articlesDiv.append(tag);
            }
        }).catch((err) => {
            console.log(err.massage)
            const articlesDiv = document.querySelector("#articlesforcategory");
            const tag = document.createElement('p');
            tag.innerHTML = `ERROR`;
            articlesDiv.append(tag);
        });
});

// Вывод всех записей по подпискам и cвоих


const $articlesFollowerForm = document.querySelector("#get-articlefollower");

$articlesFollowerForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    await fetch('/api/v1/article/submit', {
        method: 'GET',
        headers: {
            authorization,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then((data) => {
            for (item in data) {
                const articlesDiv = document.querySelector("#articlefollower");
                const article = data[item];
                const tag = document.createElement('p');
                tag.innerHTML = `author_id: ${article.author_id} <br> description: ${article.description} <hr>`;
                articlesDiv.append(tag);
            };
        }).catch((err) => {
            console.log(err.massage)
            const articlesDiv = document.querySelector("#articlefollower");
            const tag = document.createElement('p');
            tag.innerHTML = `ERROR`;
            articlesDiv.append(tag);
        });
});

// Обновление записи


const $updateArticlesForm = document.querySelector("#update-articles");

$updateArticlesForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = {
        id: this.elements.id.value,
        description: this.elements.description.value,
        category_id: this.elements['category_id'].value,
        image_id: this.elements['image_id'].value
    };

    await fetch('/api/v1/article', {
        method: 'PUT',
        headers: {
            authorization,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
    })
        .then(response => response.json())
        .then((data) => {
            const articlesDiv = document.querySelector("#updatearticles");
            const article = data[0];
            const tag = document.createElement('p');
            tag.innerHTML = `author_id: ${article.author_id} <br> description: ${article.description} <hr>`;
            articlesDiv.append(tag);
        }).catch((err) => {
            console.log(err.massage)
            const articlesDiv = document.querySelector("#updatearticles");
            const tag = document.createElement('p');
            tag.innerHTML = `ERROR`;
            articlesDiv.append(tag);
        });
});

// Удаление записи


const $deleteArticlesForm = document.querySelector("#delete-articles");

$deleteArticlesForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = {
        id: this.elements.id.value
    };

    await fetch('/api/v1/article', {
        method: 'DELETE',
        headers: {
            authorization,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
    })
        .then(response => response.json())
        .then((data) => {
            const articlesDiv = document.querySelector("#deletearticles");
            const article = data;
            const tag = document.createElement('p');
            tag.innerHTML = `${article}`;
            articlesDiv.append(tag);
        }).catch((err) => {
            console.log(err.massage)
            const articlesDiv = document.querySelector("#deletearticles");
            const tag = document.createElement('p');
            tag.innerHTML = `ERROR`;
            articlesDiv.append(tag);
        });
});




