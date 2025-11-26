const express = require('express');
const autentificacaoController = require('../controller/autentificacaoController');
const usuarioController = require('../controller/usuarioController');
const router = express.Router();
const autentificacao = require('../middleware/autentificacaoMiddleware');

// Criar usuário
router.post('/', usuarioController.adicionarUsuario);

// Login
router.post('/login', autentificacaoController.logarUsuario);

// Renovar token
router.post(
  '/renova',
  autentificacao.verificarTokenDeAutentificacao,
  autentificacao.renovarTokenDeAutentificacao
);

// Listar usuários
router.get(
  '/',
  autentificacao.verificarTokenDeAutentificacao,
  usuarioController.listarUsuarios
);

// Exibir usuário por ID
router.get(
  '/:id',
  autentificacao.verificarTokenDeAutentificacao,
  usuarioController.buscarUsuario,
  usuarioController.exibirUsuario
);

// Editar usuário
router.put(
  '/:id',
  autentificacao.verificarTokenDeAutentificacao,
  usuarioController.buscarUsuario,
  usuarioController.editarUsuario
);

// Deletar usuário
router.delete(
  '/:id',
  autentificacao.verificarTokenDeAutentificacao,
  usuarioController.buscarUsuario,
  usuarioController.deletarUsuario
);

module.exports = router;
