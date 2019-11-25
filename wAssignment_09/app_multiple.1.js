// npm install pm2 -g
// pm2 init


// Setup IoT device info
var request = require('request');
const { Client } = require('pg');
const dotenv = require('dotenv'); // npm install dotenv
const result = dotenv.config({ path: '../../.env' });
var fs = require('fs');


// PARTICLE PHOTON
var device_id = process.env.PHOTON2_ID;
var access_token = process.env.PHOTON_TOKEN;
//table: weatherstation; tempsensor2, windowOpCl, lightAnalog, soundEnvelope; deviceID: 3f003e000947353138383138
var particle_variable1 = 'tempsensorDigital';
var particle_variable2 = 'windowOpCl';
var particle_variable3 = 'lightAnalog';
// var particle_variable = 'soundEnvelope';
//table particleelectron;  tempsensor3; deviceID: 1f0035000747373336373936
// var particle_variable = 'tempAnalog_3';

var device_url1 = 'https://api.particle.io/v1/devices/' + device_id + '/' + particle_variable1 + '?access_token=' + access_token;
var device_url2 = 'https://api.particle.io/v1/devices/' + device_id + '/' + particle_variable2 + '?access_token=' + access_token;
var device_url3 = 'https://api.particle.io/v1/devices/' + device_id + '/' + particle_variable3 + '?access_token=' + access_token;


// Setup Database info
// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = process.env.AWSRDS_USR;
db_credentials.host = process.env.AWSRDS_HOST;
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// error logfile information
var fnameErr = 'tempSens_2_err.log';



// Software to run
var getAndWriteData = function() {

    // Make request to the Particle API to get sensor values
    request(device_url1, function(error, response, body) {

        // write error into log file if applicable
        console.log("This output1 " + JSON.parse(body).error)
        if (!JSON.parse(body).ok) {
            var nowmyISO = new Date().toISOString();
            console.log('Error ' + JSON.parse(body).error + ' ' + nowmyISO);
            fs.appendFile(fnameErr, 'Error ' + JSON.parse(body).error + ' ' + nowmyISO + '\n', function(err) {
                if (err) throw err;
            });
        }



        // Make request to the Particle API to get sensor values
        request(device_url2, function(error2, response2, body2) {
            console.log("This output2 " + JSON.parse(body2).error)
            if (!JSON.parse(body2).ok) {
                console.log('Error ' + JSON.parse(body2).error + ' ' + nowmyISO);
                fs.appendFile(fnameErr, 'Error ' + JSON.parse(body2).error + ' ' + nowmyISO + '\n', function(err) {
                    if (err) throw err;
                });
            }

            request(device_url3, function(error3, response3, body3) {
                console.log("This output3 " + JSON.parse(body3).error)
                if (!JSON.parse(body3).ok) {
                    console.log('Error ' + JSON.parse(body3).error + ' ' + nowmyISO);
                    fs.appendFile(fnameErr, 'Error ' + JSON.parse(body3).error + ' ' + nowmyISO + '\n', function(err) {
                        if (err) throw err;
                    });


                }
                var sensLightVal = JSON.parse(body3).result;
                var sensWindowVal = JSON.parse(body2).result;
                var sensTempVal = JSON.parse(body).result;


                // Connect to the AWS RDS Postgres database
                const client = new Client(db_credentials);
                client.connect();

                // Construct a SQL statement to insert sensor values into a table
                var thisQuery = "INSERT INTO weatherstation VALUES (" + sensTempVal + "," + sensWindowVal + "," + sensLightVal + ", DEFAULT);";
                console.log(thisQuery); // for debugging




                // Connect to the AWS RDS Postgres database and insert a new row of sensor values
                client.query(thisQuery, (err, res) => {
                    if (res) {
                        console.log(error, res);
                    }
                    
                    console.log(err)

                    if (err || !res) {
                        var nowmyISO = new Date().toLocaleString();
                        console.log('Error database ' + nowmyISO);
                        fs.appendFile(fnameErr, 'Error database ' + nowmyISO + ' ' + thisQuery + '\n', function(err) {
                            if (err) throw err;
                        });
                    };
                    client.end();
                });
            });
        });
    });
};

// write a new row of sensor data every five minutes
// setInterval(getAndWriteData, 300000);
// write a new row of sensor data every minute
setInterval(getAndWriteData, 60000);

// getAndWriteData(); //used for debugging

// pm2 start ecosystem.config.js
// pm2 list
// pm2 stop 0