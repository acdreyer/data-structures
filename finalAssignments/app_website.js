// ------------------------------------------------------------
// ------------------- Initializations -----------------------
// ------------------------------------------------------------
var express = require('express'), // npm install express
    app = express();
var fs = require('fs');
var request = require('request');
const { Client } = require('pg');
// const { Pool } = require('pg');
const dotenv = require('dotenv'); // npm install dotenv
const handlebars = require('handlebars');
const result = dotenv.config({ path: '../../.env' });

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var moment = require('moment'); //npm install moment 
var moment = require('moment-timezone'); //npm install moment-timezone
// ------------------------------------------------------------
// ------------------------------------------------------------





// ----------------- AWS DynamoDB initializations -------------------
// ---------------------------- npm install aws-sdk 
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";
var dynamodb = new AWS.DynamoDB();
// ------------------------------------------------------------
// ------------------------------------------------------------





// ---------------------------- PostgreSQL Database info
// ------------------------------------------------------------
// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = process.env.AWSRDS_USR;
db_credentials.host = process.env.AWSRDS_HOST;
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;
// ------------------------------------------------------------
// ------------------------------------------------------------






// ---------------------------- Database Query strings
// ------------------------------------------------------------

//  SQL statements for sensors: 
var sensorQuery1 = "SELECT MIN(tempsensor) FROM particlewave;"; // print all values
var sensorQuery2 = "SELECT COUNT (*) FROM particlewave;"; // print the number of rows
var sensorQuery3 = "WITH t AS (SELECT * FROM particlewave ORDER BY DBtime DESC limit 20) SELECT * FROM t ORDER BY DBtime DESC ;";
// var sensorQuery3 = "SELECT tempsensor, COUNT (*) FROM particlewave GROUP BY tempsensor;"; // print the number of rows for each sensorValue
var sensorHtmlString = [];
var keepresult = [];
var keepresult2 = {};
var keepresult3 = [];



//  statements for processblog: 
var processHtmlString = [];
var filteredBlogs = [];
var processBlReq = "Thoughts";
var processBlReqMonth = "11";

var meetdaysSelect = 'alldays';
var meettimesSelect = 'alltimes';
var meettypesSelect = 'alltypes';
var timestart = '00:00 AM';
var timeend = '11:59 PM';
// ---------------------------------------------------------------
// ---------------------------------------------------------------








// ---------------------------------------------------------------
// Start app; main page
// ---------------------------------------------------------------
// This is not necessary because browser will automatically look for index.html

// app.get('/', function(req, res) {

//     var output = {};
//     // output.time = Date(Date.now()).toLocaleString();
//     output.time = moment().tz("America/New_York").format("L, LT z");
//     // console.log(output.time);

//     fs.readFile('./public/index.html', "utf8", (error, data) => {
//         var template = handlebars.compile(data);
//         // output.meetings = result.rows
//         var html = template(output);
//         res.send(html)

//     });

// });

// ---------------------------------------------------------------
// ---------------------------------------------------------------



// ---------------------------------------------------------------
// The rest 
// ---------------------------------------------------------------
// serve static files in /public
app.use(express.static('public'));

// listen on port 8080
app.listen(8080, function() {
    console.log('Server listening...');
});











// ---------------------------------------------------------------
// AA meeting data
// ---------------------------------------------------------------


app.get('/aameetings', function(req, res) {

    // get user selection into a logical form for query construction
    // meeting days; assign user selection. 

    // console.log(req.query.day)
    if (req.query.day) {
        meetdaysSelect = req.query.day;
    }

    // meeting time ranges
    if (req.query.time) {
        meettimesSelect = req.query.time;
        if (meettimesSelect == "morning") {
            timestart = '6:00 AM';
            timeend = '12:00 PM';
        }
        else if (meettimesSelect == "midday") {
            timestart = '11:00 AM';
            timeend = '5:00 PM';
        }
        else if (meettimesSelect == "evening") {
            timestart = '4:00 PM';
            timeend = '9:00 PM';
        }
        else if (meettimesSelect == "night") {
            timestart = '8:00 PM';
            timeend = '3:00 AM';
        }
        else {
            timestart = '00:00 AM';
            timeend = '11:59 PM';
        }

    }

    // run the function
    getAAmeetingresults(meetdaysSelect, meettimesSelect, req, res);
    // res.send(req.query);

}); //app.post

