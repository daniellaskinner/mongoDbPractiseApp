const express = require('express');
const app = express();
const port = 4000;
app.get('/', (req, res) => res.send('Hello World welcome to my MongoDB project!'));

//require in the mongo db client object with methods available on it
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

//require in body parser module for post, put routes
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();



//get todos route
app.get('/todos', (req, res) => {
    let todo = req.query.todo;
    res.send('The todo is: ' + todo);
});

//add todos route
app.post('/todos', jsonParser, (req, res) => {
    let newTodo = req.body.newTodo;
    res.send('New todo is ' + newTodo);
});


// //edit todos route
app.put('/todos', jsonParser, (req, res) => {
    let id = req.body.id;
    res.send('Todo id is ' + id);
});


// //delete todos route
app.delete('/todos', jsonParser, (req, res) => {
    let id = req.body.id;
    res.send('Todo id is ' + id);
});




//route to db
//third param is callback function lets you handle the db error and client itself the client is the db
//client is the object that has all the dbs inside of it
app.get('/users', (req, res) => {
    MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
        console.log('connected to mongo DB woo!');
        let db = client.db('hippos'); //dbname the collection name

        //querying the db the equivalent of SQL
        //call our db function and pass in an anon function
        getDataFromDb(db, (documentsReturned) => {
            res.json(documentsReturned);
        })
    });
});

var getDataFromDb = (db, callback) => {
    var collection = db.collection('users');

    //want to find a specific object, if you put nothing it will grab them all
    //here is where you perfrom the CRUD operation
    collection.find({}).toArray((err, docs) => {
        console.log('found the following records');
        callback(docs);
    });
}


//turn to an array so you can get access to it toArray takes two params one is error message one is the callback docs
//stuff from toArray gets passed inisde of docs

app.listen(port, () => console.log(`MongoDB app listening at http://localhost:${port}`));
