const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, "Nome do formato do filme é obrigatório"],
    trim: true
  }
});

module.exports = mongoose.model('FormatoFilme', schema);
