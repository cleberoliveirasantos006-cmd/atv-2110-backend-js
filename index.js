const express = require('express');
const produtosRoutes = require('./routes/produtosRoute');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bem vindo à minha loja!');
});

app.use('/produtos', produtosRoutes);

app.listen(3000, () => console.log('Servidor rodando na porta 3000.'));
