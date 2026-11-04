const form = document.getElementById('form-auth');
const campoUsuario = document.getElementById('usuario');
const campoSenha = document.getElementById('senha');
const campoConfirmar = document.getElementById('senha-confirmar');
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
    const confirmar = campoConfirmar.value;

    // ===== validações no front (o back valida de novo) =====
    if (usuario.length < 3) {
        mostrar('Usuário deve ter pelo menos 3 caracteres');
        campoUsuario.focus();
        return;
    }
    if (senha.length < 6) {
        mostrar('Senha deve ter pelo menos 6 caracteres');
        campoSenha.focus();
        return;
    }
    if (senha !== confirmar) {
        mostrar('As senhas não coincidem');
        campoConfirmar.value = '';
        campoConfirmar.focus();
        return;
    }

    botaoEnviar.disabled = true;
    botaoEnviar.textContent = 'Cadastrando...';

    try {
        const resposta = await fetch('/auth/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, senha })
        });

        const corpo = await resposta.json();

        if (!resposta.ok) {
            mostrar(corpo.erro || 'Não foi possível cadastrar');
            botaoEnviar.disabled = false;
            botaoEnviar.textContent = 'Cadastrar';
            return;
        }

        mostrar('Usuário criado! Redirecionando pro login...', 'sucesso');
        setTimeout(() => { window.location.href = '/login.html'; }, 900);
    } catch {
        mostrar('Erro de conexão com o servidor');
        botaoEnviar.disabled = false;
        botaoEnviar.textContent = 'Cadastrar';
    }
});