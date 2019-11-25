/* MSDV PGDV5110 Weekly Assignment 08

Created by A.C. Dreyer;  11/01/2019 */

// Create/delete PostgreSQL tables for logging sensor data
// Note: some of the SQL interface code comes from supplied sample code.

// Initialize variables
const { Client } = require('pg'); // npm install pg
const dotenv = require('dotenv'); // npm install dotenv
const result = dotenv.config({ path: '../../.env' });


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

// Boolean selectors for which code to run (create/delete)
var t1Tabcreate  = 1;
var t1Tabdelete  = 0;

var t2Tabcreate  = 0;
var t2Tabdelete  = 0;


// // ------------------------------- tempsensor2 and others -----------------------
// tempAnalog_2
// windowOpCl 
// lightAnalog 
// soundEnvelope 
// // Statement to create a table for measurements: 
if (t1Tabcreate){
var thisQuery =     "CREATE TABLE weatherstation (\
tempsensor2 double precision,\
windowOpCl double precision,\
lightAnalog double precision,\
DBtime TIMESTAMP DEFAULT LOCALTIMESTAMP);";
}

console.log(thisQuery);
        
                    
if (t1Tabdelete) { var thisQuery = "DROP TABLE weatherstation;"; }

if (t1Tabcreate || t1Tabdelete)
client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});






// electronplectron

// // ------------------------------- tempsensor3 -----------------------
// // Statement to create a table for measurements: 
if (t2Tabcreate){
var thisQuery =     "CREATE TABLE particleelectron (\
tempsensor3 double precision,\
DBtime TIMESTAMP DEFAULT LOCALTIMESTAMP);";
}

console.log(thisQuery);
        
                    
if (t2Tabdelete) { var thisQuery = "DROP TABLE particleelectron;"; }

if (t2Tabcreate || t2Tabdelete)
client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});