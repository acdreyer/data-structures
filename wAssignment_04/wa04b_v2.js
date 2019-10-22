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



var meetings = require('./data/zone09AAmeetings.json');
// meetings.forEach(function(value,index){console.log(value.long)});





// -------------------------------aameetings-----------------------
// Connect to the AWS RDS Postgres database 
// var addressesForDb = [ { address: '63 Fifth Ave, New York, NY', latLong: { lat: 40.7353041, lng: -73.99413539999999 } }, { address: '16 E 16th St, New York, NY', latLong: { lat: 40.736765, lng: -73.9919024 } }, { address: '2 W 13th St, New York, NY', latLong: { lat: 40.7353297, lng: -73.99447889999999 } } ];
async.eachSeries(meetings, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO aameetflat VALUES (default,'" + value.zone + "',E'" +  value.streetAddress + "'," + value.lat + "," + value.long + "," + value.zipcode + ", E'" + value.meetingName.replace(/'/g,"\\'") + "', '" + value.timestart + "','" + value.timeend + "','" + value.datemeet + "' ,'" + value.meettype + "','" + value.meetspecial + "', E'" + value.buildingName.replace(/'/g,"\\'") + "','" + value.wheelchair + "','" + value.descr1 + "','" + value.descr2 + "' );";
 
//   var thisQuery =  "INSERT INTO aameetflat VALUES (\
//                     id SERIAL PRIMARY KEY, \
//                     zone char(2), \
//                     address varchar(100), \
//                     lat double precision, \
//                     long double precision, \
//                     zipcode char(5), \
//                     meetingname varchar(100), \
//                     timestart TIME, \
//                     timeend TIME, \
//                     days days, \
//                     meetingtype meetingtype, \
//                     specialinterest varchar(100), \
//                     buildingname varchar(100), \
//                     wheelchair boolean,\
//                     additional1 varchar(100), \
//                     additional2 varchar(100)\
//                     );";
 
    //  query += "CREATE TABLE locations (Location_ID serial primary key,\
    //                                     Location_Name varchar(100),\
    //                                     Address_Line_1 varchar(100),\
    //                                     City varchar(100),\
    //                                     State varchar(2),\
    //                                     Zipcode varchar(5),\
    //                                     Accessible BOOL,\
    //                                     Extended_Address varchar(200),\
    //                                     lat double precision,\
    //                                     long double precision,\
    //                                     Zone smallint);";
                                        
    //      var locationQuery = escape("INSERT INTO locations VALUES (DEFAULT, %L,%L,%L,%L,%L,%s,%L,%s,%s,%s) RETURNING Location_ID;",
    //     location,
    //     meetings[location]['address']['line_1'],
    //     meetings[location]['address']['city'],
    //     meetings[location]['address']['state'],
    //     meetings[location]['address']['zip'],
    //     meetings[location]['address']['wheelchair_access'],
    //     meetings[location]['address']['friendly'],
    //     meetings[location]['address']['coords']['latitude'],
    //     meetings[location]['address']['coords']['longitude'],
    //     meetings[location]['address']['zone']);
 
 

 
 
 
 
 
    
    
    
    // console.log("Meeting: " + value.meetingName.replace(/'/g,"\\'"));
    
    
    
    
    console.log(thisQuery);
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 
















// Note: all these bottom sections are used for debugging in manageable chunks.

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
// var thisQuery3 = "CREATE TABLE aabuildingsdirections (buildingname varchar(100), meetingname varchar(100));";
// Connect to the AWS RDS Postgres database aabuildingsdirections
// async.eachSeries(meetings, function(value, callback) {
//     const client = new Client(db_credentials);
//     client.connect();
//     var thisQuery = "INSERT INTO aabuildingsdirections VALUES (E'" + value.buildingName.replace(/'/g,"\\'") + "', E'" + value.meetingName.replace(/'/g,"\\'") + "');";
//     // console.log(value.buildingName.replace(/'/g,"\\'"));
//     // console.log(value.meetingName.replace(/'/g,"\\'"));
    
//     client.query(thisQuery, (err, res) => {
//         console.log(err, res);
//         client.end();
//     });
//     setTimeout(callback, 1000); 
// }); 



// -------------------------------aamoreinfo-----------------------
// // var thisQuery4 = "CREATE TABLE aamoreinfo (meetingtypes varchar(100), specialinterests varchar(100) );";
// // Connect to the AWS RDS Postgres database aamoreinfo
// async.eachSeries(meetings, function(value, callback) {
//     const client = new Client(db_credentials);
//     client.connect();
//     var thisQuery = "INSERT INTO aamoreinfo VALUES ( 'Meetingtypetest' , 'SpecialinterestTest' );";
//     client.query(thisQuery, (err, res) => {
//         console.log(err, res);
//         client.end();
//     });
//     setTimeout(callback, 1000); 
// }); 