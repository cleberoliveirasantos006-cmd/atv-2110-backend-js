const form = document.getElementById('form-auth');
const campoUsuario = document.getElementById('usuario');
const campoSenha = document.getElementById('senha');
const botaoEnviar = document.getElementById('botao-enviar');
const mensagem = document.getElementById('mensagem-auth');

function mostrar(texto, tipo = 'erro') {
    mensagem.textContent = texto;
    mensagem.className = tipo;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    mostrar('');

    const usuario = campoUsuario.value.trim();
    const senha = campoSenha.value;

    if (!usuario || !senha) {
        mostrar('Preencha usuário e senha');
        return;
    }

    botaoEnviar.disabled = true;
    botaoEnviar.textContent = 'Verificando...';

    try {
        const resposta = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, senha })
        });

        const corpo = await resposta.json();

        if (!resposta.ok) {
            mostrar(corpo.erro || 'ＡＣＥＳＳＯ ＤＥＮＩＥＤ');
            botaoEnviar.disabled = false;
            botaoEnviar.textContent = 'Entrar';
            campoSenha.value = '';
            campoSenha.focus();
            return;
        }

        mostrar('ＡＣＥＳＳＯ ＬＩＢＥＲＡＤＯ', 'sucesso');
        setTimeout(() => { window.location.href = '/'; }, 600);
    } catch {
        mostrar('Erro de conexão com o servidor');
        botaoEnviar.disabled = false;
        botaoEnviar.textContent = 'Entrar';
    }
    localStorage.setItem('token', corpo.token);
    localStorage.setItem('usuario', JSON.stringify(corpo.usuario));
});