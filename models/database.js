var pg = require('pg');
var connectionString = 'pg://postgres:ILoveGod@1411@localhost:5432/Registration DB';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query("INSERT INTO userInfo(firstname,lastname,email,address,cellphone) values('Anannya','Dasgupta','adasgupta1@salesforce.com','50 south road kolkata','7569583914')");
var query1 = client.query("SELECT firstname, lastname,email,address,cellphone FROM userInfo ORDER BY lastname, firstname");

query1.on("row", function (row, result) {
    result.addRow(row);
});
query1.on("end", function (result) {
    console.log(JSON.stringify(result.rows, null, "    "));
    client.end();
});

