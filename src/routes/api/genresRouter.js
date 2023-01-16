const express = require('express');
const router = express.Router();
const {list, detail} = require('../../controllers/api/genresController');

router
    .get('/genres', list)
    .get('/detail/:id', detail)


module.exports = router;