// ---------------------------------------------------------------
// ---------------------------------------------------------------


// This function takes user selection, constructs query and sends the page
function getAAmeetingresults(meetdaysSelect, meettimesSelect, req, res) {


    // Construct different queries based on user selections; 
    // variables alldays need special consideration to select all
    // varaible night   needs special consideration due to AM times
    if (meetdaysSelect == "alldays") {
        if (meettimesSelect == "night") {
            var aameetingQuery1 = "SELECT lat, long, json_agg(json_build_object('bldNm', buildingname, 'addr', address, 'time', timestart, 'name', meetingname, 'day', days, 'typ', meetingtype, 'wch', wheelchair)) as meetings\
                 FROM aameetflat WHERE timestart >= '" + timestart + "' OR timestart <= '" + timeend + "' GROUP BY lat, long ;";
        }
        else {
            var aameetingQuery1 = "SELECT lat, long, json_agg(json_build_object('bldNm', buildingname, 'addr', address, 'time', timestart, 'name', meetingname, 'day', days, 'typ', meetingtype, 'wch', wheelchair)) as meetings\
                 FROM aameetflat WHERE timestart >= '" + timestart + "' AND timestart <= '" + timeend + "' GROUP BY lat, long ;";
        }
        console.log(meetdaysSelect + ' ' + timestart + ' ' + timeend)
        console.log(aameetingQuery1);
    }
    else if (meetdaysSelect != "alldays") {
        if (meettimesSelect == "night") {
            var aameetingQuery1 = "SELECT lat, long, json_agg(json_build_object('bldNm', buildingname, 'addr', address, 'time', timestart, 'name', meetingname, 'day', days, 'typ', meetingtype, 'wch', wheelchair)) as meetings\
                 FROM aameetflat WHERE days = '" + meetdaysSelect + "' AND (timestart >= '" + timestart + "' or timestart <= '" + timeend + "') GROUP BY lat, long ;";
        }
        else {
            var aameetingQuery1 = "SELECT lat, long, json_agg(json_build_object('bldNm', buildingname, 'addr', address, 'time', timestart, 'name', meetingname, 'day', days, 'typ', meetingtype, 'wch', wheelchair)) as meetings\
                 FROM aameetflat WHERE days = '" + meetdaysSelect + "' AND timestart >= '" + timestart + "' AND timestart <= '" + timeend + "' GROUP BY lat, long ;";
        }
        console.log(meetdaysSelect + ' ' + timestart + ' ' + timeend)
        console.log(aameetingQuery1);
    }



    var aameetingHtmlString = [];

    // Connect to the AWS RDS Postgres database
    const client = new Client(db_credentials);
    client.connect();


    client.query(aameetingQuery1, (err, aares) => {
        if (err) { throw err }
        else {
            console.log("Number of table rows :" + aares.rows.length);
            client.end();
            res.send([aares.rows.length, aares.rows]);
        }

    }); //client.query


}

// ---------------------------------------------------------------
// ---------------------------------------------------------------












// var sensorQuery1 = "SELECT MIN(tempsensor) FROM particlewave;"; // print all values
// var sensorQuery2 = "SELECT COUNT (*) FROM particlewave;"; // print the number of rows



// ---------------------------------------------------------------
// Sensor data
// ---------------------------------------------------------------
app.get('/sensor', function(req, res) {


    // This is a very laborious way of calling the function...
    // but it is done for future flexibility
    // duration: period, sensortype: whichsensor
    if (req.query.sensortype == "all") {
        console.log("allsensors")
        getsensordatamany(req.query.duration, "all", req, res);
    }
    else if (req.query.duration == "day") {
        console.log("day")
        getsensordata("day", "one", req, res);
    }
    else if (req.query.duration == "week") {
        console.log("week")
        getsensordata("week", "one", req, res);
    }
    else if (req.query.duration == "month") {
        console.log("month")
        getsensordata("month", "one", req, res);
    }
    else if (req.query.duration == "year") {
        console.log("quarter")
        getsensordata("year", "one", req, res);
    }



}); //sensor
// ---------------------------------------------------------------
// ---------------------------------------------------------------



