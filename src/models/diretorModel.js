const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, "Nome do diretor é obrigatório"],
    trim: true
  },
  idade: {
    type: Number,
    required: [true, "Idade do diretor é obrigatória"],
    validate: {
      validator: v => typeof v === 'number',
      message: () => 'Idade não é um número válido'
    }
  },
  nacionalidade: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('Diretor', schema);
