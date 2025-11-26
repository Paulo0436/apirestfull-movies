const express = require('express');
const filmeController = require('../controller/filmeController');
const router = express.Router();
const autentificacao = require('../middleware/autentificacaoMiddleware');

// Criar filme
router.post(
  '/',
  autentificacao.verificarTokenDeAutentificacao,
  filmeController.adicionarFilme
);

// Editar filme
router.put(
  '/:id',
  autentificacao.verificarTokenDeAutentificacao,
  filmeController.buscarFilme,
  filmeController.editarFilme
);

// Listar filmes
router.get(
  '/',
  filmeController.listarFilmes
);

// Exibir filme por id
router.get(
  '/:id',
  filmeController.buscarFilme,
  filmeController.exibirFilme
);

// Deletar filme
router.delete(
  '/:id',
  autentificacao.verificarTokenDeAutentificacao,
  filmeController.buscarFilme,
  filmeController.deletarFilme
);

module.exports = router;
