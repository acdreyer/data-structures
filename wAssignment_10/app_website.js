// ------------------------------ Initializations

var express = require('express'), // npm install express
    app = express();
var fs = require('fs');
var request = require('request');
const { Client } = require('pg');
const dotenv = require('dotenv'); // npm install dotenv
const handlebars = require('handlebars');
const result = dotenv.config({ path: '../../.env' });

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var moment = require('moment'); //npm install moment 
var moment = require('moment-timezone'); //npm install moment-timezone



// ---------------------------- AWS DynamoDB initializations
// ---------------------------- npm install aws-sdk
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";
var dynamodb = new AWS.DynamoDB();





// ---------------------------- PostgreSQL Database info
// ------------------------------------------------------------
// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = process.env.AWSRDS_USR;
db_credentials.host = process.env.AWSRDS_HOST;
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;






// ---------------------------- PostgreSQL Queries
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

var meetdaysSelect = 'alldays';
var meettimesSelect = 'alltimes';
var meettypesSelect = 'alltypes';
var timestart = '6:00 AM';
var timeend = '3:00 AM';



// ---------------------------------------------------------------
// Start app; main page
// ---------------------------------------------------------------

// app.use(express.urlencoded())



app.get('/', function(req, res) {

    var output = {};
    // output.time = Date(Date.now()).toLocaleString();
    output.time = moment().tz("America/New_York").format("L, LT z");
    // console.log(output.time);

    fs.readFile('./public/index.html', "utf8", (error, data) => {
        var template = handlebars.compile(data);
        // output.meetings = result.rows
        var html = template(output);
        res.send(html)


    });



    // res.send(`<h1>Data Structures Final Assignments</h1>
    //                 <ul>
    //                 <li><a href="/aameetings">AA meetings data</a> </li>
    //                 <li><a href="/sensor">Sensor Data</a> </li>
    //                 <li><a href="/processblog">Process Blog</a> </li>
    //                 </ul>`);


});









// ---------------------------------------------------------------
// AA meeting data
// ---------------------------------------------------------------

app.get('/aameetings', function(req, res) {


    // SQL statements for aameetings buildingName
    // var aameetingQuery1 = "SELECT lat, long, json_agg(json_build_object('bldNm', buildingname, 'addr', address, 'time', timestart, 'name', meetingname, 'day', days, 'typ', meetingtype, 'wch', wheelchair)) as meetings\
    //              FROM aameetflat WHERE days = 'Mondays' and timestart >= '11:00 AM' GROUP BY lat, long;";
    var aameetingQuery1 = "SELECT lat, long, json_agg(json_build_object('bldNm', buildingname, 'addr', address, 'time', timestart, 'name', meetingname, 'day', days, 'typ', meetingtype, 'wch', wheelchair)) as meetings\
                 FROM aameetflat GROUP BY lat, long;";
    console.log(aameetingQuery1);
    // var aameetingQuery1 = "SELECT * FROM aameetflat;";
    // var aameetingQuery2 = "SELECT * FROM aalocations; ";
    var aameetingHtmlString = [];
    var output = {};

    // Connect to the AWS RDS Postgres database
    const client = new Client(db_credentials);
    client.connect();

    client.query(aameetingQuery1, (err, aares) => {
        if (err) { throw err }
        else {
            aares.rows.forEach(function(val) {
                aameetingHtmlString.push(JSON.stringify(val) + '<br><br>');
            })

            console.log("Number of table rows :" + aares.rows.length);

            client.end();
            var newstring = aameetingHtmlString.join(" ");
            // output.filtmeetdata = aameetingHtmlString;
            // console.log(output)
            // output.meetings =  aares.rows;
            // console.log(output)

            fs.readFile('./public/final1_aameet.html', "utf8", (error, data) => {
                // var template = handlebars.compile(data);
                // var html = template(output);
                // res.send(html)
                 res.send(data + 'Days: ' + meetdaysSelect +'<br>Times: '+ meettimesSelect + ' <br>Total no. locations: ' + aares.rows.length  +' <br><br> ' + newstring)
                // res.send(data + newstring)
            }); //fs.readFile
            aameetingHtmlString = [];
        }

    }); //client.query


}); //app.get






