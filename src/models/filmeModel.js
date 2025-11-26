const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    nome: {
        type: String, 
        required: [true, "Nome do filme é obrigatório"], 
        trim: true
    },
    ano: {
        type: Number, 
        required: [true, "Ano do filme é obrigatório"], 
        validate: {
            validator: v => typeof v === 'number',
            message: props => 'Ano não é um número válido'
        }
    },
    genero: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genero',   // Similar ao Autor/Categoria no modelo original
    },
    diretor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Diretor',  // Caso você queira que substitua o Autor
    }
});

module.exports = mongoose.model('Filme', schema);
