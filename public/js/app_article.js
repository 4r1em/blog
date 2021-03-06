const urlV = '/api/v1'

// Создание записи

const $createArticlesForm = document.querySelector("#create-articles");

$createArticlesForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = {
        description: this.elements.description.value,
        category_id: this.elements['category_id'].value,
        image_id: this.elements['image_id'].value
    };

    fetchParams(urlV + '/article', 'POST', form)
        .then(response => {
            return sendError(response, "#createarticles")
        })
        .then((data) => {
            const articlesDiv = document.querySelector("#createarticles");
            const article = data;
            const tag = document.createElement('p');
            const img = document.createElement("img");
            img.src = article.url_img;
            tag.innerHTML = `author_id: ${article.author_id} <br> description: ${article.description} <br>
                category: ${article.name_category} <hr>`;
            articlesDiv.append(tag);
            articlesDiv.append(img);
        });
});

// Вывод всех записей

const $allArticlesForm = document.querySelector("#get-articles");

$allArticlesForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    fetchGet(urlV + '/articles')
        .then(response => {
            return sendError(response, "#allarticles")
        })
        .then((data) => {
            for (item in data) {
                const articlesDiv = document.querySelector("#allarticles");
                const article = data[item];
                const tag = document.createElement('p');
                const img = document.createElement("img");
                img.src = article.url_img;
                tag.innerHTML = `author_id: ${article.author_id} <br> description: ${article.description} <br>
                category: ${article.name_category} <hr>`;
                articlesDiv.append(tag);
                articlesDiv.append(img);
            };
        })
});

// Вывод всех своих записей

const $articlesForm = document.querySelector("#get-article");

$articlesForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    fetchGet(urlV + '/article')
        .then(response => {
            return sendError(response, "#articles")
        })
        .then((data) => {
            for (item in data) {
                const articlesDiv = document.querySelector("#articles");
                const article = data[item];
                const tag = document.createElement('p');
                const img = document.createElement("img");
                img.src = article.url_img;
                tag.innerHTML = `author_id: ${article.author_id} <br> description: ${article.description} <br>
                category: ${article.name_category} <hr>`;
                articlesDiv.append(tag);
                articlesDiv.append(img);
            };
        })
});

// Вывод всех записей по категориям

const $articlesCategoryForm = document.querySelector("#get-articlesforcategory");

$articlesCategoryForm.addEventListener('submit', async function (e) {

    e.preventDefault();
    const categoryId = (this.elements['category_id'].value) ? this.elements['category_id'].value : "0"

    fetchGet(urlV + '/article/category/', categoryId)

        .then(response => {
            return sendError(response, "#articlesforcategory")
        })
        .then((data) => {
            for (item in data) {
                const articlesDiv = document.querySelector("#articlesforcategory");
                const article = data[item];
                const tag = document.createElement('p');
                const img = document.createElement("img");
                img.src = article.url_img;
                tag.innerHTML = `author_id: ${article.author_id} <br> description: ${article.description} <br>
                category: ${article.name_category} <hr>`;
                articlesDiv.append(tag);
                articlesDiv.append(img);
            }
        })
});

// Вывод всех записей по подпискам и cвоих


const $articlesFollowerForm = document.querySelector("#get-articlefollower");

$articlesFollowerForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    fetchGet(urlV + '/article/submit')
        .then(response => {
            return sendError(response, "#articlefollower")
        })
        .then((data) => {
            for (item in data) {
                const articlesDiv = document.querySelector("#articlefollower");
                const article = data[item];
                const tag = document.createElement('p');
                const img = document.createElement("img");
                img.src = article.url_img;
                tag.innerHTML = `author_id: ${article.author_id} <br> description: ${article.description} <br>
                category: ${article.name_category} <hr>`;
                articlesDiv.append(tag);
                articlesDiv.append(img);
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

    fetchParams(urlV + '/article', 'PUT', form)
        .then(response => {
            return sendError(response, "#updatearticles")
        })
        .then((data) => {
            const articlesDiv = document.querySelector("#updatearticles");
            const article = data[0];
            const tag = document.createElement('p');
            const img = document.createElement("img");
            img.src = article.url_img;
            tag.innerHTML = `author_id: ${article.author_id} <br> description: ${article.description} <br>
                category: ${article.name_category} <hr>`;
            articlesDiv.append(tag);
            articlesDiv.append(img);
        })
});

// Удаление записи

const $deleteArticlesForm = document.querySelector("#delete-articles");

$deleteArticlesForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const form = {
        id: this.elements.id.value
    };

    fetchParams(urlV + '/article', 'DELETE', form)
        .then(response => {
            return sendError(response, "#deletearticles", "text")
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

function sendError(response, div, type = 'json') {
    if (!response.ok) {
        return response.text().then((err) => {
            const articlesDiv = document.querySelector(div);
            const tag = document.createElement('p');
            tag.innerHTML = err;
            articlesDiv.append(tag);
            throw err
        })
    }
    if (type === 'json') return response.json()
    return response.text()
}
