CREATE DATABASE IF NOT EXISTS AuraChiqueBD;
USE AuraChiqueBD;

-- 1. CADASTRO E ACESSO

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    papel ENUM('cliente', 'admin') DEFAULT 'cliente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE enderecos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    cep VARCHAR(20) NOT NULL,
    rua VARCHAR(150) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(100),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    CONSTRAINT fk_endereco_usuario FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 2. CATÁLOGO E ESTOQUE

CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria_id INT,
    nome VARCHAR(150) NOT NULL,
    marca VARCHAR(100),
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_produto_categoria FOREIGN KEY (categoria_id) 
        REFERENCES categorias(id) ON DELETE SET NULL
);

CREATE TABLE variacoes_produto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    atributos JSON NOT NULL,
    preco_venda DECIMAL(10, 2) NOT NULL,
    estoque INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_variacao_produto FOREIGN KEY (produto_id) 
        REFERENCES produtos(id) ON DELETE CASCADE
);

CREATE TABLE imagens_produto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    url_imagem VARCHAR(255) NOT NULL,
    ordem INT DEFAULT 1,
    CONSTRAINT fk_imagem_produto FOREIGN KEY (produto_id) 
        REFERENCES produtos(id) ON DELETE CASCADE
);

-- 3. VENDAS E FATURAMENTO

CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    endereco_id INT NOT NULL,
    status ENUM('pendente', 'pago', 'enviado', 'entregue', 'cancelado') DEFAULT 'pendente',
    valor_total DECIMAL(10, 2) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_pedido_usuario FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) ON DELETE RESTRICT,
    CONSTRAINT fk_pedido_endereco FOREIGN KEY (endereco_id) 
        REFERENCES enderecos(id) ON DELETE RESTRICT
);

CREATE TABLE itens_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    variacao_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_item_pedido FOREIGN KEY (pedido_id) 
        REFERENCES pedidos(id) ON DELETE CASCADE,
    CONSTRAINT fk_item_variacao FOREIGN KEY (variacao_id) 
        REFERENCES variacoes_produto(id) ON DELETE RESTRICT
);

-- 4. CARRINHO DE COMPRAS

CREATE TABLE carrinho_itens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    variacao_id INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_carrinho_usuario FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_carrinho_variacao FOREIGN KEY (variacao_id) 
        REFERENCES variacoes_produto(id) ON DELETE CASCADE,
    CONSTRAINT uk_usuario_variacao UNIQUE (usuario_id, variacao_id)
);