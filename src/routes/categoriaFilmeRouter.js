const express = require('express');
const categoriaFilmeController = require('../controller/categoriaFilmeController');
const router = express.Router();
const autentificacao = require('../middleware/autentificacaoMiddleware');

// Criar categoria de filme
router.post(
    '/',
    autentificacao.verificarTokenDeAutentificacao,
    categoriaFilmeController.adicionarCategoria
);

// Editar categoria de filme
router.put(
    '/:id',
    autentificacao.verificarTokenDeAutentificacao,
    categoriaFilmeController.buscarCategoria,
    categoriaFilmeController.editarCategoria
);

// Listar todas as categorias de filmes
router.get(
    '/',
    categoriaFilmeController.listarCategorias
);

// Exibir detalhes de uma categoria
router.get(
    '/:id',
    categoriaFilmeController.buscarCategoria,
    categoriaFilmeController.exibirCategoria
);

// Deletar categoria de filme
router.delete(
    '/:id',
    autentificacao.verificarTokenDeAutentificacao,
    categoriaFilmeController.buscarCategoria,
    categoriaFilmeController.deletarCategoria
);

module.exports = router;
