/* MSDV PGDV5110 Weekly Assignment 04

Created by A.C. Dreyer;  09/23/2019 */
// Modified 10/25/2019

// Note: some of the SQL interface code comes from supplied sample code.


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



//change this value for each zone...do it one by one for debugging purposes
// var zoneNo = '9';
var dolocations = 0;
var domeetings = 1;



// if (zoneNo == 10) { var zoneStr = '10'; }
// else { var zoneStr = '0' + zoneNo.toString(10); };

// var zonecount = 0;
// var locationcount = 0;
// var meetcount = 0;







// Write the locations table
// ----------------------------------------------------------
// Load the data file
if (dolocations) {
    try {
        var locations = require("./data/AAlocationsAllZones.json");
    }
    catch (err) { console.log(err) }
    finally {

        // ------------------------------------------------------

        async.eachSeries(locations, function(value, callback) {


            // Connect to the AWS RDS Postgres database 
            const client = new Client(db_credentials);
            client.connect();


            var thisQuery = "INSERT INTO aalocations VALUES ( '" + value.id + "',\
E'" + value.streetAddress + "',\
'" + value.lat + "',\
'" + value.long + "' ) RETURNING id;";

            // Note: abovementioned code is not tabbed indented, since AWS seems to add these tabs into the query string...
            // although this isn't necessarily problematic, it makes the consol.log unreadable.


            console.log(thisQuery);
            client.query(thisQuery, (err, res) => {
                // console.log(err, res);
                console.log('Table entry: ' + res.rows[0].id)
                client.end();
            });
            setTimeout(callback, 1000);
        }); //async eachseries

    } //finally
} //if








// Write the meetings table

// -------------------------------------------------------------------
if (domeetings) {

    // Loop through the zones

    // Load the data file
    try {
        // var meetings = require('./data/zone' + zoneStr + 'AAmeetings.json');
        var meetings = require("./data/AAmeetingsAllZones.json");
    }
    catch (err) { console.log(err) }
    finally {

        // -------------------------------aameetings-----------------------

        async.eachSeries(meetings, function(value, callback) {


            // Connect to the AWS RDS Postgres database 
            const client = new Client(db_credentials);
            client.connect();


            var thisQuery = "INSERT INTO aameetflat VALUES (default,\
'" + value.zone + "',\
E'" + value.streetAddress + "',\
" + value.lat + ",\
" + value.long + ",\
" + value.zipcode + ",\
E'" + value.meetingName.replace(/'/g, "&rsquo;") + "',\
'" + value.timestart + "',\
'" + value.timeend + "',\
'" + value.datemeet + "' ,\
'" + value.meettype + "',\
'" + value.meetspecial + "',\
E'" + value.buildingName.replace(/'/g, "&rsquo;") + "',\
'" + value.wheelchair + "',\
'" + value.descr1 + "',\
'" + value.descr2 + "',\
'" + value.fn_key + "' ) RETURNING id;";

            // Note: abovementioned code is not tabbed indented, since AWS seems to add these tabs into the query string...
            // although this isn't necessarily problematic, it makes the consol.log unreadable.


            console.log(thisQuery);

            client.query(thisQuery, (err, res) => {
                // console.log(err, res);
                console.log('Table entry: ' + res.rows[0].id)
                client.end();
            });
            setTimeout(callback, 1000);

        }); //async eachseries

    } //finally

} //if