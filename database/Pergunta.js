// MODEL DA TABELA PERGUNTAS

const Sequelize = require("sequelize");
const connection = require('./database')


const Pergunta = connection.define('perguntas', {

    titulo: {
        type: Sequelize.STRING,
        allowNull: false      
    },

    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Pergunta.sync({force: false}).then(() => {}) // Tabela criada com sucesso ou já existente

module.exports = Pergunta