const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

const base = "/api/v1/usuario";
const rotaLogin = "/api/v1/usuario/login";
const rotaRenovar = "/api/v1/usuario/renova";

let usuarioId = null;
let authToken = null;

const t = Date.now();
const usuarioInicial = {
    nome: `userInit${t}`,
    email: `userInit${t}@gmail.com`,
    senha: `senhaInit${t}`
};

const novoUsuario = {
    nome: `novoUser${t}`,
    email: `novoUser${t}@gmail.com`,
    senha: `senhaUser${t}`
};

describe("TESTES DAS ROTAS DE USUÁRIO (API FILMES)", () => {

    // Login inicial para gerar token
    beforeAll(async () => {
        await request.post(base).send(usuarioInicial);

        const login = await request.post(rotaLogin).send({
            email: usuarioInicial.email,
            senha: usuarioInicial.senha
        });

        expect(login.status).toBe(200);
        authToken = login.body.token;
    });

    
   
    

    test("POST → nome faltando deve retornar 422", async () => {
        const resp = await request.post(base).send({
            nome: undefined,
            email: novoUsuario.email,
            senha: novoUsuario.senha
        });

        expect(resp.status).toBe(422);
        expect(resp.body.msg).toMatch("O campo nome precisa ser informado");
    });

    test("POST → email ausente deve retornar 422", async () => {
        const resp = await request.post(base).send({
            nome: novoUsuario.nome,
            email: "",
            senha: novoUsuario.senha
        });

        expect(resp.status).toBe(422);
        expect(resp.body.msg).toMatch("Informe um email válido");
    });

    test("POST → senha não enviada deve retornar 422", async () => {
        const resp = await request.post(base).send({
            nome: novoUsuario.nome,
            email: novoUsuario.email,
            senha: null
        });

        expect(resp.status).toBe(422);
        expect(resp.body.msg).toMatch("Senha é obrigatória");
    });

    test("POST → cadastro bem-sucedido (201)", async () => {
        const resp = await request.post(base).send(novoUsuario);

        expect(resp.status).toBe(201);
        expect(resp.body.nome).toBe(novoUsuario.nome);
        expect(resp.body.email).toBe(novoUsuario.email.toLowerCase());

        usuarioId = resp.body._id;
    });

    
    
    

    test("GET → deve listar usuários (200)", async () => {
        const resp = await request
            .get(base)
            .set("authorization", `Bearer ${authToken}`);

        expect(resp.status).toBe(200);
        expect(Array.isArray(resp.body)).toBe(true);
    });

    
   
    

    test("GET:id → id mal-formado deve retornar 400", async () => {
        const resp = await request
            .get(`${base}/123`)
            .set("authorization", `Bearer ${authToken}`);

        expect(resp.status).toBe(400);
        expect(resp.body.msg).toContain("ID informado não é válido");
    });

    test("GET:id → usuário inexistente (404)", async () => {
        const resp = await request
            .get(`${base}/000000000000000000000000`)
            .set("authorization", `Bearer ${authToken}`);

        expect(resp.status).toBe(404);
        expect(resp.body.msg).toContain("Usuário não localizado");
    });

    test("GET:id → token não enviado (401)", async () => {
        const resp = await request.get(`${base}/${usuarioId}`);

        expect(resp.status).toBe(401);
        expect(resp.body.msg).toContain("Token ausente");
    });

    test("GET:id → deve retornar o usuário correto (200)", async () => {
        const resp = await request
            .get(`${base}/${usuarioId}`)
            .set("authorization", `Bearer ${authToken}`);

        expect(resp.status).toBe(200);
        expect(resp.body.email).toBe(novoUsuario.email.toLowerCase());
    });

    
   
    

    test("PUT:id → id inválido retorna 400", async () => {
        const resp = await request
            .put(`${base}/abc`)
            .set("authorization", `Bearer ${authToken}`)
            .send({
                nome: novoUsuario.nome + "_edit",
                email: novoUsuario.email,
                senha: novoUsuario.senha
            });

        expect(resp.status).toBe(400);
        expect(resp.body.msg).toContain("ID informado não é válido");
    });

    test("PUT:id → usuário não encontrado retorna 404", async () => {
        const resp = await request
            .put(`${base}/000000000000000000000000`)
            .set("authorization", `Bearer ${authToken}`)
            .send({
                nome: novoUsuario.nome + "_edit",
                email: novoUsuario.email,
                senha: novoUsuario.senha
            });

        expect(resp.status).toBe(404);
        expect(resp.body.msg).toContain("Usuário não localizado");
    });

    test("PUT:id → token ausente retorna 401", async () => {
        const resp = await request
            .put(`${base}/${usuarioId}`)
            .send({
                nome: novoUsuario.nome + "_edit",
                email: novoUsuario.email,
                senha: novoUsuario.senha
            });

        expect(resp.status).toBe(401);
        expect(resp.body.msg).toContain("Token ausente");
    });

    test("PUT:id → atualização concluída (200)", async () => {
        const resp = await request
            .put(`${base}/${usuarioId}`)
            .set("authorization", `Bearer ${authToken}`)
            .send({
                nome: novoUsuario.nome + "_edit",
                email: novoUsuario.email,
                senha: novoUsuario.senha
            });

        expect(resp.status).toBe(200);
        expect(resp.body.nome).toContain("_edit");
    });

    
   
    

    test("LOGIN → email incorreto (401)", async () => {
        const resp = await request.post(rotaLogin).send({
            email: "naoexiste@gmail.com",
            senha: novoUsuario.senha
        });

        expect(resp.status).toBe(401);
        expect(resp.body.msg).toContain("Credenciais inválidas");
    });

    test("LOGIN → senha incorreta (401)", async () => {
        const resp = await request.post(rotaLogin).send({
            email: novoUsuario.email,
            senha: "errada"
        });

        expect(resp.status).toBe(401);
        expect(resp.body.msg).toContain("Credenciais inválidas");
    });

    test("LOGIN → login válido (200)", async () => {
        const resp = await request.post(rotaLogin).send({
            email: novoUsuario.email,
            senha: novoUsuario.senha
        });

        expect(resp.status).toBe(200);
        expect(resp.body.token).toBeDefined();
    });

    
   
    

    test("RENOVAR → token não enviado (401)", async () => {
        const resp = await request.post(rotaRenovar).send({
            email: novoUsuario.email
        });

        expect(resp.status).toBe(401);
        expect(resp.body.msg).toContain("Token ausente");
    });

    test("RENOVAR → renovar token (200)", async () => {
        const resp = await request
            .post(rotaRenovar)
            .set("authorization", `Bearer ${authToken}`)
            .send({
                email: novoUsuario.email
            });

        expect(resp.status).toBe(200);
        expect(resp.body.token).toBeDefined();
    });

    
    
    

    test("DELETE:id → id inválido retorna 400", async () => {
        const resp = await request
            .delete(`${base}/xxx`)
            .set("authorization", `Bearer ${authToken}`);

        expect(resp.status).toBe(400);
        expect(resp.body.msg).toContain("ID informado não é válido");
    });

    test("DELETE:id → usuário inexistente retorna 404", async () => {
        const resp = await request
            .delete(`${base}/000000000000000000000000`)
            .set("authorization", `Bearer ${authToken}`);

        expect(resp.status).toBe(404);
        expect(resp.body.msg).toContain("Usuário não localizado");
    });

    test("DELETE:id → sem token retorna 401", async () => {
        const resp = await request.delete(`${base}/${usuarioId}`);

        expect(resp.status).toBe(401);
        expect(resp.body.msg).toContain("Token ausente");
    });

    test("DELETE:id → remoção com sucesso (204)", async () => {
        const resp = await request
            .delete(`${base}/${usuarioId}`)
            .set("authorization", `Bearer ${authToken}`);

        expect(resp.status).toBe(204);
    });

    test("GET:id após DELETE → deve retornar 404", async () => {
        const resp = await request
            .get(`${base}/${usuarioId}`)
            .set("authorization", `Bearer ${authToken}`);

        expect(resp.status).toBe(404);
        expect(resp.body.msg).toContain("Usuário não localizado");
    });
});
