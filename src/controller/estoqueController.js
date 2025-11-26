const mongoose = require('mongoose');
const Filme = require('../models/filmeModel');
const Estoque = require('../models/estoqueFilmeModel');
const Formato = require('../models/formatoFilmeModel');

async function adicionarEstoque(req, res) {
    try {
        let filmeEncontrado = null;
        let formatoEncontrado = null;

        if (req.body.filme) {
            filmeEncontrado = await Filme.findOne({ nome: req.body.filme });
            if (!filmeEncontrado)
                return res.status(404).json({ msg: "Filme não encontrado" });
        }

        if (req.body.formato) {
            formatoEncontrado = await Formato.findOne({ nome: req.body.formato });
            if (!formatoEncontrado)
                return res.status(404).json({ msg: "Formato não encontrado" });
        }

        const novoEstoque = await Estoque.create({
            filme: filmeEncontrado?._id,
            quantidade: req.body.quantidade,
            formato: formatoEncontrado?._id,
            preco: req.body.preco
        });

        const resposta = novoEstoque.toObject();
        resposta.filme = req.body.filme;
        resposta.formato = req.body.formato;

        return res.status(201).json(resposta);

    } catch (err) {
        if (err.name === 'ValidationError') {
            const mensagens = Object.values(err.errors).map(e => e.message);
            return res.status(422).json({ msg: mensagens });
        }
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

async function editarEstoque(req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ msg: "Parâmetro inválido" });

    try {
        let filmeEncontrado = null;
        let formatoEncontrado = null;

        if (req.body.filme) {
            filmeEncontrado = await Filme.findOne({ nome: req.body.filme });
            if (!filmeEncontrado)
                return res.status(404).json({ msg: "Filme não encontrado" });
        }

        if (req.body.formato) {
            formatoEncontrado = await Formato.findOne({ nome: req.body.formato });
            if (!formatoEncontrado)
                return res.status(404).json({ msg: "Formato não encontrado" });
        }

        const estoqueAtualizado = await Estoque.findOneAndUpdate(
            { _id: id },
            {
                filme: filmeEncontrado?._id,
                quantidade: req.body.quantidade,
                formato: formatoEncontrado?._id,
                preco: req.body.preco
            },
            {
                runValidators: true,
                new: true
            }
        )
        .populate('filme')
        .populate('formato');

        return res.status(200).json(estoqueAtualizado);

    } catch (err) {
        if (err.name === 'ValidationError') {
            const mensagens = Object.values(err.errors).map(e => e.message);
            return res.status(422).json({ msg: mensagens });
        }
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

async function listarEstoque(req, res) {
    try {
        const estoques = await Estoque.find({})
            .populate('filme')
            .populate('formato');

        return res.status(200).json(estoques);

    } catch (err) {
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

async function buscarEstoques(req, res, next) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ msg: "Parâmetro inválido" });

    const estoqueEncontrado = await Estoque.findOne({ _id: id })
        .populate('filme')
        .populate('formato');

    if (estoqueEncontrado) {
        req.estoque = estoqueEncontrado;
        return next();
    } else {
        return res.status(404).json({ msg: "Estoque não encontrado" });
    }
}

async function exibirEstoque(req, res) {
    return res.status(200).json(req.estoque);
}

async function deletarEstoque(req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ msg: "Parâmetro inválido" });

    try {
        await Estoque.findOneAndDelete({ _id: id });
        return res.status(204).json({});
    } catch (err) {
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

module.exports = {
    adicionarEstoque,
    editarEstoque,
    listarEstoque,
    buscarEstoques,
    exibirEstoque,
    deletarEstoque
};
