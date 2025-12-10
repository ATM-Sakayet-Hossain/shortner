const express = require('express');
const route = express.Router();
const authRoute = require('./auth');
const shortUrlRoute = require('./shortUrl');
const { redirecUrl } = require('../controllers/shortUrlControllers');


route.get('/', (req, res) => {
    res.send('Server is running');
});
route.use('/auth', authRoute);
route.use('/shorturl', shortUrlRoute);

route.get('/:id', redirecUrl)

route.use((req, res) => {
    res.status(404).send('Route not found');
});

module.exports = route;