const bcrypt = require('bcryptjs');
const repo = require('../dados/usuariosRepositorio');

// ===== LOGIN =====
async function login(req, res) {
    const { usuario, senha } = req.body;

    if (typeof usuario !== 'string' || usuario.trim() === '') {
        return res.status(400).json({ erro: 'Usuário é obrigatório' });
    }
    if (typeof senha !== 'string' || senha === '') {
        return res.status(400).json({ erro: 'Senha é obrigatória' });
    }

    const encontrado = repo.buscarPorUsuario(usuario.trim());
    if (!encontrado) {
        return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
    }

    const senhaOk = await bcrypt.compare(senha, encontrado.senha_hash);
    if (!senhaOk) {
        return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
    }

    req.session.usuario = { id: encontrado.id, usuario: encontrado.usuario };
    res.json({ ok: true, usuario: req.session.usuario });
}

// ===== LOGOUT =====
function logout(req, res) {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.json({ ok: true });
    });
}

// ===== ME (quem está logado) =====
function me(req, res) {
    res.json({ usuario: req.session.usuario || null });
}

// ===== CADASTRO =====
async function cadastrar(req, res) {
    const { usuario, senha } = req.body;

    // valida usuário
    if (typeof usuario !== 'string' || usuario.trim().length < 3) {
        return res.status(400).json({ erro: 'Usuário deve ter pelo menos 3 caracteres' });
    }
    // valida senha
    if (typeof senha !== 'string' || senha.length < 6) {
        return res.status(400).json({ erro: 'Senha deve ter pelo menos 6 caracteres' });
    }

    const usuarioLimpo = usuario.trim();

    // já existe?
    const existente = repo.buscarPorUsuario(usuarioLimpo);
    if (existente) {
        return res.status(409).json({ erro: 'Este usuário já está cadastrado' });
    }

    const hash = await bcrypt.hash(senha, 10);
    const novo = repo.criar(usuarioLimpo, hash);

    res.status(201).json({ ok: true, usuario: { id: novo.id, usuario: novo.usuario } });
}

module.exports = { login, logout, me, cadastrar };