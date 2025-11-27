const express = require('express');
const controller = require('../controller/formatoFilmeController');
const autenticacao = require('../middleware/autentificacaoMiddleware');
const router = express.Router();

router.post(
  '/',
  autenticacao.verificarTokenDeAutentificacao,
  controller.criar
);

router.put(
  '/:id',
  autenticacao.verificarTokenDeAutentificacao,
  controller.localizar,
  controller.atualizar
);

router.get('/', controller.listar);

router.get('/:id',
  controller.localizar,
  controller.mostrar
);

router.delete(
  '/:id',
  autenticacao.verificarTokenDeAutentificacao,
  controller.localizar,
  controller.remover
);

module.exports = router;
