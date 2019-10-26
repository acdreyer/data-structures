/* MSDV PGDV5110 Weekly Assignment 04

Created by A.C. Dreyer;  09/23/2019 */
// Modified 10/25/2019

// Note: much of the SQL interface code comes from supplied sample code.



// Initialize
const { Client } = require('pg'); // npm install pg
const dotenv = require('dotenv'); // npm install dotenv
const result = dotenv.config({ path: '../../.env' });
var async = require('async');



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


//  SQL statement to query the entire contents of a table: 
// Uncomment for debugging sections:

// var thisQuery = "SELECT * FROM aameetflat;";

var thisQuery = "SELECT * FROM aalocations; ";

// var thisQuery = "SELECT id FROM aalocations WHERE \
//         " + 40.7927121 + "=lat and " + -73.94069 + "=long;";

client.query(thisQuery, (err, res) => {

    console.log(err, res.rows);
    console.log("Number of table rows :" + res.rows.length);
    // if (res.rows[0].exists){console.log("Match found")}
    client.end();
});

