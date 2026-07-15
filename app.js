require('dotenv').config(); // 1. Carrega as variáveis do seu arquivo .env


// Define que por padrão vamos usar 'desenvolvimento' caso nada seja informado
const ambiente = process.env.NODE_ENV || 'desenvolvimento';

// Escolhe o arquivo baseado no ambiente
const arquivoEnv = ambiente === 'desenvolvimento' ? '.env.dev' : '.env';

// Carrega o dotenv apontando para o arquivo correto
require('dotenv').config({ path: arquivoEnv });

const express = require('express');
const cors = require('cors'); // Permite que a API seja acessada pelo frontend
const database = require('./src/database/config');

const app = express();
// Pega a porta do arquivo .env ou usa a 3000 se não achar
const porta = process.env.PORT || 3000; 

// Configurações da API
app.use(cors()); // Libera sua API para ser acessada por um frontend
app.use(express.json()); // 4. ESSENCIAL: Permite que sua API leia dados enviados em JSON (como email e senha)


// Importa as rotas
const usuarioRoute = require('./src/routes/usuarioRoute');


// Rotas
app.get('/', (req, res) => {
  res.json({ mensagem: 'Minha API com segurança e variáveis de ambiente está rodando!' });
});

// Diz para o app usar essas rotas sempre que o caminho começar com /usuarios
app.use('/usuarios', usuarioRoute);

// Inicia o servidor
app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});