app.post('/aameetings', urlencodedParser, function(req, res) {

console.log(meetdaysSelect);
console.log(meettimesSelect);

    if (req.body.dayDropdownSelect) {
        meetdaysSelect = req.body.dayDropdownSelect;
        
    }

    if (req.body.timeDropdownSelect) {
        meettimesSelect = req.body.timeDropdownSelect;
        if (meettimesSelect == "morning") {
        timestart = '6:00 AM'; timeend = '12:00 PM';
        }
        else if (meettimesSelect == "midday") {
        timestart = '11:00 AM'; timeend = '5:00 PM';
        }
        else if (meettimesSelect == "evening") {
        timestart = '4:00 PM'; timeend = '9:00 PM';
        }
        else if (meettimesSelect == "night") {
        timestart = '8:00 PM'; timeend = '3:00 AM';
        }
    }


if (meetdaysSelect == "alldays" && meettimesSelect == "alltimes"){
    aameetingQuery1 = "SELECT lat, long, json_agg(json_build_object('bldNm', buildingname, 'addr', address, 'time', timestart, 'name', meetingname, 'day', days, 'typ', meetingtype, 'wch', wheelchair)) as meetings\
                 FROM aameetflat GROUP BY lat, long;";
}
else if (meetdaysSelect == "alldays" && meettimesSelect != "alltimes"){
    var aameetingQuery1 = "SELECT lat, long, json_agg(json_build_object('bldNm', buildingname, 'addr', address, 'time', timestart, 'name', meetingname, 'day', days, 'typ', meetingtype, 'wch', wheelchair)) as meetings\
                 FROM aameetflat WHERE timestart >= '"+ timestart + "' and timeend <= '"+ timeend + "' GROUP BY lat, long;";

} else if (meettimesSelect == "alltimes" && meetdaysSelect != "alldays"){
    var aameetingQuery1 = "SELECT lat, long, json_agg(json_build_object('bldNm', buildingname, 'addr', address, 'time', timestart, 'name', meetingname, 'day', days, 'typ', meetingtype, 'wch', wheelchair)) as meetings\
                 FROM aameetflat WHERE days = '" + meetdaysSelect + "' GROUP BY lat, long;";
} else {
    var aameetingQuery1 = "SELECT lat, long, json_agg(json_build_object('bldNm', buildingname, 'addr', address, 'time', timestart, 'name', meetingname, 'day', days, 'typ', meetingtype, 'wch', wheelchair)) as meetings\
                 FROM aameetflat WHERE days = '" + meetdaysSelect + "' and timestart >= '"+ timestart + "' or timestart <= '"+ timeend + "' GROUP BY lat, long;";
}

    console.log(aameetingQuery1);


    var aameetingHtmlString = [];

    // Connect to the AWS RDS Postgres database
    const client = new Client(db_credentials);
    client.connect();

    client.query(aameetingQuery1, (err, aares) => {
        if (err) { throw err }
        else {
            aares.rows.forEach(function(val) {
                aameetingHtmlString.push(JSON.stringify(val) + '<br><br>');
            })
            console.log("Number of table rows :" + aares.rows.length);

            client.end();
            var newstring = aameetingHtmlString.join(" ");

            fs.readFile('./public/final1_aameet.html', "utf8", (error, data) => {
                res.send(data + 'Days: ' + meetdaysSelect +'<br>Times: '+ meettimesSelect + ' <br>Total no. locations: ' + aares.rows.length  +' <br><br> ' + newstring)
            }); //fs.readFile
            aameetingHtmlString = [];
        }

    }); //client.query

    // res.send('Its working without values yet: ' + meetdaysSelect + ' ' + meettimesSelect  );
}); //app.post







// ---------------------------------------------------------------
// Sensor data
// ---------------------------------------------------------------
app.get('/sensor', function(req, res) {
    // res.send('<h3>this is the page for my sensor data</h3>');

    sensorHtmlString.push("<h1>IoT sensor data </h1>");
    sensorHtmlString.push("<a href='/'>Navigate to main page</a>");

    // Connect to the AWS RDS Postgres database
    const client = new Client(db_credentials);
    client.connect();

    client.query(sensorQuery1, (err, res1) => {
        if (err) { throw err }
        else {
            console.table(res1.rows);
            console.log(res1);
            keepresult.push(res1.rows[0].min);
            keepresult2.minval = res1.rows[0].min;
            console.log(keepresult);

            // nested query
            client.query(sensorQuery2, (err, res2) => {
                if (err) { console.log(err) }
                else {
                    console.table(res2.rows);
                    console.log(res2);
                    keepresult.push(res2.rows[0].count);
                    keepresult2.countval = res2.rows[0].count;
                    console.log(keepresult2);


                    client.query(sensorQuery3, (err, res3) => {
                        if (err) { console.log(err) }
                        else {
                            console.table(res3.rows);
                            console.log(res3);
                            keepresult3 = res3;
                            // keepresult.push(res3.rows[0].count);
                            // keepresult2.countval = res3.rows[0].count;
                            console.log("keepresult3 " + keepresult3);


                            // send query
                            sensorHtmlString.push("<p>The minimum temperature: " + keepresult2.minval)
                            sensorHtmlString.push("<br> The total amount of readings: " + keepresult2.countval)
                            keepresult3.rows.forEach(function(val) {
                                sensorHtmlString.push("<p>Temperature : " + val.tempsensor + " Time: " + val.dbtime.toLocaleString('en-US', { timeZone: 'America/New_York' }));

                            });
                            console.log(sensorHtmlString.join(" "));
                            res.send(sensorHtmlString.join(" "));
                            sensorHtmlString = [];

                        } //if else inner
                    }); //nested query


                } //if else inner


            }); //nested query
        } //ifelse outer
    }); //client.query


}); //sensor





