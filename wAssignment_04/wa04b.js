/* MSDV PGDV5110 Weekly Assignment 04

Created by A.C. Dreyer;  09/23/2019 */

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

var meetings = require('./data/zone7AAmeetingsGeo.json');
// meetings.forEach(function(value,index){console.log(value.GeoInfo.long)});



// -------------------------------aalocations-----------------------
// // Connect to the AWS RDS Postgres database 
// // var addressesForDb = [ { address: '63 Fifth Ave, New York, NY', latLong: { lat: 40.7353041, lng: -73.99413539999999 } }, { address: '16 E 16th St, New York, NY', latLong: { lat: 40.736765, lng: -73.9919024 } }, { address: '2 W 13th St, New York, NY', latLong: { lat: 40.7353297, lng: -73.99447889999999 } } ];
// async.eachSeries(meetings, function(value, callback) {
//     const client = new Client(db_credentials);
//     client.connect();
//     var thisQuery = "INSERT INTO aalocations VALUES (E'" + value.streetAddress + "', " + value.GeoInfo.lat + ", " + value.GeoInfo.long + ", " + value.zipcode + ");";
//     client.query(thisQuery, (err, res) => {
//         console.log(err, res);
//         client.end();
//     });
//     setTimeout(callback, 1000); 
// }); 






// // -------------------------------aatimes-----------------------
// // var thisQuery2 = "CREATE TABLE aatimes (timestart TIME, timeend TIME, days varchar(50) );";
// // Connect to the AWS RDS Postgres database aatimes
// async.eachSeries(meetings, function(value, callback) {
//     const client = new Client(db_credentials);
//     client.connect();
//     var thisQuery = "INSERT INTO aatimes VALUES ('00:00', '00:00', 'DayTest' );";
//     client.query(thisQuery, (err, res) => {
//         console.log(err, res);
//         client.end();
//     });
//     setTimeout(callback, 1000); 
// }); 





// // -------------------------------aabuildingsdirections-----------------------
// // var thisQuery3 = "CREATE TABLE aabuildingsdirections (buildingname varchar(100), meetingname varchar(100), description_1 varchar(100), description_2 varchar(100) );";
// // Connect to the AWS RDS Postgres database aabuildingsdirections
// async.eachSeries(meetings, function(value, callback) {
//     const client = new Client(db_credentials);
//     client.connect();
//     var thisQuery = "INSERT INTO aabuildingsdirections VALUES (E'" + value.buildingName + "', E'" + value.meetingName + "', E'" + value.descr1 + "', E'" + value.descr2 + "');";
//     client.query(thisQuery, (err, res) => {
//         console.log(err, res);
//         client.end();
//     });
//     setTimeout(callback, 1000); 
// }); 



// -------------------------------aamoreinfo-----------------------
// var thisQuery4 = "CREATE TABLE aamoreinfo (meetingtypes varchar(100), specialinterests varchar(100) );";
// Connect to the AWS RDS Postgres database aamoreinfo
async.eachSeries(meetings, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO aamoreinfo VALUES ( 'Meetingtypetest' , 'SpecialinterestTest' );";
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 