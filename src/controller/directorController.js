const mongoose = require('mongoose');
const Diretor = require('../models/diretorModel');
const Filme = require('../models/filmeModel');

async function adicionarDiretor(req, res) {
    try {
        const novoDiretor = await Diretor.create({
            nome: req.body.nome,
            idade: req.body.idade,
            nacionalidade: req.body.nacionalidade
        });
        return res.status(201).json(novoDiretor);
    } catch (err) {

        if (err.name === 'CastError' && err.path === 'idade') {
            return res.status(422).json({ msg: ['Idade não é um número válido'] });
        }

        if (err.name === 'ValidationError') {

            const castErrorMsg = Object.values(err.errors)
                .filter(e => e.name === 'CastError' && e.path === 'idade')
                .map(() => 'Idade não é um número válido');

            if (castErrorMsg.length > 0) {
                return res.status(422).json({ msg: castErrorMsg });
            }

            const mensagens = Object.values(err.errors).map(e => e.message);
            return res.status(422).json({ msg: mensagens });
        }

        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

async function editarDiretor(req, res) {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) 
        return res.status(400).json({ msg: "Parâmetro inválido" });

    try {
        const diretorAtualizado = await Diretor.findOneAndUpdate(
            { _id: id },
            {
                nome: req.body.nome,
                idade: req.body.idade,
                nacionalidade: req.body.nacionalidade
            },
            {
                runValidators: true,
                new: true
            }
        );
        return res.status(200).json(diretorAtualizado);

    } catch (err) {
        if (err.name === 'ValidationError') {
            const mensagens = Object.values(err.errors).map(e => e.message);
            return res.status(422).json({ msg: mensagens });
        }

        if (err.name === 'CastError' && err.path === 'idade') {
            return res.status(422).json({ msg: ['Idade não é um número válido'] });
        }

        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

async function listarDiretores(req, res) {
    try {
        const diretores = await Diretor.find({});
        return res.status(200).json(diretores);
    } catch (err) {
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

async function buscarDiretor(req, res, next) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) 
        return res.status(400).json({ msg: "Parâmetro inválido" });

    const diretorEncontrado = await Diretor.findOne({ _id: id });

    if (diretorEncontrado) {
        req.diretor = diretorEncontrado;
        return next();
    } else {
        return res.status(404).json({ msg: "Diretor não encontrado" });
    }
}

async function exibirDiretor(req, res) {
    return res.status(200).json(req.diretor);
}

async function deletarDiretor(req, res) {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) 
            return res.status(400).json({ msg: "Parâmetro inválido" });

        // Remove o diretor dos filmes associados
        await Filme.updateMany({ diretor: id }, { $set: { diretor: null } });

        // Exclui o diretor
        await Diretor.findOneAndDelete({ _id: id });

        return res.status(204).json({});
    } catch (err) {
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

module.exports = { 
    adicionarDiretor, 
    editarDiretor, 
    listarDiretores, 
    buscarDiretor, 
    exibirDiretor, 
    deletarDiretor 
};
