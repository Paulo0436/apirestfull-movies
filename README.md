# API RESTful de Filmes

Projeto backend de uma API RESTful desenvolvida com Node.js, Express e MongoDB para gerenciar usuários, diretores, gêneros, Filmes, formatos e estoques. Esta API foi criada com foco em rotas bem definidas e testes de integração usando Supertest + Jest.

-----------------------------------------------------------------------

## Sumário
- Sobre
- Tecnologias
- Estrutura do projeto
- Endpoints principais
- Variáveis de ambiente
- Instalação e execução
- Rodando os testes

-----------------------------------------------------------------------

## Sobre

Esta API fornece CRUDs para os recursos abaixo e integra autenticação via JWT:

- Usuários (cadastro, login, renovação de token, listagem, edição, exclusão)
- Diretores (CRUD)
- Categoria(CRUD)
- Filmes (CRUD; relacionamentos com diretor e gênero)
- Formatos de Filme (CRUD)
- Estoques (CRUD; relacionamentos com Filme e formato)

A API foi concebida para ser usada como backend isolado (sem front-end).

-----------------------------------------------------------------------

## Tecnologias

- Node.js
- Express
- MongoDB (Mongoose)
- JSON Web Tokens (jsonwebtoken)
- Bcrypt
- Jest + Supertest
- dotenv

-----------------------------------------------------------------------

## Estrutura do projeto (resumida)

/src
/config
database.js

/controller
authController.js
categoriaController.js
directorController.js
filmeController.js
usuarioController.js
formatoFilmeController.js
estoqueController.js

/middlleware
autentificacaoMiddlleware.js

/models
categoriaFilmeModel.js
diretorModel.js
filmeModel.js
formatoFilmeModel.js
usuarioModel.js
estoqueFilmeModel.js

/routes
usuarioRouter.js
diretorRouter.js
categoriaRouter.js
filmeRouter.js
formatoFilmeRouter.js
estoqueFilmeRouter.js
documentacaoSwaggerRouter.js

/test
testes de integração

app.js
package.json



-----------------------------------------------------------------------

## Endpoints principais

Base path: `/api/v1`

-----------------------------------------------------------------------

### Usuário

| Método | Endpoint | Autenticação |
|--------|----------|--------------|
| POST | /api/v1/usuario | Não |
| POST | /api/v1/usuario/login | Não |
| POST | /api/v1/usuario/renova | Sim |
| GET | /api/v1/usuario | Sim |
| GET | /api/v1/usuario/:id | Sim |
| PUT | /api/v1/usuario/:id | Sim |
| DELETE | /api/v1/usuario/:id | Sim |

-----------------------------------------------------------------------

### Diretor

| Método | Endpoint |
|--------|----------|
| POST | /api/v1/movie/diretor |
| GET | /api/v1/movie/diretor |
| GET | /api/v1/movie/diretor/:id |
| PUT | /api/v1/movie/diretor/:id |
| DELETE | /api/v1/movie/diretor/:id |

-----------------------------------------------------------------------

### Categoria

| Método | Endpoint |
|--------|----------|
| POST | /api/v1/movie/categoria |
| GET | /api/v1/movie/categoria |
| GET | /api/v1/movie/categoria/:id |
| PUT | /api/v1/movie/categoria/:id |
| DELETE | /api/v1/movie/categoria/:id |

-----------------------------------------------------------------------

### Movie

| Método | Endpoint |
|--------|----------|
| POST | /api/v1/movie |
| GET | /api/v1/movie |
| GET | /api/v1/movie/:id |
| PUT | /api/v1/movie/:id |
| DELETE | /api/v1/movie/:id |

-----------------------------------------------------------------------

### Formato de Movie

| Método | Endpoint |
|--------|----------|
| POST | /api/v1/movie/formato |
| GET | /api/v1/movie/formato |
| GET | /api/v1/movie/formato/:id |
| PUT | /api/v1/movie/formato/:id |
| DELETE | /api/v1/movie/formato/:id |

-----------------------------------------------------------------------

### Estoque de Movie

| Método | Endpoint |
|--------|----------|
| POST | /api/v1/movie/estoque |
| GET | /api/v1/movie/estoque |
| GET | /api/v1/movie/estoque/:id |
| PUT | /api/v1/movie/estoque/:id |
| DELETE | /api/v1/movie/estoque/:id |

Observação: muitos endpoints aceitam envio por nome (por exemplo: "movie": "Titanic").  
O controller converte automaticamente para o ObjectId correspondente.

-----------------------------------------------------------------------

## Variáveis de ambiente necessárias

Crie um arquivo `.env` com:

JWT_SEGREDO=algum-segredo-secreto
MONGODB_USER=usuario
MONGODB_PASSWD=senha
MONGODB_HOST=localhost:27017
MONGODB_DBNAM=apirestful_movies



-----------------------------------------------------------------------

## Instalação e execução

Instalar dependências:
npm install


Rodar app em desenvolvimento:
npm run dev



Produção:
npm start


A conexão com o banco ocorre automaticamente ao carregar o app (src/config/database.js).

-----------------------------------------------------------------------

## Rodando os testes

Executar:
npm run test


Para rodar sem watch, altere no package.json:
"test": "jest --runInBand --detectOpenHandles"


-----------------------------------------------------------------------
