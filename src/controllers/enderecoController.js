const enderecoModel = require('../models/enderecoModel');

async function cadastrarEndereco(req, res) {
    try {
        const idUsuarioLogado = req.usuario.id; // Pegando do JWT
        const { cep, rua, numero, complemento, bairro, cidade, estado } = req.body;

        // Valida apenas os obrigatórios (complemento fica de fora)
        if (!cep || !rua || !numero || !bairro || !cidade || !estado) {
            return res.status(400).json({ mensagem: 'Todos os campos obrigatórios devem ser preenchidos.' });
        }

        // TRATAMENTO DO COMPLEMENTO:
        // Se 'complemento' vier vazio (""), undefined ou null, ele garante que será enviado como null para o banco.
        const complementoTratado = complemento || null;

        // Manda para o model usando a variável tratada
        const endereco = await enderecoModel.cadastrarEndereco({
            cep,
            rua,
            numero,
            complemento: complementoTratado, // valor tratado aqui
            bairro,
            cidade,
            estado
        }, idUsuarioLogado);

        res.status(201).json({ mensagem: "Endereço cadastrado com sucesso!" });
    }
    catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro interno ao cadastrar o endereço.' });
    }
}

async function listarEnderecos(req, res) {
    try {
        const idUsuarioLogado = req.usuario.id; // Pegando do JWT
        const enderecos = await enderecoModel.listarEnderecos(idUsuarioLogado);
        res.status(200).json(enderecos);
    }
    catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro interno ao listar os endereços.' });
    }
}

async function deletarEndereco(req, res) {
    try {
        const idUsuarioLogado = req.usuario.id; // Pegando do JWT
        const { idEndereco } = req.params;
        await enderecoModel.deletarEndereco(idEndereco, idUsuarioLogado);
        res.status(200).json({ mensagem: "Endereço deletado com sucesso!" });
    }
    catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro interno ao deletar o endereço.' });
    }
}


async function atualizarEndereco(req, res) {
    try {
        const idUsuarioLogado = req.usuario.id; // Pegando do JWT
        const { idEndereco } = req.params;
        const { cep, rua, numero, complemento, bairro, cidade, estado } = req.body;

        if (!cep || !rua || !numero || !bairro || !cidade || !estado) {
            return res.status(400).json({ mensagem: 'Todos os campos obrigatórios devem ser preenchidos.' });
        }

        // TRATAMENTO DO COMPLEMENTO:
        // Se 'complemento' vier vazio (""), undefined ou null, ele garante que será enviado como null para o banco.
        const complementoTratado = complemento || null;

        await enderecoModel.atualizarEndereco(idEndereco, idUsuarioLogado, {
            cep,
            rua,
            numero,
            complemento: complementoTratado,
            bairro,
            cidade,
            estado
        });
        res.status(200).json({ mensagem: "Endereço atualizado com sucesso!" });
    }
    catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro interno ao atualizar o endereço.' });
    }
}

module.exports = {
    cadastrarEndereco,
    listarEnderecos,
    deletarEndereco,
    atualizarEndereco
};
