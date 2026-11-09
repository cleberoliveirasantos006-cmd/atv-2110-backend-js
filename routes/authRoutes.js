const express = require('express');
const controller = require('../controller/authController');
const autenticado = require('../middlewares/autenticado');

const router = express.Router();

router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.post('/cadastro', controller.cadastrar);
router.get('/me', autenticado, controller.me);  // ← agora protegido

module.exports = router;