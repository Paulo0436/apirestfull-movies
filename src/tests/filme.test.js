const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

const url = '/api/v1/movie';
const urlDiretor = '/api/v1/movie/diretor';
const urlCategoria = '/api/v1/movie/categoria';

let id = null;
let token = null;

const tempo = Date.now();
const numeroAleatorio = Math.floor(Math.random() * 1000);

let nomeUser = `nomeUserTest${tempo}`;
let emailUser = `emailUserTest${tempo}@gmail.com`;
let senhaUser = `senhaUserTest${tempo}`;

let nome = `filmeTest${tempo}`;
let ano = 2000 + (numeroAleatorio % 20);
let diretor = `diretorTest${tempo}`;
let categoria = `categoriaTest${tempo}`;

describe('Testes das rotas de filme', ()=>{

    beforeAll(async () => {

        await request.post("/api/v1/usuario").send({
            nome: nomeUser,
            email: emailUser,
            senha: senhaUser
        });

        const mockLogin = await request.post("/api/v1/usuario/login").send({
            email: emailUser,
            senha: senhaUser
        });

        expect(mockLogin.status).toBe(200);
        token = mockLogin.body.token;

        const mockDiretor = await request.post(urlDiretor).set("authorization",`Bearer ${token}`).send({
            nome: diretor,
            idade: numeroAleatorio,
            nacionalidade: "Brasileiro"
        });
        expect(mockDiretor.status).toBe(201);

        const mockCategoria = await request.post(urlCategoria).set("authorization",`Bearer ${token}`).send({
            nome: categoria
        });
        expect(mockCategoria.status).toBe(201);
    });

    test('POST:422 nome inexistente', async ()=> {
        const resposta = await request.post(url)
        .set("authorization",`Bearer ${token}`)
        .send({
            nome: null,
            ano: ano,
            diretor: diretor,
            categoria: categoria
        });
        expect(resposta.status).toBe(422);
        expect(resposta.body.msg).toContain("Nome do filme é obrigatório");
    });

    test('POST:422 ano inexistente', async ()=> {
        const resposta = await request.post(url)
        .set("authorization",`Bearer ${token}`)
        .send({
            nome: nome,
            ano: null,
            diretor: diretor,
            categoria: categoria
        });
        expect(resposta.status).toBe(422);
        expect(resposta.body.msg).toContain("Ano do filme é obrigatório");
    });

    test('POST:422 ano inválido', async ()=> {
        const resposta = await request.post(url)
        .set("authorization",`Bearer ${token}`)
        .send({
            nome: nome,
            ano: "abc",
            diretor: diretor,
            categoria: categoria
        });
        expect(resposta.status).toBe(422);
        expect(resposta.body.msg).toContain("Ano não é um número válido");
    });

    test('POST:404 diretor inexistente', async ()=> {
        const resposta = await request.post(url)
        .set("authorization",`Bearer ${token}`)
        .send({
            nome: nome,
            ano: ano,
            diretor: "Diretor Inexistente",
            categoria: categoria
        });
        expect(resposta.status).toBe(404);
        expect(resposta.body.msg).toContain("Diretor não encontrado");
    });

    test('POST:404 categoria inexistente', async ()=> {
        const resposta = await request.post(url)
        .set("authorization",`Bearer ${token}`)
        .send({
            nome: nome,
            ano: ano,
            diretor: diretor,
            categoria: "Outra categoria"
        });
        expect(resposta.status).toBe(404);
        expect(resposta.body.msg).toContain("Categoria não encontrada");
    });

    test('POST:401 token ausente', async ()=> {
        const resposta = await request.post(url).send({
            nome: nome,
            ano: ano,
            diretor: diretor,
            categoria: categoria
        });
        expect(resposta.status).toBe(401);
        expect(resposta.body.msg).toContain("Token ausente");
    });

    test('POST:201', async ()=> {
        const resposta = await request.post(url)
        .set("authorization",`Bearer ${token}`)
        .send({
            nome: nome,
            ano: ano,
            diretor: diretor,
            categoria: categoria
        });

        expect(resposta.status).toBe(201);
        expect(resposta.body._id).toBeDefined();
        expect(resposta.body.nome).toBe(nome);
        expect(resposta.body.ano).toBe(ano);
        expect(resposta.body.diretor.nome).toBe(diretor);
        expect(resposta.body.categoria.nome).toBe(categoria);

        id = resposta.body._id;
    });

    test('GET:200', async ()=> {
        const resposta = await request.get(url);
        expect(resposta.status).toBe(200);
        expect(Array.isArray(resposta.body)).toBe(true);
    });

    test('GET:id:400 id inválido', async ()=> {
        const resposta = await request.get(`${url}/0`);
        expect(resposta.status).toBe(400);
        expect(resposta.body.msg).toContain("Parâmetro inválido");
    });

    test('GET:id:404 id não encontrado', async ()=> {
        const resposta = await request.get(`${url}/000000000000000000000000`);
        expect(resposta.status).toBe(404);
        expect(resposta.body.msg).toContain("Filme não encontrado");
    });

    test('GET:id:200', async ()=> {
        const resposta = await request.get(`${url}/${id}`);
        expect(resposta.status).toBe(200);
        expect(resposta.body.nome).toBe(nome);
        expect(resposta.body.ano).toBe(ano);
        expect(resposta.body.diretor.nome).toBe(diretor);
        expect(resposta.body.categoria.nome).toBe(categoria);
    });

    test('PUT:id:400 id inválido', async ()=> {
        const resposta = await request.put(`${url}/0`)
        .set("authorization",`Bearer ${token}`)
        .send({
            nome: nome,
            ano: ano + 1,
            diretor: diretor,
            categoria: categoria
        });

        expect(resposta.status).toBe(400);
        expect(resposta.body.msg).toContain("Parâmetro inválido");
    });

    test('PUT:id:404 id não encontrado', async ()=> {
        const resposta = await request.put(`${url}/000000000000000000000000`)
        .set("authorization",`Bearer ${token}`)
        .send({
            nome: nome,
            ano: ano + 1,
            diretor: diretor,
            categoria: categoria
        });

        expect(resposta.status).toBe(404);
        expect(resposta.body.msg).toContain("Filme não encontrado");
    });

    test('PUT:id:401 token ausente', async ()=> {
        const resposta = await request.put(`${url}/${id}`)
        .send({
            nome: nome,
            ano: ano + 1,
            diretor: diretor,
            categoria: categoria
        });

        expect(resposta.status).toBe(401);
        expect(resposta.body.msg).toContain("Token ausente");
    });

    test('PUT:id:200', async ()=> {
        const resposta = await request.put(`${url}/${id}`)
        .set("authorization",`Bearer ${token}`)
        .send({
            nome: nome,
            ano: ano + 1,
            diretor: diretor,
            categoria: categoria
        });

        expect(resposta.status).toBe(200);
        expect(resposta.body.ano).toBe(ano + 1);
    });

    test('DELETE:id:400 id inválido', async ()=> {
        const resposta = await request.delete(`${url}/0`)
        .set("authorization",`Bearer ${token}`);
        expect(resposta.status).toBe(400);
        expect(resposta.body.msg).toContain("Parâmetro inválido");
    });

    test('DELETE:id:404 id não encontrado', async ()=> {
        const resposta = await request.delete(`${url}/000000000000000000000000`)
        .set("authorization",`Bearer ${token}`);
        expect(resposta.status).toBe(404);
        expect(resposta.body.msg).toContain("Filme não encontrado");
    });

    test('DELETE:id:401 token ausente', async ()=> {
        const resposta = await request.delete(`${url}/${id}`);
        expect(resposta.status).toBe(401);
        expect(resposta.body.msg).toContain("Token ausente");
    });

    test('DELETE:id:204', async ()=> {
        const resposta = await request.delete(`${url}/${id}`)
        .set("authorization",`Bearer ${token}`);
        expect(resposta.status).toBe(204);
    });

    test('GET:id:404 após deletar', async ()=> {
        const resposta = await request.get(`${url}/${id}`);
        expect(resposta.status).toBe(404);
        expect(resposta.body.msg).toContain("Filme não encontrado");
    });

});
