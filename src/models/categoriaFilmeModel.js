const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, "Nome da categoria do filme é obrigatório"],
    trim: true
  }
});

module.exports = mongoose.model('CategoriaFilme', schema);
