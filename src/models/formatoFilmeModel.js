const mongoose = require('mongoose');

const formatoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, "Nome do formato é obrigatório"],
    trim: true
  }
});

module.exports = mongoose.model('FormatoFilme', formatoSchema);
