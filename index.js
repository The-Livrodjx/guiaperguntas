const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./database/database')
const Pergunta = require('./database/Pergunta')
const Resposta = require('./database/Resposta')

const app = express();
const PORT = process.env.PORT || 3000


connection
    .authenticate()
    .then(() => {
        console.log('Conexão feita com o banco de dados');
    })
    .catch((e) => {
        console.log(`Erro: ${e}`)
    })


// Dizendo para o Express usar o EJS como view engine
app.set('view engine', 'ejs');

// Dizendo para o Express em qual pasta encontrar arquivos estáticos (css, images, etc)
app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.get('/', (req, res) => {

    Pergunta.findAll({raw: true, order: [
        ["id", "DESC"] // ASC = Crescente || DESC = Decrescente
    ]}).then(perguntas => {
        res.render("index", {perguntas});  
    });

})

app.get('/perguntar', (req, res) => {

    res.render('perguntar');
})

app.post('/salvarpergunta', (req, res) => {

    let titulo = req.body.titulo
    let descricao = req.body.descricao

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        console.log(`Pergunta criada: ${titulo}, ${descricao}`)

        res.redirect('/')
    })
})

app.get('/pergunta/:id', (req, res) => {
    let id = req.params.id;

    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {

        if(pergunta != undefined) {   

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                raw: true,
                order: [ ['id', 'DESC'] ]
            }).then(respostas => {
                res.render('pergunta', {pergunta, respostas}) 
            })
        }

        else {
            res.redirect("/");
        }
    })  
    
})

app.post('/responder', (req, res) => {

    let corpo = req.body.corpo
    let perguntaId = req.body.pergunta

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {

        res.redirect(`/pergunta/${perguntaId}`)
    })
})

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`)
})