function getsensordata(period, senstype, req, res) {


    var tempsensdataheader = "date_time,temp1,temp2\n";


    // Construct query to return only times and temperatures in an array format
    // that resembles a CSV file. This saves data communication between server
    // and client because object key names only exist once in the header.
    // The CSV text format also makes debugging and transferral to a static 
    // site easier once the AWS ec-2 instance is shut down.


    if (period == "month" || period == "year")
        var sensorQuery3 = "SELECT array_to_string( \
                                ARRAY(WITH t AS (SELECT * FROM particlewave WHERE \
                                extract(epoch from date_trunc('minute', DBtime))::int % (5*60) = 0 AND\
                                DBtime BETWEEN now() - INTERVAL '1 " + period + "' AND now()  ) \
                                SELECT DBtime || ',' || tempsensor  FROM t ORDER BY DBtime ASC), '\n ') AS tempsensdata ;";

    // DB query subsample filter based on https://www.postgresql.org/message-id/20091204063540.GA14099%40a-kretschmer.de

    else {
        var sensorQuery3 = "SELECT array_to_string( \
                                ARRAY(WITH t AS (SELECT * FROM particlewave WHERE \
                                DBtime BETWEEN now() - INTERVAL '1 " + period + "' AND now()\
                                ) \
                                SELECT DBtime || ',' || tempsensor  FROM t ORDER BY DBtime ASC), '\n ') AS tempsensdata ;";
    }

    // Connect to the AWS RDS Postgres database
    const client = new Client(db_credentials);
    client.connect();


    // Do the query
    client.query(sensorQuery3, (err, tempres1) => {
        if (err) { console.log(err) }
        else {
            client.end();
            res.send(tempsensdataheader + tempres1.rows[0].tempsensdata);
            // res.send(tempres1.rows);
        } //if else inner
    }); //client.query


}




// ---------------------------------------------------------------
// ---------------------------------------------------------------
function getsensordatamany(period, senstype, req, res) {

    var tempsensdataheader = "date_time,temp1,temp2,temp3\n";

    var sensorQuery1 = "SELECT array_to_string( \
                                ARRAY(WITH t AS (SELECT * FROM particleelectron WHERE \
                                extract(epoch from date_trunc('minute', DBtime))::int % (5*60) = 0 AND\
                                DBtime BETWEEN now() - INTERVAL '1 " + period + "' AND now()  ) \
                                SELECT DBtime || ',' || tempsensor || ',' || tempsensor3 FROM t ORDER BY DBtime ASC), '\n ') AS tempsensdata ;";
    var sensorQuery2 = "SELECT array_to_string( \
                                ARRAY(WITH t AS (SELECT * FROM weatherstation WHERE \
                                extract(epoch from date_trunc('minute', DBtime))::int % (5*60) = 0 AND\
                                DBtime BETWEEN now() - INTERVAL '1 " + period + "' AND now()  ) \
                                SELECT DBtime || ',' || tempsensor || ',' || tempsensor2 FROM t ORDER BY DBtime ASC), '\n ') AS tempsensdata ;";
    var sensorQuery3 = "SELECT array_to_string( \
                                ARRAY(WITH t AS (SELECT * FROM weatherstation WHERE \
                                extract(epoch from date_trunc('minute', DBtime))::int % (5*60) = 0 AND\
                                DBtime BETWEEN now() - INTERVAL '1 " + period + "' AND now()  ) \
                                SELECT DBtime || ',' || tempsensor2 || ',' || windowOpCl || ',' || lightAnalog FROM t ORDER BY DBtime ASC), '\n ') AS tempsensdata ;";


    // Connect to the AWS RDS Postgres database
    const client = new Client(db_credentials);
    client.connect();


    // Do the query
    client.query(sensorQuery3, (err, tempres1) => {
        if (err) { console.log(err) }
        else {
            client.end();
            res.send(tempsensdataheader + tempres1.rows[0].tempsensdata);
            // res.send(tempres1.rows);
        } //if else inner
    }); //client.query


    // The following code is for multiple queries nested; for future use   
    // // Connect to the AWS RDS Postgres database
    // const client = new Client(db_credentials);
    // client.connect();

    // client.query(sensorQuery1, (err, res1) => {
    //     if (err) { throw err }
    //     else {
    //         // nested query
    //         client.query(sensorQuery2, (err, res2) => {
    //             if (err) { console.log(err) }
    //             else {
    //                 client.query(sensorQuery3, (err, res3) => {
    //                     if (err) { console.log(err) }
    //                     else {



    //                     } //if else inner
    //                 }); //nested query
    //             } //if else inner
    //         }); //nested query
    //     } //ifelse outer
    // }); //client.query

}

