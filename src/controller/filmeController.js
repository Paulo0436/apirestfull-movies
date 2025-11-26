const mongoose = require('mongoose');
const Filme = require('../models/filmeModel');
const Diretor = require('../models/diretorModel'); 
const Categoria = require('../models/categoriaFilmeModel');
const Estoque = require('../models/estoqueFilmeModel');

async function adicionarFilme(req, res) {
    try {
        let diretorEncontrado = null;
        let categoriaEncontrada = null;

        if (req.body.diretor) {
            diretorEncontrado = await Diretor.findOne({ nome: req.body.diretor });
            if (!diretorEncontrado)
                return res.status(404).json({ msg: "Diretor não encontrado" });
        }

        if (req.body.categoria) {
            categoriaEncontrada = await Categoria.findOne({ nome: req.body.categoria });
            if (!categoriaEncontrada)
                return res.status(404).json({ msg: "Categoria não encontrada" });
        }

        const novoFilme = await Filme.create({
            nome: req.body.nome,
            ano: req.body.ano,
            diretor: diretorEncontrado?._id,    
            categoria: categoriaEncontrada?._id 
        });

        const filmePopulado = await Filme.findById(novoFilme._id)
            .populate('diretor')   
            .populate('categoria');

        return res.status(201).json(filmePopulado);

    } catch (err) {

        // ERRO DE CAST NO "ano"
        if (err.name === 'CastError' && err.path === 'ano') {
            return res.status(422).json({ msg: ['Ano não é um número válido'] });
        }

        if (err.name === 'ValidationError') {

            const castErrorMsg = Object.values(err.errors)
                .filter(e => e.name === 'CastError' && e.path === 'ano')
                .map(() => 'Ano não é um número válido');

            if (castErrorMsg.length > 0) {
                return res.status(422).json({ msg: castErrorMsg });
            }

            const mensagens = Object.values(err.errors).map(e => e.message);
            return res.status(422).json({ msg: mensagens });
        }

        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

async function editarFilme(req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ msg: "Parâmetro inválido" });

    try {
        let diretorEncontrado = null;
        let categoriaEncontrada = null;

        if (req.body.diretor) {
            diretorEncontrado = await Diretor.findOne({ nome: req.body.diretor });
            if (!diretorEncontrado)
                return res.status(404).json({ msg: "Diretor não encontrado" });
        }

        if (req.body.categoria) {
            categoriaEncontrada = await Categoria.findOne({ nome: req.body.categoria });
            if (!categoriaEncontrada)
                return res.status(404).json({ msg: "Categoria não encontrada" });
        }

        const filmeAtualizado = await Filme.findOneAndUpdate(
            { _id: id },
            {
                nome: req.body.nome,
                ano: req.body.ano,
                diretor: diretorEncontrado?._id,     
                categoria: categoriaEncontrada?._id  
            },
            {
                runValidators: true,
                new: true
            }
        )
            .populate('diretor')    
            .populate('categoria');

        return res.status(200).json(filmeAtualizado);

    } catch (err) {
        if (err.name === 'ValidationError') {
            const mensagens = Object.values(err.errors).map(e => e.message);
            return res.status(422).json({ msg: mensagens });
        }

        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

async function listarFilmes(req, res) {
    try {
        const filmes = await Filme.find({})
            .populate('diretor')     
            .populate('categoria');

        return res.status(200).json(filmes);

    } catch (err) {
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

async function buscarFilme(req, res, next) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ msg: "Parâmetro inválido" });

    const filmeEncontrado = await Filme.findOne({ _id: id })
        .populate('diretor')   
        .populate('categoria');

    if (filmeEncontrado) {
        req.filme = filmeEncontrado;
        return next();
    } else {
        return res.status(404).json({ msg: "Filme não encontrado" });
    }
}

async function exibirFilme(req, res) {
    return res.status(200).json(req.filme);
}

async function deletarFilme(req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ msg: "Parâmetro inválido" });

    try {
        // Remove todos os estoques ligados ao filme
        await Estoque.deleteMany({ filme: id });

        await Filme.findOneAndDelete({ _id: id });

        return res.status(204).json({});

    } catch (err) {
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

module.exports = {
    adicionarFilme,
    editarFilme,
    listarFilmes,
    buscarFilme,
    exibirFilme,
    deletarFilme
};

