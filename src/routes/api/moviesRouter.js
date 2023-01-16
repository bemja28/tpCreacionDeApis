const express = require('express');
const router = express.Router();
const {list,detail,create,destroy, update} = require('../../controllers/api/moviesController');

router
.get('/', list)
.get('/detail/:id', detail)
//Rutas exigidas para la creación del CRUD
.patch('/update/:id', update)
.post('/create', create)
.delete('/delete/:id', destroy)

module.exports = router;