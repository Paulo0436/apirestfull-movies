const express = require('express');
const diretorFilmeController = require('../controller/diretorFilmeController');
const router = express.Router();
const autentificacao = require('../middleware/autentificacaoMiddleware');

// Criar diretor
router.post(
  '/',
  autentificacao.verificarTokenDeAutentificacao,
  diretorFilmeController.adicionarDiretor
);

// Editar diretor
router.put(
  '/:id',
  autentificacao.verificarTokenDeAutentificacao,
  diretorFilmeController.buscarDiretor,
  diretorFilmeController.editarDiretor
);

// Listar diretores
router.get(
  '/',
  diretorFilmeController.listarDiretores
);

// Exibir diretor por id
router.get(
  '/:id',
  diretorFilmeController.buscarDiretor,
  diretorFilmeController.exibirDiretor
);

// Deletar diretor
router.delete(
  '/:id',
  autentificacao.verificarTokenDeAutentificacao,
  diretorFilmeController.buscarDiretor,
  diretorFilmeController.deletarDiretor
);

module.exports = router;
