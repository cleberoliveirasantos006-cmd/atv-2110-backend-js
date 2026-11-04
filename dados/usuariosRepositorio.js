const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// ⚠️ Arquivo separado do loja.db pra não conflitar com o produtosRepositorio
const CAMINHO = path.join(__dirname, 'usuarios.db');
let db;

function salvarArquivo() {
    fs.writeFileSync(CAMINHO, Buffer.from(db.export()));
}

function consultar(sql, params = []) {
    const comando = db.prepare(sql);
    comando.bind(params);
    const linhas = [];
    while (comando.step()) {
        linhas.push(comando.getAsObject());
    }
    comando.free();
    return linhas;
}

async function iniciar() {
    const SQL = await initSqlJs();
    db = fs.existsSync(CAMINHO)
        ? new SQL.Database(new Uint8Array(fs.readFileSync(CAMINHO)))
        : new SQL.Database();

    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT NOT NULL UNIQUE,
            senha_hash TEXT NOT NULL
        )
    `);

    const [{ total }] = consultar('SELECT COUNT(*) AS total FROM usuarios');
    if (total === 0) {
        const hash = await bcrypt.hash('admin123', 10);
        db.run('INSERT INTO usuarios (usuario, senha_hash) VALUES (?, ?)', ['admin', hash]);
        salvarArquivo();
        console.log('👤 Usuário padrão criado: admin / admin123  (TROQUE ISSO!)');
    } else {
        salvarArquivo();
    }
}

function buscarPorUsuario(usuario) {
    return consultar('SELECT * FROM usuarios WHERE usuario = ?', [usuario])[0];
}

function buscarPorId(id) {
    return consultar('SELECT id, usuario FROM usuarios WHERE id = ?', [id])[0];
}

function criar(usuario, senha_hash) {
    db.run('INSERT INTO usuarios (usuario, senha_hash) VALUES (?, ?)', [usuario, senha_hash]);
    const [{ id }] = consultar('SELECT last_insert_rowid() AS id');
    salvarArquivo();
    return buscarPorId(id);
}

module.exports = { iniciar, buscarPorUsuario, buscarPorId, criar };