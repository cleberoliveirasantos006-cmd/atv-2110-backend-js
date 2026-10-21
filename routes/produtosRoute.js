const express = require('express');
const controller = require('../controllers/produtosController');

const router = express.Router();

router.get('/', controller.listar);
router.get('/:id', controller.buscaPorId);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.remover);

module.exports = router;