// ---------------------------------------------------------------
// ---------------------------------------------------------------













// ---------------------------------------------------------------
// Process blog data
// ---------------------------------------------------------------
app.get('/processblog', function(req, res) {


    console.log("Category" + req.query.category + ", Start: " + req.query.dtrange);

    // calculate dates from date ranges
    var endDate = moment();
    var startDate = endDate;
    var output = {};

    if (req.query.dtrange == "1months") {
        startDate = moment().subtract(1, 'months')
    }
    else if (req.query.dtrange == "3months") {
        startDate = moment().subtract(3, 'months')
    }
    else if (req.query.dtrange == "6months") {
        startDate = moment().subtract(6, 'months')
    }
    else if (req.query.dtrange == "1year") {
        startDate = moment().subtract(1, 'years')
    }

    console.log("Start: " + startDate.format('MMMM Do YYYY, h:mm:ss a') + ", end: " + endDate.format('MMMM Do YYYY, h:mm:ss a'));



    // --------------------------------------------------------------
    // ------------------ database interface ------------------------
    // ------------ initialize database parameters ------------------
    var params = {
        TableName: "processblog",
        KeyConditionExpression: "#ct = :category and dt  between :minDate and :maxDate", // the query expression
        ScanIndexForward: false, // true = ascending, false = descending
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            "#ct": "category"
        },
        ExpressionAttributeValues: { // the query values
            ":category": { S: req.query.category },
            ":minDate": { N: startDate.valueOf().toString() },
            ":maxDate": { N: endDate.valueOf().toString() }
        }
    };


    // --------------- call database ----------------------------------
    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            throw (err);
        }
        else {
            console.log("Query succeeded.");

            // add data to an array of objects inside an object to 
            // facilitate handlebars templating
            output.blogpost = [];
            data.Items.forEach(function(item) {
                // console.log("***** ***** ***** ***** ***** \n", item);
                // filteredBlogs.push(item);
                output.blogpost.push({
                    date: item.dtstring.S,
                    category: item.category.S,
                    content: item.content.S,
                    filename: item.imageurl.S,
                    tags: item.tags.SS,
                    iwentto: item.iwentto.SS
                })
            });
        }

        res.send(output);

    });


}); //processblog
// ---------------------------------------------------------------
// ---------------------------------------------------------------










// // ----------------add navigation-------------------------
// // ------------------------------------------------------
// app.get("/prblThoughts", function(req, res) {
//     processBlReq = "Thoughts";
//     processHtmlString = [];
//     res.redirect("/processblog");
// });
// app.get("/prblIoT", function(req, res) {
//     processBlReq = "IoT";
//     processHtmlString = [];
//     res.redirect("/processblog");
// });
// app.get("/prblAAmeetings", function(req, res) {
//     processBlReq = "AAmeetings";
//     processHtmlString = [];
//     res.redirect("/processblog");
// });
// app.get("/prblProcessblog", function(req, res) {
//     processBlReq = "Processblog";
//     processHtmlString = [];
//     res.redirect("/processblog");
// });

// // ---------------------------------------------------------------
// // ---------------------------------------------------------------
