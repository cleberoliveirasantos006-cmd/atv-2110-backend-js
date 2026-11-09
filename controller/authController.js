const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const repo = require('../dados/usuariosRepositorio');

// ===== LOGIN =====
function login(req, res) {
    const { usuario, senha } = req.body;

    if (typeof usuario !== 'string' || usuario.trim() === '') {
        return res.status(400).json({ erro: 'Usuário é obrigatório' });
    }
    if (typeof senha !== 'string' || senha === '') {
        return res.status(400).json({ erro: 'Senha é obrigatória' });
    }

    const encontrado = repo.buscarPorUsuario(usuario.trim());
    if (!encontrado || !bcrypt.compareSync(senha, encontrado.senha_hash)) {
        return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
    }

    const token = jwt.sign(
        { id: encontrado.id, usuario: encontrado.usuario },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
    );

    res.json({
        token,
        usuario: { id: encontrado.id, usuario: encontrado.usuario }
    });
}

// ===== LOGOUT =====
// JWT é stateless — o front só descarta o token.
function logout(req, res) {
    res.json({ ok: true });
}

// ===== ME =====
function me(req, res) {
    res.json({ usuario: req.usuario || null });
}

// ===== CADASTRO =====
function cadastrar(req, res) {
    const { usuario, senha } = req.body;

    if (typeof usuario !== 'string' || usuario.trim().length < 3) {
        return res.status(400).json({ erro: 'Usuário deve ter pelo menos 3 caracteres' });
    }
    if (typeof senha !== 'string' || senha.length < 6) {
        return res.status(400).json({ erro: 'Senha deve ter pelo menos 6 caracteres' });
    }

    const usuarioLimpo = usuario.trim();

    if (repo.buscarPorUsuario(usuarioLimpo)) {
        return res.status(409).json({ erro: 'Este usuário já está cadastrado' });
    }

    const hash = bcrypt.hashSync(senha, 10);
    const novo = repo.criar(usuarioLimpo, hash);

    res.status(201).json({ ok: true, usuario: { id: novo.id, usuario: novo.usuario } });
}

module.exports = { login, logout, me, cadastrar };