const mongoose = require('mongoose');
const Formato = require('../models/formatoFilmeModel');
const Estoque = require('../models/estoqueFilmeModel');

async function criar(req, res) {
  try {
    const formato = await Formato.create({ nome: req.body.nome });
    return res.status(201).json(formato);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const erros = Object.values(err.errors).map(e => e.message);
      return res.status(422).json({ msg: erros });
    }
    return res.status(500).json({ msg: "Erro interno do servidor" });
  }
}

async function atualizar(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ msg: "Parâmetro inválido" });

  try {
    const formato = await Formato.findOneAndUpdate(
      { _id: id },
      { nome: req.body.nome },
      { new: true, runValidators: true }
    );

    return res.status(200).json(formato);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const erros = Object.values(err.errors).map(e => e.message);
      return res.status(422).json({ msg: erros });
    }
    return res.status(500).json({ msg: "Erro interno do servidor" });
  }
}

async function listar(req, res) {
  try {
    const lista = await Formato.find({});
    return res.status(200).json(lista);
  } catch {
    return res.status(500).json({ msg: "Erro interno do servidor" });
  }
}

async function localizar(req, res, next) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ msg: "Parâmetro inválido" });

  const formato = await Formato.findById(id);

  if (!formato)
    return res.status(404).json({ msg: "Formato não encontrado" });

  req.formato = formato;
  next();
}

function mostrar(req, res) {
  return res.status(200).json(req.formato);
}

async function remover(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ msg: "Parâmetro inválido" });

  try {
    await Estoque.updateMany({ formato: id }, { $set: { formato: null } });
    await Formato.findByIdAndDelete(id);
    return res.status(204).send();
  } catch {
    return res.status(500).json({ msg: "Erro interno do servidor" });
  }
}

module.exports = {
  criar,
  atualizar,
  listar,
  localizar,
  mostrar,
  remover
};
