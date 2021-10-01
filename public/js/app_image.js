const authorization = 'eyJhbGciOiJIUzI1NiJ9.NjE0YjJlMjA5MzJjYmQ1NmM5NjFmNTM3.QKNTSH_80w_nNT_UBtk9AaNFIG6ca0FgkKqLXSQk27A';

// Создание картинки

const $createImageForm = document.querySelector("#create-image");

$createImageForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const form = { url: this.elements.url.value };

    fetchParams('/api/v1/image/', 'POST', form)
        .then(response => {
            return sendError(response, "#createimage")
        })
        .then((data) => {
            const imageDiv = document.querySelector("#createimage");
            const image = data;
            const tag = document.createElement('p');
            tag.innerHTML = `url: ${image.url} <br> id:${image['_id']} <hr>`;
            imageDiv.append(tag);
        });
});


// Вывод всех картинок


const $allImagesForm = document.querySelector("#get-images");

$allImagesForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    fetchGet('/api/v1/images')
        .then(response => {
            return sendError(response, "#allimages")
        })
        .then((data) => {
            for (item in data) {
                const imageDiv = document.querySelector("#allimages");
                const image = data[item];
                const tag = document.createElement('p');
                tag.innerHTML = `url: ${image.url} <br> id:${image['_id']} <hr>`;
                imageDiv.append(tag);
            };
        });
});


// Вывод одной картинки


const $imageForm = document.querySelector("#get-image");

$imageForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const imageId = (this.elements['image_id'].value) ? this.elements['image_id'].value : "0"
    fetchGet('/api/v1/image/', imageId)
        .then(response => {
            return sendError(response, "#getimage")
        })
        .then((data) => {
            for (item in data) {
                const imageDiv = document.querySelector("#getimage");
                const image = data[item];
                const tag = document.createElement('p');
                tag.innerHTML = `url: ${image.url} <br> id:${image['_id']} <hr>`;
                imageDiv.append(tag);
            }
        });
});

// Обновлние картинки

const $imagePutForm = document.querySelector("#put-image");

$imagePutForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = {
        id: this.elements['image_id'].value,
        url: this.elements.url.value,
    };
    fetchParams('/api/v1/image/', 'PUT', form)

        .then(response => {
            return sendError(response, "#putimage")
        })
        .then((data) => {
            const imageDiv = document.querySelector("#putimage");
            const image = data[0];
            const tag = document.createElement('p');
            tag.innerHTML = `url: ${image.url} <br> id:${image['_id']} <hr>`;
            imageDiv.append(tag);

        });
});

// Удаление картинки

const $imageDelForm = document.querySelector("#del-image");

$imageDelForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = {
        id: this.elements['image_id'].value,
    };

    fetchParams('/api/v1/image/', 'DELETE', form)
        .then(response => {
            return sendError(response, "#delimage")
        })
        .then((data) => {
            const imageDiv = document.querySelector("#delimage");
            const image = data;
            const tag = document.createElement('p');
            tag.innerHTML = `${image}`;
            imageDiv.append(tag);
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
            const imageDiv = document.querySelector(div);
            const tag = document.createElement('p');
            tag.innerHTML = `${err}`;
            imageDiv.append(tag);
            throw err
        })
    }
    return response.json()
};