const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

const { verificarToken } = require('../middlewares/authMiddleware');
// Rota protegida! O usuário precisa passar pelo "verificarToken" antes de chegar no controller
router.get('/my', verificarToken, usuarioController.meuPerfil);

router.put('/my', verificarToken, usuarioController.atualizarPerfil);

router.delete('/my', verificarToken, usuarioController.deletarPerfil);

// Cria uma rota POST em "/cadastrar"
router.post('/cadastrar', usuarioController.cadastrar);

router.post('/login', usuarioController.login);

module.exports = router;