// ---------------------------------------------------------------
// Sensor data 2
// ---------------------------------------------------------------
app.get('/sensor2', function(req, res) {
    // res.send('<h3>this is the page for my sensor data</h3>');
//  SQL statements for sensors: 
var sensorQuery4 = "SELECT MIN(tempsensor) FROM particlewave;"; // print all values
var sensorQuery5 = "SELECT COUNT (*) FROM particlewave;"; // print the number of rows
// var sensorQuery3 = "WITH t AS (SELECT * FROM particlewave ORDER BY DBtime DESC limit 20) SELECT * FROM t ORDER BY DBtime DESC ;";

// var sensorQuery6 = "SELECT EXTRACT(DAY FROM DBtime) as sensorday, AVG(tempsensor::int) as num_obs\
//              FROM particlewave GROUP BY sensorday ORDER BY sensorday;"
// 


// var sensorQuery6 =  "SELECT tempsensor2, (SELECT avg(t2.col) from weatherstation t2 where t2.timestamp >= weatherstation.timestamp and\
//               t2.timestamp < weatherstation.timestamp + interval '15 minute'        ) as future_15min_avg\
//             FROM weatherstation;"


//https://stackoverflow.com/questions/13818524/moving-average-based-on-timestamps-in-postgresql
// join table to itself in order to get moving average temperature values
// var sensorQuery6 = "SELECT l1.DBtime, AVG( l2.tempsensor2 )\
// FROM weatherstation \
//     l1 INNER JOIN weatherstation l2 ON l2.DBtime <= l1.DBtime AND \
//       l2.DBtime + INTERVAL '15 minutes' > l1.DBtime GROUP BY l1.DBtime ORDER BY DBtime DESC;"
var sensorQuery6 = "SELECT EXTRACT(hour FROM l1.DBtime) as sensorhour, MAX( l2.tempsensor2 )\
FROM weatherstation \
    l1 INNER JOIN weatherstation l2 ON l2.DBtime <= l1.DBtime AND \
      l2.DBtime + INTERVAL '60 minutes' > l1.DBtime GROUP BY sensorhour ORDER BY sensorhour DESC;"
            
            

console.log(sensorQuery6)
// var sensorQuery3 = "SELECT tempsensor, COUNT (*) FROM particlewave GROUP BY tempsensor;"; // print the number of rows for each sensorValue
var sensorHtmlString = [];
var keepresult = [];
var keepresult2 = {};
var keepresult3 = [];

    var output ={};
    
    
    sensorHtmlString.push("<h1>IoT sensor data </h1>");
    sensorHtmlString.push("<h1>Daily maximima</h1>");
    sensorHtmlString.push("<a href='/'>Navigate to main page</a>");

    // Connect to the AWS RDS Postgres database
    const client = new Client(db_credentials);
    client.connect();

    client.query(sensorQuery4, (err, res1) => {
        if (err) { throw err }
        else {
            console.table(res1.rows);
            // console.log(res1);
            keepresult.push(res1.rows[0].min);
            keepresult2.minval = res1.rows[0].min;
            // console.log(keepresult);

            // nested query
            client.query(sensorQuery5, (err, res2) => {
                if (err) { console.log(err) }
                else {
                    console.table(res2.rows);
                    // console.log(res2);
                    keepresult.push(res2.rows[0].count);
                    keepresult2.countval = res2.rows[0].count;
                    // console.log(keepresult2);


                    client.query(sensorQuery6, (err, res6) => {
                        if (err) { console.log(err) }
                        else {
                            console.table(res6.rows);
                            // console.log(res6);
                            keepresult3 = res6;
                            // keepresult.push(res3.rows[0].count);
                            // keepresult2.countval = res3.rows[0].count;
                            // console.log("keepresult3 " + keepresult3);


                            // send query
                            // sensorHtmlString.push("<p>The minimum temperature: " + keepresult2.minval)
                            sensorHtmlString.push("<br> The total amount of readings: " + keepresult2.countval)
                            keepresult3.rows.forEach(function(val) {
                                // sensorHtmlString.push("<p>Temperature : " + val.tempsensor + " Time: " + val.dbtime.toLocaleString('en-US', { timeZone: 'America/New_York' }));
                                sensorHtmlString.push("<p>Max Temp. : " + val.max + " Hour: " + val.sensorhour.toLocaleString('en-US', { timeZone: 'America/New_York' }));
                            // console.log(val)
                            });
                            // console.log(sensorHtmlString.join(" "));
                            res.send(sensorHtmlString.join(" "));
                            sensorHtmlString = [];

                        } //if else inner
                    }); //nested query


                } //if else inner


            }); //nested query
        } //ifelse outer
    }); //client.query


}); //sensor









