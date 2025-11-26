const bcrypt = require('bcrypt');
const Usuario = require('../models/usuarioModel');
const autentificacao = require('../middleware/autentificacaoMiddleware');

async function logarUsuario(req, res) {
    try {
        const usuarioEncontrado = await Usuario.findOne({ email: req.body.email }).select('+senha');
        if (!usuarioEncontrado) 
            return res.status(401).json({ msg: "Credenciais inválidas" });

        const senhaValida = await bcrypt.compare(req.body.senha, usuarioEncontrado.senha);
        if (!senhaValida) 
            return res.status(401).json({ msg: "Credenciais inválidas" });

        const payload = {
            iss: "API de Filmes",
            aud: "Usuário Autenticado",
            email: usuarioEncontrado.email,
            nome: usuarioEncontrado.nome
        };

        const token = autentificacao.gerarTokenDeAutentificacao(payload);

        return res.status(200).json({ token });

    } catch (err) {
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

module.exports = { logarUsuario };
