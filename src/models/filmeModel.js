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
            message: () => 'Ano não é um número válido'
        }
    },
    genero: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genero'
    },
    diretor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Diretor'
    },
    categoria: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CategoriaFilme' 
    }
});

module.exports = mongoose.model('Filme', schema);
