/* MSDV PGDV5110 Weekly Assignment 04

Created by A.C. Dreyer;  09/23/2019 */

// Note: much of the SQL interface code comes from supplied sample code.


// Initialize
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


// // -------------------------------aalocations-----------------------
// // Sample SQL statement to create a table for locations: 
// // This table should get an index (possibly a serial)...
// var thisQuery = "CREATE TABLE aalocations (address varchar(100), lat double precision, long double precision, zipcode char(5));";
// // Sample SQL statement to delete a table: 
// // var thisQuery = "DROP TABLE aalocations;"; 

// client.query(thisQuery, (err, res) => {
//     console.log(err, res);
//     client.end();
// });




// -------------------------------aatimes-----------------------
// //  SQL statement to create a table for times: 
// var thisQuery2 = "CREATE TABLE aatimes (timestart TIME, timeend TIME, days varchar(50) );";
// // Sample SQL statement to delete a table: 
// // var thisQuery = "DROP TABLE aatimes;"; 

// client.query(thisQuery2, (err, res) => {
//     console.log(err, res);
//     client.end();
// });



// // -------------------------------aabuildingsdirections-----------------------
// //  SQL statement to create a table for buildings and directions: 
// var thisQuery3 = "CREATE TABLE aabuildingsdirections (buildingname varchar(100), meetingname varchar(100), description_1 varchar(100), description_2 varchar(100) );";
// // Sample SQL statement to delete a table: 
// // var thisQuery3 = "DROP TABLE aabuildingsdirections;"; 

// client.query(thisQuery3, (err, res) => {
//     console.log(err, res);
//     client.end();
// });



// // -------------------------------aamoreinfo-----------------------
// //  SQL statement to create a table for more info: 
// // Note: using varchars is not the intended ideal for this table; it should in future use enumerated types...
// var thisQuery4 = "CREATE TABLE aamoreinfo (meetingtypes varchar(100), specialinterests varchar(100) );";
// // Sample SQL statement to delete a table: 
// // var thisQuery4 = "DROP TABLE aamoreinfo;"; 

// client.query(thisQuery4, (err, res) => {
//     console.log(err, res);
//     client.end();
// });