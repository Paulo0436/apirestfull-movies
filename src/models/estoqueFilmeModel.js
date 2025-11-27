const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  filme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Filme',
    required: [true, "Filme é obrigatório"]
  },
  quantidade: {
    type: Number,
    required: [true, "Quantidade é obrigatória"],
  },
  formato: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FormatoFilme',
    required: [true, "Formato é obrigatório"]
  },
  preco: {
    type: Number,
    required: [true, "Preço do filme é obrigatório"],
  }
});

module.exports = mongoose.model('EstoqueFilme', schema);