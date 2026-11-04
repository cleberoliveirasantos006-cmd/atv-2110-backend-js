function autenticado(req, res, next) {
    // já está logado? segue o fluxo
    if (req.session && req.session.usuario) {
        return next();
    }

    // se for chamada de API (fetch com Accept: application/json) → 401
    // se for navegação do navegador → redireciona pro login
    const querJson = req.xhr
        || req.path.startsWith('/produtos')
        || (req.get('Accept') || '').includes('application/json')
        || (req.get('Content-Type') || '').includes('application/json');

    if (querJson) {
        return res.status(401).json({ erro: 'Não autenticado' });
    }

    return res.redirect('/login.html');
}

module.exports = autenticado;