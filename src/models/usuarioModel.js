const database = require('../database/config');

function cadastrar(nome, email, senhaCriptografada) {
    // Instrução SQL para inserir o usuário. 
    const instrucao = `INSERT INTO usuarios (nome, email, senha_hash) VALUES ('${nome}', '${email}', '${senhaCriptografada}')`;

    return database.executar(instrucao);
}

function login(email) {
    // Instrução SQL para buscar o usuário pelo email
    const instrucao = `SELECT * FROM usuarios WHERE email = '${email}'`;
    return database.executar(instrucao)
        .then((resultado) => {
            if (resultado.length > 0) {
                return resultado[0]; // Retorna o usuário encontrado
            } else {
                return null; // Retorna null se o usuário não for encontrado
            }
        });
}

module.exports = {
    cadastrar,
    login
};