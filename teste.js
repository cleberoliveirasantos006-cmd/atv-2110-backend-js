const BASE = 'http://localhost:3000';

async function pedir(metodo, caminho, dados) {
    const opcoes = { method: metodo, headers: { 'Content-Type': 'application/json'} };
    if (dados) opcoes.body = JSON.stringify(dados);

    const resposta = await fetch(BASE + caminho, opcoes);
    const texto = await resposta.text();
    const corpo = texto ? JSON.parse(texto) : '(sem conteúdo)';

    console.log(`\n${metodo} ${caminho} -> status ${resposta.status}`);
    console.log(corpo);
    return corpo;
}

async function testarTudo() {
    try {
        await pedir('GET', '/produtos');
        await pedir('GET', 'produtos/1');
        const novo = await pedir('POST', '/produtos', { nome: 'Killer7', preco: 299.70});
        await pedir('PUT', `/produtos/${novo.id}`, { preco: 459.0 });
        await pedir('DELETE', `/produtos/${novo.id}`);
        await pedir('POST', '/produtos', { nome: 'Red9'});
    } catch (erro) {
        console.log('Motivo do erro:', erro.cause || erro.message);
    }
}

testarTudo();