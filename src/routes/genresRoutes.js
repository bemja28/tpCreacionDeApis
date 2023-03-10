const express = require('express');
const router = express.Router();
const {list, detail} = require('../controllers/genresController');

router
    .get('/genres', list)
    .get('/genres/detail/:id', detail)


module.exports = router;