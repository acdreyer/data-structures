/* MSDV PGDV5110 Weekly Assignment 06

Created by A.C. Dreyer;  10/14/2019 */

// Note: much of the SQL interface code comes from supplied sample code.


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

// Sample SQL statement to query meetings on Monday that start on or after 7:00pm: 
// var thisQuery = "CREATE TABLE aameetings (id SERIAL PRIMARY KEY, zone , address , lat , long , zipcode , timestart , timeend , days , buildingname , meetingname , meetingtypes , specialinterests );";
var thisQuery =     "SELECT address, lat, long, timestart, meetingname, zone \
                    FROM aameetings \
                    WHERE timestart = '00:00:00' and lat >= 40.7697705 and long <= -73.960301601538 \
                    ORDER BY lat ASC, long DESC;";


client.query(thisQuery, (err, res) => {
    if (err) {throw err}
    else {
        console.table(res.rows);
        client.end();
    }
});