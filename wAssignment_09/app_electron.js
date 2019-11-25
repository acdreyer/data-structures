// npm install pm2 -g
// pm2 init


// Setup IoT device info
var request = require('request');
const { Client } = require('pg');
const dotenv = require('dotenv'); // npm install dotenv
const result = dotenv.config({ path: '../../.env' });
var fs = require('fs');


// PARTICLE electron
var device_id = process.env.ELECTRON_ID;
var access_token = process.env.PHOTON_TOKEN;
//table particleelectron;  tempsensorRM; deviceID: 1f0035000747373336373936
var particle_variable = 'tempsensorRM';

var device_url = 'https://api.particle.io/v1/devices/' + device_id + '/' + particle_variable + '?access_token=' + access_token;


// Setup Database info
// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = process.env.AWSRDS_USR;
db_credentials.host = process.env.AWSRDS_HOST;
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// error logfile information
var fnameErr = 'tempSens_RM_err.log';



// Software to run
var getAndWriteData = function() {

    // Make request to the Particle API to get sensor values
    request(device_url, function(error, response, body) {


        // write error into log file if applicable
        console.log("This output " + JSON.parse(body).error)
        if (!JSON.parse(body).ok ) {
            var nowmyISO = new Date().toISOString();
            console.log('Error ' + JSON.parse(body).error + ' ' + nowmyISO );
            fs.appendFile(fnameErr, 'Error ' + JSON.parse(body).error + ' ' + nowmyISO + '\n', function(err) {
                if (err) throw err;
            });
        }


        // Store sensor value(s) in a variable
        var sensTempVal = JSON.parse(body).result;

        // Connect to the AWS RDS Postgres database
        const client = new Client(db_credentials);
        client.connect();

        // Construct a SQL statement to insert sensor values into a table
        var thisQuery = "INSERT INTO particleelectron VALUES (" + sensTempVal + ", DEFAULT);";
        console.log(thisQuery); // for debugging




        // Connect to the AWS RDS Postgres database and insert a new row of sensor values
        client.query(thisQuery, (err, res) => {
            if (res){
            console.log(error, res);
            }
            
            if (error || !res) {
                var nowmyISO = new Date().toLocaleString();
                console.log('Error database ' + nowmyISO);
                fs.appendFile(fnameErr, 'Error database ' + nowmyISO + ' ' + thisQuery +'\n', function(err) {
                    if (err) throw err;
                });
            };
            
            
            client.end();
            
            
        });
    });
};

// write a new row of sensor data every five minutes
// setInterval(getAndWriteData, 300000);

// write a new row of sensor data every minute
setInterval(getAndWriteData, 60000);   //  <------ use this for final

// getAndWriteData();   // used for debugging

// pm2 start ecosystem.config.js
// pm2 list
// pm2 stop 0