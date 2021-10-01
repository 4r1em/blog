const authorization = 'eyJhbGciOiJIUzI1NiJ9.NjE0YjJlMjA5MzJjYmQ1NmM5NjFmNTM3.QKNTSH_80w_nNT_UBtk9AaNFIG6ca0FgkKqLXSQk27A';

// Создание категории

const $createCategoryForm = document.querySelector("#create-category");

$createCategoryForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const form = { name: this.elements.name.value };

    fetchParams('/api/v1/category/', 'POST', form)
        .then(response => {
            return sendError(response, "#createcategory")
        })
        .then((data) => {
            const categoryDiv = document.querySelector("#createcategory");
            const category = data;
            const tag = document.createElement('p');
            tag.innerHTML = `url: ${category.name} <br> id:${category['_id']} <hr>`;
            categoryDiv.append(tag);
        });
});

// Вывод всех категорий

const $allCategoriesForm = document.querySelector("#get-categories");

$allCategoriesForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    fetchGet('/api/v1/categories')
        .then(response => {
            return sendError(response, "#allcategories")
        })
        .then((data) => {
            for (item in data) {
                const categoryDiv = document.querySelector("#allcategories");
                const category = data[item];
                const tag = document.createElement('p');
                tag.innerHTML = `url: ${category.name} <br> id:${category['_id']} <hr>`;
                categoryDiv.append(tag);
            };
        });
});

// Вывод одной категории

const $categoryForm = document.querySelector("#get-category");

$categoryForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const categoryId = (this.elements['category_id'].value) ? this.elements['category_id'].value : "0"
    console.log(categoryId)
    fetchGet('/api/v1/category/', categoryId)
        .then(response => {
            return sendError(response, "#getcategory")
        })
        .then((data) => {
            for (item in data) {
                const categoryDiv = document.querySelector("#getcategory");
                const category = data[item];
                const tag = document.createElement('p');
                tag.innerHTML = `url: ${category.name} <br> id:${category['_id']} <hr>`;
                categoryDiv.append(tag);
            }
        });
});

// Обновление категории

const $categoryPutForm = document.querySelector("#put-category");

$categoryPutForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = {
        id: this.elements['category_id'].value,
        name: this.elements.name.value,
    };
    console.log(form)
    fetchParams('/api/v1/category/', 'PUT', form)

        .then(response => {
            return sendError(response, "#putcategory")
        })
        .then((data) => {
            const categoryDiv = document.querySelector("#putcategory");
            const category = data[0];
            const tag = document.createElement('p');
            tag.innerHTML = `url: ${category.name} <br> id:${category['_id']} <hr>`;
            categoryDiv.append(tag);

        });
});

// Удаление категории

const $categoryDelForm = document.querySelector("#del-category");

$categoryDelForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = {
        id: this.elements['category_id'].value,
    };

    fetchParams('/api/v1/category/', 'DELETE', form)
        .then(response => {
            return sendError(response, "#delcategory")
        })
        .then((data) => {
            const categoryDiv = document.querySelector("#delcategory");
            const category = data;
            const tag = document.createElement('p');
            tag.innerHTML = `${category}`;
            categoryDiv.append(tag);
        });
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
};

async function fetchGet(url, params = '') {
    const response = await fetch(url + params, {
        method: 'GET',
        headers: {
            authorization,
            'Content-Type': 'application/json'
        },
    })
    return response
};

function sendError(response, div) {
    if (!response.ok) {
        return response.json().then((err) => {
            const categoryDiv = document.querySelector(div);
            const tag = document.createElement('p');
            tag.innerHTML = `${err}`;
            categoryDiv.append(tag);
            throw err
        })
    }
    return response.json()
};