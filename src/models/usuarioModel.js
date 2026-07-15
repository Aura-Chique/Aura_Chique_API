const database = require('../database/config'); 

function cadastrar(nome, email, senhaCriptografada) {
    // Instrução SQL para inserir o usuário. 
    const instrucao = `INSERT INTO usuarios (nome, email, senha_hash) VALUES ('${nome}', '${email}', '${senhaCriptografada}')`;
    
    return database.executar(instrucao);
}

module.exports = {
    cadastrar
};