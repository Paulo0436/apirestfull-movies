require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const conectarAoBancoDeDados = require('./config/database');

// Rotas da documentação
const documentacaoSwaggerRouter = require('./routes/documentacaoSwaggerRouter');

// Rotas do domínio MOVIES (filmes)
const categoriaFilmeRouter = require('./routes/categoriaFilmeRouter');
const duracaoFilmeRouter = require('./routes/formatoFilmeRouter');
const estoqueFilmeRouter = require('./routes/estoqueFilmeRouter');
const diretorFilmeRouter = require('./routes/diretorFilmeRouter');
const filmeRouter = require('./routes/filmeRouter');

// Rota de usuário (auth)
const usuarioRouter = require('./routes/usuarioRouter');

const app = express();

// Conexão com o banco
conectarAoBancoDeDados();

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Swagger
app.use('/api/v1/api-documentation', documentacaoSwaggerRouter);

// Rotas relacionadas a FILMES
app.use('/api/v1/movie/categoria', categoriaFilmeRouter);
app.use('/api/v1/movie/duracao', duracaoFilmeRouter);
app.use('/api/v1/movie/estoque', estoqueFilmeRouter);
app.use('/api/v1/movie/diretor', diretorFilmeRouter);

app.use('/api/v1/movie', filmeRouter);

// Usuários
app.use('/api/v1/usuario', usuarioRouter);

module.exports = app;
