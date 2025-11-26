const express = require('express');
const estoqueFilmeController = require('../controller/estoqueController');
const router = express.Router();
const autentificacao = require('../middleware/autentificacaoMiddleware');

// Adicionar estoque de filme
router.post(
    '/',
    autentificacao.verificarTokenDeAutentificacao,
    estoqueFilmeController.adicionarEstoque
);

// Editar estoque de filme
router.put(
    '/:id',
    autentificacao.verificarTokenDeAutentificacao,
    estoqueFilmeController.buscarEstoques,
    estoqueFilmeController.editarEstoque
);

// Listar todo o estoque de filmes
router.get(
    '/',
    estoqueFilmeController.listarEstoque
);

// Exibir um estoque específico
router.get(
    '/:id',
    estoqueFilmeController.buscarEstoques,
    estoqueFilmeController.exibirEstoque
);

// Deletar estoque de filme
router.delete(
    '/:id',
    autentificacao.verificarTokenDeAutentificacao,
    estoqueFilmeController.buscarEstoques,
    estoqueFilmeController.deletarEstoque
);

module.exports = router;
