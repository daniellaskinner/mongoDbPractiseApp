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



//get todos route to todoList db

app.get('/todos', (req, res) => {
    MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
        console.log('connected to mongo DB woo!');
        let db = client.db('todoList'); //the dbname here

        //call our db function and pass in an anon function
        getDataFromDb(db, (documentsReturned) => {
            res.json(documentsReturned);
        })
    });
});

var getDataFromDb = (db, callback) => {
    var collection = db.collection('todos');  //the collection name here

    //want to find a specific object, if you put nothing it will grab them all
    //here is where you perfrom the CRUD operation
    collection.find({}).toArray((err, docs) => {
        console.log('found the following todos');
        callback(docs);
    });
}
//turn to an array so you can get access to it toArray takes two params one is error message one is the callback docs
//stuff from toArray gets passed inisde of docs



//add todos route
app.post('/todos', jsonParser, (req, res) => {
    //create a new object to go in the db
    const newTodo = {
        todo: req.body.todo
    }

    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
        console.log('Connected correctly to MongoDb')
        //choose which db we want to access
        let db = client.db('todoList')

        //run a function that adds data to db
        let result = insertNewTodo(db, newTodo, (docs) => {
            if(docs.insertedCount === 1){
                res.send('Successfully added todo: ')
            } else {
                res.send('Unable to add new todo')
            }
            client.close()
        })

    })

});

//define the insert todo function here
var insertNewTodo = (db, newTodoToSend, callback) => {
    //choose which collection to access
    var collection = db.collection('todos');
    //insert json object into the collection- newTodo
    collection.insertOne(newTodoToSend, (err, docs) => {
        callback(docs);
    });
};





// //edit todos route
app.put('/todos', jsonParser, (req, res) => {
    let id = req.body.id;
    res.send('Todo id is ' + id);
});


// //delete todos route
app.delete('/todos', jsonParser, (req, res) => {
    let id = req.body.id;
    res.send('Todo deleted is ' + id);
});


app.listen(port, () => console.log(`MongoDB app listening at http://localhost:${port}`));
