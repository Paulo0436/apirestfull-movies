const express = require('express');
const formatoFilmeController = require('../controller/formatoFilmeController');
const router = express.Router();
const autentificacao = require('../middleware/autentificacaoMiddleware');

// Criar novo formato (DVD, Blu-ray, Digital, 4K…)
router.post('/', 
  autentificacao.verificarTokenDeAutentificacao, 
  formatoFilmeController.adicionarFormato
);

// Editar formato existente
router.put('/:id', 
  autentificacao.verificarTokenDeAutentificacao, 
  formatoFilmeController.buscarFormato,
  formatoFilmeController.editarFormato
);

// Listar todos os formatos
router.get('/', formatoFilmeController.listarFormatos);

// Buscar formato específico
router.get('/:id',
  formatoFilmeController.buscarFormato,
  formatoFilmeController.exibirFormato
);

// Deletar formato
router.delete('/:id',
  autentificacao.verificarTokenDeAutentificacao,
  formatoFilmeController.buscarFormato,
  formatoFilmeController.deletarFormato
);

module.exports = router;
