var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString = 'pg://postgres:ILoveGod@1411@localhost:5432/Registration DB';

router.post('/pipe', function(req, res) {

    var results = [];

    // Grab data from http request
    var data = {firstname: req.body.firstname, lastname: req.body.lastname , email: req.body.email , 
    	              address: req.body.address , cellphone: req.body.cellphone};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Insert Data
        client.query("INSERT INTO userInfo(firstname, lastname , email, address,cellphone) values($1, $2, $3, $4, $5)", [data.firstname, data.lastname , data.email , data.address, data.cellphone]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM userInfo ORDER BY firstname ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
          console.log(err);
        }

    });
});

router.post('/emailCheck', function(req, res) {

    var result ;

    // Grab data from http request
    var data = {email: req.body.email };
    var searchArr = [];
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Search Data
        var query = client.query("SELECT firstname,lastname,email FROM userInfo where email= $1",[data.email]);
        console.log('------email-----'+data.email);
        console.log('------query-----'+query);

        query.on('row', function(row) {
            searchArr.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();

            if(searchArr.length == 0){
                console.log('-----in if-------'+searchArr.length );
                var resp = {uniqueEmail : "yes"};
            	return res.json(resp);

            }
            else{
                console.log('-----in else-------'+searchArr.length );
                var resp = {uniqueEmail : "no"}
            	return res.json(resp);
            }

            	
        });

        // Handle Errors
        if(err) {
          console.log(err);
        }

    });
});


router.get('/api/v1/userData', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM userInfo ORDER BY firstname ASC;");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
          console.log(err);
        }

    });

});

router.get('/successPage', function(req, res, next) {
	console.log('------finally---');
  res.sendFile(path.join(__dirname, '../views', 'successPage.html'));
}); 

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('---here===')	;
  res.sendFile(path.join(__dirname, '../views', 'index.html'));
});



module.exports = router;
