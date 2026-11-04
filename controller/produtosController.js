const repo = require('../dados/produtosRepositorio');

function listar(req, res) {
  const produtos = repo.listar();
  res.json(produtos);
}

function buscarPorId(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ erro: 'ID inválido' });
  }

  const produto = repo.buscarPorId(id);
  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }
  res.json(produto);
}

function criar(req, res) {
  const { nome, preco } = req.body;

  if (typeof nome !== 'string' || nome.trim() === '') {
    return res.status(400).json({ erro: 'Nome é obrigatório' });
  }
  if (typeof preco !== 'number' || !Number.isFinite(preco) || preco < 0) {
    return res.status(400).json({ erro: 'Preço deve ser um número >= 0' });
  }

  const novoPruduto = repo.criar(nome.trim(), preco);
  res.status(201).json(novoPruduto);
}

function atualizar(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ erro: 'ID inválido' });
  }

  const produtoExistente = repo.buscarPorId(id);
  if (!produtoExistente) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  const { nome, preco } = req.body;

  const novoNome = (nome !== undefined) ? nome.trim() : produtoExistente.nome;
  const novoPreco = (preco !== undefined) ? preco : produtoExistente.preco;

  if (nome !== undefined && (typeof nome !== 'string' || nome.trim() === '')) {
    return res.status(400).json({ erro: 'Nome inválido' });
  }
  if (preco !== undefined && (typeof preco !== 'number' || !Number.isFinite(preco) || preco < 0)) {
    return res.status(400).json({ erro: 'Preço inválido' });
  }

  const produtoAtualizado = repo.atualizar(id, novoNome, novoPreco);
  res.json(produtoAtualizado);
}

function remover(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ erro: 'ID inválido' });
  }

  const deletado = repo.remover(id);
  if (!deletado) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  res.status(204).send();
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };
