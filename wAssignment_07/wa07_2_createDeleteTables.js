/* MSDV PGDV5110 Weekly Assignment 04

Created by A.C. Dreyer;  09/23/2019 */
// updated 10/21/2019

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

// Boolean selectors for which code to run (types/tables create/delete)
// Types
var daysTypecreate = 0;
var daysTypedelete = 0;
var meetEnumcreate = 0;
var meetEnumdelete = 0;


// Tables

var locTabdelete  = 0;
var bulkTabdelete = 0;

var locTabcreate  = 0;
var bulkTabcreate = 1;


// -------------------------------create type-----------------------

if (daysTypecreate){
var thisType = "CREATE TYPE days AS ENUM (\
                'Sundays', 'Mondays', 'Tuesdays', 'Wednesdays',\
                'Thursdays','Fridays','Saturdays','null');";}
if (daysTypedelete){ var thisType = "DROP TYPE days;"}

if (daysTypecreate || daysTypedelete){
client.query(thisType, (err, res) => {
    console.log(err, res);
    client.end();
});
}


// -------------------------------create type-----------------------
if(meetEnumcreate){
var thisType = "CREATE TYPE meetingtype AS ENUM (\
                'B', 'BB', 'C', 'S', 'T','O','OD','null','Sp');";}
if (meetEnumdelete) {var thisType = "DROP TYPE meetingtype ;" }

if (meetEnumcreate || meetEnumdelete){
client.query(thisType, (err, res) => {
    console.log(err, res);
    client.end();
});
}


// B = Beginners meeting
// BB = Big Book meeting
// C = Closed Discussion meeting
// S = Step meeting
// T = Tradition meeting
// O = Open meeting
// OD = Open Discussion meeting
// 'Sp' = Special meeting 


// // -------------------------------aalocations-----------------------
// // Statement to create a table for locations: 
if (locTabcreate){
var thisQuery =     "CREATE TABLE aalocations (\
                    id integer PRIMARY KEY, \
                    address varchar(100), \
                    lat double precision, \
                    long double precision);";
}
                    
if (locTabdelete) { var thisQuery = "DROP TABLE aalocations;"; }

if (locTabcreate || locTabdelete)
client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});






// // -------------------------------aameetflat-----------------------
// // Create a table with the bulk data: 

if (bulkTabcreate){
var thatQuery =     "CREATE TABLE aameetflat (\
                    id SERIAL PRIMARY KEY, \
                    zone char(2), \
                    address varchar(100), \
                    lat double precision, \
                    long double precision, \
                    zipcode char(5), \
                    meetingname varchar(100), \
                    timestart TIME, \
                    timeend TIME, \
                    days days, \
                    meetingtype meetingtype, \
                    specialinterest varchar(100), \
                    buildingname varchar(100), \
                    wheelchair boolean,\
                    additional1 varchar(100), \
                    additional2 varchar(100),\
                    fn_key integer);";
}   
                    
if (bulkTabdelete){ var thatQuery = "DROP TABLE aameetflat;"; }

if (bulkTabcreate || bulkTabdelete){
client.query(thatQuery, (err, res) => {
    console.log(err, res);
    client.end();
});
}

