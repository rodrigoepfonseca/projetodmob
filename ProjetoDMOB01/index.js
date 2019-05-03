const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const ObjectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://projetodmob:123456a@cluster0-pxgmb.mongodb.net/test?retryWrites=true";

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join("public/")));


MongoClient.connect(uri, (err, client) => {
  if (err) return console.log(err)
  db = client.db('Cluster0') 
  app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000')
  })
})

//Tipo de template engine
app.set('view engine', 'ejs')

app.route('/') //rotas
.get(function(req, res) {
  const cursor = db.collection('data').find()
  res.render('index.ejs')
  
})

// rota utilizada para cadastrar os alunos
.post((req, res) => {
  db.collection('data').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('Salvo no Banco de Dados')
    res.redirect('/show')
  })

})

// Rota utilizada para listar os alunos
app.route('/show')
.get((req, res) => {
  db.collection('data').find().toArray((err, results) => {
    if (err) return console.log(err)
    res.render('show.ejs', { data: results })
  })
})

// Essa rota é utilizada para listar e também para alterar os dados, ela utiliza o ID
app.route('/edit/:id')
.get((req, res) => {
  var id = req.params.id

  db.collection('data').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('edit.ejs', { data: result })
  })
})
.post((req, res) => {
  var id = req.params.id
  var nome = req.body.nome
  var nota = req.body.nota


  db.collection('data').updateOne({_id: ObjectId(id)}, {
    $set: {
      nome: nome,
      nota: nota
    }
  }, (err, result) => {
    if (err) return res.send(err)
    res.redirect('/show')
    console.log('Atualizado no Banco de Dados')
  })
})

//Chama o aluno pelo ID e exclui 
app.route('/delete/:id')
.get((req, res) => {
  var id = req.params.id

  db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err)
    console.log('Deletado do Banco de Dados!')
    res.redirect('/show')
  })
})