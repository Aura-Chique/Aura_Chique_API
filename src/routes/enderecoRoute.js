const express = require('express');
const router = express.Router();
const enderecoController = require('../controllers/enderecoController');

const { verificarToken } = require('../middlewares/authMiddleware');

// Rota protegida! O usuário precisa passar pelo "verificarToken" antes de chegar no controller
router.post('/my', verificarToken, enderecoController.cadastrarEndereco);

router.get('/my', verificarToken, enderecoController.listarEnderecos);

router.delete('/my/:idEndereco', verificarToken, enderecoController.deletarEndereco);

router.put('/my/:idEndereco', verificarToken, enderecoController.atualizarEndereco);

module.exports = router;