var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'pg://postgres:ILoveGod@1411@localhost:5432/Registration DB';
console.log('---db url heroku---'+process.env.DATABASE_URL);
//var connectionString = 'postgres://lyfkvuexkiumhn:6QpE6inPbwgSEeYU1gvD2j95Cb@ec2-54-163-227-94.compute-1.amazonaws.com:5432/ddg6sj7bgupvgl'

router.post('/api/v1/registerUser', function(req, res) {

    var results = [];

    // Grab data from http request
    var data = {firstname: req.body.firstname, lastname: req.body.lastname , email: req.body.email , 
    	              address: req.body.address , cellphone: req.body.cellphone, pwd: req.body.pwd};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        
        //client.query("DROP TABLE IF EXISTS userInfo");
        client.query("CREATE TABLE IF NOT EXISTS userInfo(id serial primary key ,firstname varchar(50),lastname varchar(50),email varchar(80),address varchar(200),cellphone bigint,pwd varchar(20))");
        // SQL Query > Insert Data
        client.query("INSERT INTO userInfo(firstname, lastname , email, address,cellphone,pwd) values($1, $2, $3, $4, $5, $6)", [data.firstname, data.lastname , data.email , data.address, data.cellphone, data.pwd]);

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
        client.query("CREATE TABLE IF NOT EXISTS userInfo(id serial primary key ,firstname varchar(50),lastname varchar(50),email varchar(80),address varchar(200),cellphone bigint)");
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

//update user info using email of the user

router.post('/api/v1/updateUser', function(req, res) {
    console.log('--------inside update method of index.js---------');
    console.log(req);

    var results = [];

    // Grab data from the URL parameters
   // var param_id = req.params.usr_id;

    // Grab data from http request
    var data = {input: req.body.input_email , firstname: req.body.firstname, lastname: req.body.lastname , 
                      address: req.body.address , cellphone: req.body.cellphone};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        
        client.query("CREATE TABLE IF NOT EXISTS userInfo(id serial primary key ,firstname varchar(50),lastname varchar(50),email varchar(80),address varchar(200),cellphone bigint,pwd varchar(20))");
        // SQL Query > Update Data
        client.query("UPDATE userInfo SET firstname=($1), lastname=($2) , address=($3), cellphone=($4) WHERE email=($5)", [data.firstname, data.lastname, data.address,data.cellphone,data.input]);
     
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


router.get('/api/v1/userData', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        client.query("CREATE TABLE IF NOT EXISTS userInfo(id serial primary key ,firstname varchar(50),lastname varchar(50),email varchar(80),address varchar(200),cellphone bigint,pwd varchar(20))");
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

// check authorization for user to view user records

/*
router.get('/api/v1/authorizeUser', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        var data = {firstname: req.body.firstname, lastname: req.body.lastname , 
                      pwd: req.body.pwd ,email = req.body.email};

        client.query("CREATE TABLE IF NOT EXISTS userInfo(id serial primary key ,firstname varchar(50),lastname varchar(50),email varchar(80),address varchar(200),cellphone bigint)");
        // SQL Query > Select Data
        var query = client.query("SELECT firstname,lastname,pwd,email FROM userInfo where isAdmin=true && email=$1 && pwd=$2",[data.email,data.pwd]);
        console.log(query);

        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();

            if(results.length == 0){
                console.log('-----not admin!-------'+results.length );
                var resp = {isAdmin : "no"};
                return res.json(resp);

            }
            else{
                console.log('-----Admin User!-------'+results.length );
                var resp = {isAdmin : "yes"}
                return res.json(resp);
            }
        });  

         // Handle Errors
        if(err) {
          console.log(err);
        }  

    });
});
*/

router.get('/userRegPage', function(req, res, next) {
    console.log('------finally---');
  res.sendFile(path.join(__dirname, '../views', 'index.html'));
}); 

router.get('/userUpdatePage', function(req, res, next) {
    console.log('------finally---');
  res.sendFile(path.join(__dirname, '../views', 'updateUserPage.html'));
}); 

router.get('/viewUsersPage', function(req, res, next) {
    console.log('------finally---');
  res.sendFile(path.join(__dirname, '../views', 'viewAllUsers.html'));
}); 

router.get('/successPage', function(req, res, next) {
	console.log('------finally---');
  res.sendFile(path.join(__dirname, '../views', 'successPage.html'));
}); 

router.get('/updateSuccessPage', function(req, res, next) {
    console.log('------updated---');
  res.sendFile(path.join(__dirname, '../views', 'updateSuccessPage.html'));
}); 

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('---here===')	;
  res.sendFile(path.join(__dirname, '../views', 'menu.html'));
});



module.exports = router;
