// Middlewares são funções que atuam como "filtros" ou "pontes" na rota de uma requisição HTTP, 
// interceptando dados antes que cheguem ao destino final para realizar validações.

const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    // Pega o token que vem no cabeçalho (Header) da requisição
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Tira a palavra "Bearer " da frente

    if (!token) {
        return res.status(401).json({ mensagem: 'Acesso negado! Token não fornecido.' });
    }

    try {
        // Verifica se o token é válido e foi gerado com a senha jwt_secret do .env
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // Guarda as informações do usuário (id, papel) dentro da requisição
        req.usuario = payload;

        // Libera a passagem para o Controller
        next();
    } catch (erro) {
        return res.status(403).json({ mensagem: 'Token inválido ou expirado!' });
    }
}

module.exports = { verificarToken };