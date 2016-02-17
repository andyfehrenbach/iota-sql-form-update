var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

// bring in pg module
var pg = require('pg');
var connectionString = '';
if (process.env.DATABASE_URL !== undefined) {
  connectionString = process.env.DATABASE_URL + 'ssl'; //<---required for heroku
} else {
  connectionString = 'postgres://localhost:5432/node_sql_form_update'; //<--end of path is the name of the database.
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//create a route to capture a GET everything out of the database.
//stream back the results of the GET request to the database.
app.get('/people', function (req, res) {
  var results = [];
  pg.connect(connectionString, function (err, client, done) {

    //do the work of the query here.
    var query = client.query('SELECT * FROM people ORDER BY id DESC;');

    // Stream results back one row at a time
    query.on('row', function (row) {
      results.push(row);
    });

    // close connection
    query.on('end', function () {
      client.end();
      return res.json(results);
    });

    if (err) {
      console.log(err);
    }
  });
});

app.post('/people', function (req, res) {
  var addPerson = {
    name: req.body.name,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    zip_code: req.body.zip
  };

///commands to send POST is INSIDE the connect.
  pg.connect(connectionString, function (err, client) {

    //three parameters of the client.query method.
        ///prepared statement with $1, and $2  //$ is a placeholder in this case
    client.query('INSERT INTO people (name, address, city, state, zip_code) VALUES ($1, $2, $3, $4, $5) RETURNING id',
//pass in array of our values to POST
    [addPerson.name, addPerson.address, addPerson.city, addPerson.state, addPerson.zip_code],
      function (err, result) {
        if (err) {
          console.log('Error inserting data: ', err);
          res.send(false);
        } else {
          res.send(result);
        }
      });
  });

});

app.get('/*', function (req, res) {
  var file = req.params[0] || '/views/index.html';
  res.sendFile(path.join(__dirname, './public', file));
});

app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function () {
  console.log('Listening on port: ', app.get('port'));
});
