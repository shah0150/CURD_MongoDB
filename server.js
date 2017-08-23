const express = require('express')
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()

var db

// MongoDB
MongoClient.connect('mongodb://aadishah74:Adesh123@ds023523.mlab.com:23523/form_database', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
})
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(bodyParser.json())

// GET
app.get('/', (req, res) => {
  db.collection('users').find().toArray((err, result) => {
    if (err) 
        return console.log(err)
    res.render('index.ejs', {users: result})
  })
})

// POST
app.post('/users', (req, res) => {
  db.collection('users').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})

// UPDATE
app.put('/users', (req, res) => {
  db.collection('users')
  .findOneAndUpdate({first_name: 'Adesh'}, {
    $set: {
      first_name: req.body.name,
      last_name: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

// DELETE

app.delete('/users', (req, res) => {
  db.collection('users').findOneAndDelete({first_name: req.body.name}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('A name has been deleted')
  })
})