
const express = require('express');
const app = new express();
const conectDB = require('./mongo');
const port = process.env.PORT || 3000;
const dotenv = require('dotenv');
const path = require('path');
const hbs = require('hbs');

const userApiRoutes = require('./routes/api/user');
const articleApiRoutes = require('./routes/api/article');
const categoryApiRoutes = require('./routes/api/category');
const imageApiRoutes = require('./routes/api/image');

const articleWebRoutes = require('./routes/web/article');
const imageWebRoutes = require('./routes/web/image');
const homeWebRoutes = require('./routes/web/home');
const categoryWebRoutes = require('./routes/web/category');
const registerWebRoutes = require('./routes/web/register');
const cookieParser = require('cookie-parser')

dotenv.config();

app.use(cookieParser());

app.use(express.static(path.resolve(__dirname)));
app.set('view engine', 'hbs');
/**
 * Регистрация папки где лежат шаблоны
 */
app.set('views', path.join(__dirname, './public/view'));
/**
 * Регистрация папки, где будут лежать все публичные данные
 * Это для js скриптов на фронте, для шаблонов, картинок и css файлов
 */
app.use(express.static(path.resolve(__dirname, './public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


/**
 * Web routes
 */
app.use(homeWebRoutes);
app.use(imageWebRoutes);
app.use(articleWebRoutes);
app.use(categoryWebRoutes);
app.use(registerWebRoutes);
/**
 * API routes
 * Чтобы все апи роуты использовали по умолчанию префикс /api/v1
 * Например: localhost:3009/api/v1/article
 */
app.use('/api/v1', userApiRoutes);
app.use('/api/v1', imageApiRoutes);
app.use('/api/v1', categoryApiRoutes);
app.use('/api/v1', articleApiRoutes);


app.listen(port, () => {
    console.log("Server started")
});