// ---------------------------------------------------------------
// Process blog data
// ---------------------------------------------------------------
app.get('/processblog', function(req, res) {

    processHtmlString.push("<h1>Process blog data </h1>");
    processHtmlString.push("<a href='/'>Navigate to main page</a>");
    processHtmlString.push("<a href='/prblThoughts'>Thoughts</a>");
    processHtmlString.push("<a href='/prblIoT'>IoT</a>");
    processHtmlString.push("<a href='/prblAAmeetings'>AAmeetings</a>");
    processHtmlString.push("<a href='/prblProcessblog'>Processblog</a>");

    //     class BlogEntry {
    //   constructor(category, date, content, tags, imageurl, iwentto) {
    //     this.category = {};
    //     this.category.S = category.toString();
    //     this.date = {}; 
    //     this.date.S = new Date(date).toDateString();
    //     this.content = {};
    //     this.content.S = content;
    //     if (tags != null) {
    //       this.tags = {};
    //       this.tags.SS = tags; 
    //     }
    //     this.imageurl = {};
    //     this.imageurl.S = imageurl; 
    //     if (iwentto != null) {
    //       this.iwentto = {};
    //       this.iwentto.SS = iwentto; 
    //     }
    //     this.month = {};
    //     this.month.N = new Date(date).getMonth().toString();
    //   }
    // }

    var params = {
        TableName: "processblog",
        KeyConditionExpression: "#ct = :category and dt  between :minDate and :maxDate", // the query expression
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            "#ct": "category"
        },
        ExpressionAttributeValues: { // the query values
            ":category": { S: processBlReq },
            ":minDate": { N: new Date("Sep 25 2019").valueOf().toString() },
            ":maxDate": { N: new Date("Sep 29 2019").valueOf().toString() }
        }
    };


    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {
                console.log("***** ***** ***** ***** ***** \n", item);
                filteredBlogs.push(item);
            });
        }


        filteredBlogs.forEach(function(item) {
            processHtmlString.push("<div class=\"blogpost\">");
            processHtmlString.push("<p>Date: " + item.dtstring.S);
            processHtmlString.push("<p>Category: " + item.category.S);
            processHtmlString.push("<p>Content: " + item.content.S);
            processHtmlString.push("<p>imageurl: " + item.imageurl.S);
            processHtmlString.push("<p>Tags: " + item.tags.SS);
            processHtmlString.push("<p>I went to " + item.iwentto.SS);
            processHtmlString.push("</div>");
        });


        // console.log(sensorHtmlString.join(" "));
        // res.send(processHtmlString.join(" "));
        console.log(filteredBlogs);
        res.send(processHtmlString.join(" "));

        processHtmlString = [];
        filteredBlogs = [];

    });


}); //processblog

// ----------------add navigation-------------------------
// ------------------------------------------------------
app.get("/prblThoughts", function(req, res) {
    processBlReq = "Thoughts";
    processHtmlString = [];
    res.redirect("/processblog");
});
app.get("/prblIoT", function(req, res) {
    processBlReq = "IoT";
    processHtmlString = [];
    res.redirect("/processblog");
});
app.get("/prblAAmeetings", function(req, res) {
    processBlReq = "AAmeetings";
    processHtmlString = [];
    res.redirect("/processblog");
});
app.get("/prblProcessblog", function(req, res) {
    processBlReq = "Processblog";
    processHtmlString = [];
    res.redirect("/processblog");
});










// ---------------------------------------------------------------
// The rest 
// ---------------------------------------------------------------
// serve static files in /public
app.use(express.static('public'));

// listen on port 8080
app.listen(8080, function() {
    console.log('Server listening...');
});