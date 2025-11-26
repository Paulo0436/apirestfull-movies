const express = require('express');
const duracaoFilmeController = require('../controller/duracaoFilmeController');
const router = express.Router();
const autentificacao = require('../middleware/autentificacaoMiddleware');

// Criar duração de filme
router.post(
    '/',
    autentificacao.verificarTokenDeAutentificacao,
    duracaoFilmeController.adicionarDuracao
);

// Editar duração de filme
router.put(
    '/:id',
    autentificacao.verificarTokenDeAutentificacao,
    duracaoFilmeController.buscarDuracao,
    duracaoFilmeController.editarDuracao
);

// Listar todas as durações de filmes
router.get(
    '/',
    duracaoFilmeController.listarDuracoes
);

// Exibir uma duração específica
router.get(
    '/:id',
    duracaoFilmeController.buscarDuracao,
    duracaoFilmeController.exibirDuracao
);

// Deletar duração de filme
router.delete(
    '/:id',
    autentificacao.verificarTokenDeAutentificacao,
    duracaoFilmeController.buscarDuracao,
    duracaoFilmeController.deletarDuracao
);

module.exports = router;
