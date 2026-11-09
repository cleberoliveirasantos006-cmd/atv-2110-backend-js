require('dotenv').config();

const express = require('express');
const path = require('path');
const produtosRoutes = require('./routes/produtosRoutes');
const repo = require('./dados/produtosRepositorio');

// ===== imports do sistema de login =====
const authRoutes = require('./routes/authRoutes');
const autenticado = require('./middlewares/autenticado');
const repoUsuarios = require('./dados/usuariosRepositorio');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===== rotas de autenticação =====
app.use('/auth', authRoutes);

// ===== ORIGINAL: única alteração — adicionado 'autenticado,' no meio =====
app.use('/produtos', autenticado, produtosRoutes);

// ===== inicia os dois bancos =====
Promise.all([
    repo.iniciar(),
    repoUsuarios.iniciar()
])
    .then(() => {
        app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
    })
    .catch(erro => console.log('Erro ao abrir o banco de dados:', erro));