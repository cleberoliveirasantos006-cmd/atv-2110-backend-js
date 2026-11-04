const express = require('express');
const path = require('path');
const produtosRoutes = require('./routes/produtosRoutes');
const repo = require('./dados/produtosRepositorio');

// ===== NOVO: imports do sistema de login =====
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const autenticado = require('./middlewares/autenticado');
const repoUsuarios = require('./dados/usuariosRepositorio');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===== NOVO: sessão =====
app.use(session({
    secret: process.env.SESSION_SECRET || 'troque-essa-chave-em-producao',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 8 // 8 horas
    }
}));

// ===== NOVO: rotas de autenticação =====
app.use('/auth', authRoutes);

// ===== ORIGINAL: única alteração — adicionado 'autenticado,' no meio =====
app.use('/produtos', autenticado, produtosRoutes);

// ===== ORIGINAL preservado, com o banco de usuários iniciado em paralelo =====
Promise.all([
    repo.iniciar(),          // banco de produtos: dados/loja.db
    repoUsuarios.iniciar()   // banco de usuários: dados/usuarios.db  ← NOVO
])
    .then(() => {
        app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
    })
    .catch(erro => console.log('Erro ao abrir o banco de dados:', erro));