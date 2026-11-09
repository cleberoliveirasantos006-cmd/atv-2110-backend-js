const jwt = require('jsonwebtoken');

function autenticado(req, res, next) {
    const cabecalho = req.headers.authorization;

    if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
        return res.status(401).json({ erro: 'Faça login para continuar' });
    }

    const token = cabecalho.split(' ')[1];

    try {
        req.usuario = jwt.verify(token, process.env.JWT_SECRET);

        // Renovação deslizante: renova o prazo a cada requisição válida
        const novoToken = jwt.sign(
            { id: req.usuario.id, usuario: req.usuario.usuario },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
        );
        res.setHeader('X-New-Token', novoToken);

        next();
    } catch {
        return res.status(401).json({ erro: 'Sessão inválida ou expirada. Faça login novamente' });
    }
}

module.exports = autenticado;