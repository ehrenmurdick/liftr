
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});


// Models

sys = require("sys");
test = require("assert");

var Db = require('mongodb').Db,
  Connection = require('mongodb').Connection,
  Server = require('mongodb').Server;

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

var LINE_SIZE = 120;

sys.puts("Connecting to " + host + ":" + port);
var db = new Db('liftr', new Server(host, port, {}), {native_parser:false});

db.open(function(err, db) {
  db.dropDatabase(function(err, result) {
    db.collection('exersises', function(err, collection) {
      collection.createIndex(["meta", ['_id', 1], ['name', 1]], function(err, indexName) {
        collection.insert([{'name':'curls'},
                          {'name':'pushups'}], function(err, docs) {
          docs.forEach(function(doc) {
            sys.puts(sys.inspect(doc));
          });
        });
      });
    });
  });
});


// Routes

app.get('/', function(req, res){
  db.collection('exersises', function(err, collection) {
    collection.find(function(err, cursor) {
      cursor.toArray(function(err, items) {
        res.render('index', {
          foo: 'basr',
          exercises: items
        });
      });
    });
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
