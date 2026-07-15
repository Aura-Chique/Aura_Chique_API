const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Cria uma rota POST em "/cadastrar"
router.post('/cadastrar', usuarioController.cadastrar);

module.exports = router;