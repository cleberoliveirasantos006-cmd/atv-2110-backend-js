const express = require('express');
const controller = require('../controller/authController');

const router = express.Router();

router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/me', controller.me);
router.post('/cadastro', controller.cadastrar);

module.exports = router;