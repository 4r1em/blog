const authorization = 'eyJhbGciOiJIUzI1NiJ9.NjE0YjJkOGI5MzJjYmQ1NmM5NjFmNTI4.jHAXsdKM9C46kYz1hzfgOCrOwJck2Z4GIhm9oNVo3uY';

// Создание записи

const $createArticlesForm = document.querySelector("#create-articles");

$createArticlesForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = {
        description: this.elements.description.value,
        category_id: this.elements['category_id'].value,
        image_id: this.elements['image_id'].value
    };
    fetchParams('/api/v1/article', 'POST', form)
        .then(response => {
            return sendError(response, "#createarticles")
        })
        .then((data) => {
            const articlesDiv = document.querySelector("#createarticles");
            const article = data;
            const tag = document.createElement('p');
            tag.innerHTML = `author_id: ${article.author_id} <br> description: ${article.description} <hr>`;
            articlesDiv.append(tag);
        });
});

// Вывод всех записей

const $allArticlesForm = document.querySelector("#get-articles");

$allArticlesForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    fetchGet('/api/v1/articles')
        .then(response => {
            return sendError(response, "#allarticles")
        })
        .then((data) => {
            for (item in data) {
                const articlesDiv = document.querySelector("#allarticles");
                const article = data[item];
                const tag = document.createElement('p');
                tag.innerHTML = `author_id: ${article.author_id} <br> description: ${article.description} <hr>`;
                articlesDiv.append(tag);
            };
        })
});

// Вывод всех своих записей

const $articlesForm = document.querySelector("#get-article");

$articlesForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    fetchGet('/api/v1/articles')
        .then(response => {
            return sendError(response, "#articles")
        })
        .then((data) => {
            for (item in data) {
                const articlesDiv = document.querySelector("#articles");
                const article = data[item];
                const tag = document.createElement('p');
                tag.innerHTML = `author_id: ${article.author_id} <br> description: ${article.description} <hr>`;
                articlesDiv.append(tag);
            };
        })
});

// Вывод всех записей по категориям

const $articlesCategoryForm = document.querySelector("#get-articlesforcategory");

$articlesCategoryForm.addEventListener('submit', async function (e) {

    e.preventDefault();
    const categoryId = (this.elements['category_id'].value) ? this.elements['category_id'].value : "0"

    fetchGet('/api/v1/article/category/', categoryId)

        .then(response => {
            return sendError(response, "#articlesforcategory")
        })
        .then((data) => {
            for (item in data) {
                const articlesDiv = document.querySelector("#articlesforcategory");
                const article = data[item];
                const tag = document.createElement('p');
                tag.innerHTML = `author_id: ${article.author_id} <br> description: ${article.description} <hr>`;
                articlesDiv.append(tag);
            }
        })
});

// Вывод всех записей по подпискам и cвоих


const $articlesFollowerForm = document.querySelector("#get-articlefollower");

$articlesFollowerForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    fetchGet('/api/v1/article/submit')
        .then(response => {
            return sendError(response, "#articlefollower")
        })
        .then((data) => {
            for (item in data) {
                const articlesDiv = document.querySelector("#articlefollower");
                const article = data[item];
                const tag = document.createElement('p');
                tag.innerHTML = `author_id: ${article.author_id} <br> description: ${article.description} <hr>`;
                articlesDiv.append(tag);
            };
        })
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

    fetchParams('/api/v1/article', 'PUT', form)
        .then(response => {
            return sendError(response, "#updatearticles")
        })
        .then((data) => {
            const articlesDiv = document.querySelector("#updatearticles");
            const article = data[0];
            const tag = document.createElement('p');
            tag.innerHTML = `author_id: ${article.author_id} <br> description: ${article.description} <hr>`;
            articlesDiv.append(tag);
        })
});

// Удаление записи

const $deleteArticlesForm = document.querySelector("#delete-articles");

$deleteArticlesForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const form = {
        id: this.elements.id.value
    };

    fetchParams('/api/v1/article', 'DELETE', form)
        .then(response => {
            return sendError(response, "#deletearticles")
        })
        .then((data) => {
            const articlesDiv = document.querySelector("#deletearticles");
            const article = data;
            const tag = document.createElement('p');
            tag.innerHTML = `${article}`;
            articlesDiv.append(tag);
        })
});


async function fetchParams(url, method, params = {}) {
    const response = await fetch(url, {
        method: method,
        headers: {
            authorization,
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
            authorization,
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
