const mongoose = require('mongoose');
const Formato = require('../models/formatoFilmeModel'); 
const Estoque = require('../models/estoqueFilmeModel'); 

async function adicionarFormato(req, res) {
    try {
        const novoFormato = await Formato.create({
            nome: req.body.nome
        });

        return res.status(201).json(novoFormato);

    } catch (err) {
        if (err.name === 'ValidationError') {
            const mensagens = Object.values(err.errors).map(e => e.message);
            return res.status(422).json({ msg: mensagens });
        }
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

async function editarFormato(req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ msg: "Parâmetro inválido" });

    try {
        const formatoAtualizado = await Formato.findOneAndUpdate(
            { _id: id },
            { nome: req.body.nome },
            {
                runValidators: true,
                new: true
            }
        );

        return res.status(200).json(formatoAtualizado);

    } catch (err) {
        if (err.name === 'ValidationError') {
            const mensagens = Object.values(err.errors).map(e => e.message);
            return res.status(422).json({ msg: mensagens });
        }
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

async function listarFormatos(req, res) {
    try {
        const formatosListados = await Formato.find({});
        return res.status(200).json(formatosListados);

    } catch (err) {
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

async function buscarFormato(req, res, next) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ msg: "Parâmetro inválido" });

    const formatoEncontrado = await Formato.findOne({ _id: id });

    if (formatoEncontrado) {
        req.formato = formatoEncontrado;
        return next();
    } else {
        return res.status(404).json({ msg: "Formato não encontrado" });
    }
}

async function exibirFormato(req, res) {
    return res.status(200).json(req.formato);
}

async function deletarFormato(req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ msg: "Parâmetro inválido" });

    try {

        // Todos os estoques que tinham esse formato terão formato = null
        await Estoque.updateMany(
            { formato: id },
            { $set: { formato: null } }
        );

        await Formato.findOneAndDelete({ _id: id });

        return res.status(204).json({});

    } catch (err) {
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

module.exports = {
    adicionarFormato,
    editarFormato,
    listarFormatos,
    buscarFormato,
    exibirFormato,
    deletarFormato
};
