// Setup IoT device info
var request = require('request');
const { Client } = require('pg');
const dotenv = require('dotenv'); // npm install dotenv
const result = dotenv.config({ path: '../../.env' });



// Setup Database info
// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = process.env.AWSRDS_USR;
db_credentials.host = process.env.AWSRDS_HOST;
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;




// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statements for checking your work: 
// var thisQuery = "SELECT * FROM particlewave;"; // print all values
var thisQuery = "WITH t AS (SELECT * FROM particleelectron ORDER BY DBtime DESC limit 20) SELECT * FROM t ORDER BY DBtime ASC ;"; // print all values
var secondQuery = "SELECT COUNT (*) FROM particleelectron;"; // print the number of rows
// var thirdQuery = "SELECT tempsensorRM COUNT (*) FROM particleelectron GROUP BY tempsensorRM;"; // print the number of rows for each sensorValue


// SELECT * FROM mytable ORDER BY record_date DESC LIMIT 5;
client.query(thisQuery, (err, res) => {
    if (err) {throw err}
    else {
    console.table(res.rows);
    }
});

client.query(secondQuery, (err, res) => {
    if (err) {throw err}
    else {
    console.table(res.rows);
    }
});

// client.query(thirdQuery, (err, res) => {
//     if (err) {throw err}
//     else {
//     console.table(res.rows);
//     }
//     client.end();
// });