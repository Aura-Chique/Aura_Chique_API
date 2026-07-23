const database = require('../database/config');

function cadastrarEndereco(endereco, idUsuario) {
    const instrucao = `
       INSERT INTO enderecos 
        (usuario_id, cep, rua, numero, complemento, bairro, cidade, estado) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const parametros = [
        idUsuario,
        endereco.cep,
        endereco.rua,
        endereco.numero,
        endereco.complemento,
        endereco.bairro,
        endereco.cidade,
        endereco.estado
    ];

    return database.executar(instrucao, parametros);
}

function listarEnderecos(idUsuario) {
    const instrucao = `
        SELECT * FROM enderecos WHERE usuario_id = ?
    `;
    return database.executar(instrucao, [idUsuario]);
}

function deletarEndereco(idEndereco, idUsuario) {
    const instrucao = `
        DELETE FROM enderecos WHERE id = ? AND usuario_id = ?
    `;
    return database.executar(instrucao, [idEndereco, idUsuario]);
}

function atualizarEndereco(idEndereco, idUsuario, endereco) {
    const instrucao = `
        UPDATE enderecos 
        SET cep = ?, rua = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, estado = ?
        WHERE id = ? AND usuario_id = ?
    `;
    const parametros = [
        endereco.cep,
        endereco.rua,
        endereco.numero,
        endereco.complemento,
        endereco.bairro,
        endereco.cidade,
        endereco.estado,
        idEndereco,
        idUsuario
    ];
    return database.executar(instrucao, parametros);
}

module.exports = {
    cadastrarEndereco,
    listarEnderecos,
    deletarEndereco,
    atualizarEndereco
};