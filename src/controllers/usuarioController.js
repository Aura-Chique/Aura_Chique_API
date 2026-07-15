const usuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcrypt'); // biblioteca para criptografar a senha do usuário

async function cadastrar(req, res) {
    // Pega os dados enviados pelo corpo da requisição (JSON)
    const { nome, email, senha } = req.body;

    // Validação simples
    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Preencha todos os campos!' });
    }

    try {
        // Criptografando a senha com o bcrypt
        const salt = await bcrypt.genSalt(10); // Gera uma sequencia aleatória de caracteres para misturar com a senha
        const senhaCriptografada = await bcrypt.hash(senha, salt); // Criptografa a senha misturando com o salt

        // Manda para o Model salvar no banco
        const resultado = await usuarioModel.cadastrar(nome, email, senhaCriptografada);
        
        res.status(201).json({ 
            mensagem: 'Usuário cadastrado com sucesso!', 
            idUsuario: resultado.insertId 
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro interno ao cadastrar usuário.' });
    }
}

module.exports = {
    cadastrar
};