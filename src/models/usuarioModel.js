const database = require('../database/config');

function cadastrar(nome, email, senhaCriptografada) {
    const instrucao = `INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)`;
    
    // Passamos os valores correspondentes em um array como SEGUNDO parâmetro
    return database.executar(instrucao, [nome, email, senhaCriptografada]);
}

function login(email) {
    const instrucao = `SELECT * FROM usuarios WHERE email = ?`;
    
    return database.executar(instrucao, [email])
        .then((resultado) => {
            if (resultado.length > 0) {
                return resultado[0]; 
            } else {
                return null; 
            }
        });
}

function buscarPorId(id) {
    const instrucao = `SELECT id, nome, email, papel, criado_em FROM usuarios WHERE id = ?`;
    
    return database.executar(instrucao, [id])
        .then((resultado) => {
            if (resultado.length > 0) {
                return resultado[0]; 
            } else {
                return null; 
            }
        });
}

module.exports = {
    cadastrar,
    login,
    buscarPorId
};