const usuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcrypt'); // biblioteca para criptografar a senha do usuário
const jwt = require('jsonwebtoken'); // biblioteca para gerar o token JWT

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

async function login(req, res) {
    // Pega os dados enviados pelo corpo da requisição
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: 'Preencha todos os campos!' });
    }

    try {
        // Manda para o Model verificar se o usuário existe
        const usuario = await usuarioModel.login(email);

        if (!usuario) {
            return res.status(401).json({ mensagem: 'Email ou senha inválidos!' });
        }

        // Compara a senha enviada com a senha criptografada no banco
        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

        if (!senhaValida) {
            return res.status(401).json({ mensagem: 'Email ou senha inválidos!' });
        }

        // Gera o token JWT
        const token = jwt.sign(
            // Payload: Dados não-sensíveis que vão ficar guardados dentro do token
            { id: usuario.id, email: usuario.email, papel: usuario.papel },
            process.env.JWT_SECRET,
            { expiresIn: '2h' } // O token expira em 2 horas
        );

        // Retorna sucesso e entrega o token para o usuário
        res.status(200).json({
            mensagem: 'Login realizado com sucesso!',
            token: token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                papel: usuario.papel
            }
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro interno ao realizar login.' });
    }
}

async function meuPerfil(req, res) {
    try {
        // Pegamos do Token
        const idUsuarioLogado = req.usuario.id;

        // Mandamos o Model buscar no banco de dados
        const perfil = await usuarioModel.buscarPorId(idUsuarioLogado);

        if (!perfil) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }

        // Retornamos o perfil do usuário logado
        res.status(200).json(perfil);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro interno ao buscar o perfil do usuário.' });
    }
}

async function atualizarPerfil(req, res) {
    try {
        const idUsuarioLogado = req.usuario.id;
        const { nome, email } = req.body;
        const perfilAtualizado = await usuarioModel.atualizarPerfil(idUsuarioLogado, { nome, email });

        if (!perfilAtualizado) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }

        res.status(200).json(perfilAtualizado);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro interno ao atualizar o perfil do usuário.' });
    }
}

async function deletarPerfil(req, res) {
    try {
        const idUsuarioLogado = req.usuario.id;
        const resultado = await usuarioModel.deletarPerfil(idUsuarioLogado);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }
        res.status(200).json({ mensagem: 'Perfil do usuário deletado com sucesso.' });
    }
    catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro interno ao deletar o perfil do usuário.' });
    }
}

module.exports = {
    cadastrar,
    login,
    meuPerfil,
    atualizarPerfil,
    deletarPerfil
};