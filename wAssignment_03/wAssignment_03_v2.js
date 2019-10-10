/* MSDV PGDV5110 Weekly Assignment 01

Created by A.C. Dreyer;  09/14/2019 */

// Note: much of the TAMU API interface code comes from supplied sample code.


// Dependencies
var request = require('request'); // npm install request
var async = require('async'); // npm install async
var fs = require('fs');
const dotenv = require('dotenv'); // npm install dotenv


// TAMU api key
const result = dotenv.config({ path: '../../.env' });
const apiKey = process.env.TAMU_KEY;

// Initialize variables
var TAMUnew = {};
var TAMUraw = [];
var count = 0;
var TAMUcontent = [];

// extract addresses from JSON file
var zoneFileName = './data/zone7AAmeetings'; //list of meetings (zone file)
var meetingContent = JSON.parse(fs.readFileSync(zoneFileName + ".json")); //Load meeting data
meetingContent = meetingContent.filter(function(x) { return x }); //Remove null entries
meetingContent = meetingContent.filter(value => Object.keys(value).length !== 0); //Remove empty entries
console.log("Total amount of meetings: " + meetingContent.length);


// Create a test case without API (comment out when doing TAMU API calls)
// var TAMUcontent = JSON.parse(fs.readFileSync("TAMUoutText.txt"));
// console.log(TAMUcontent);
// console.log("****** TAMU Geocode outputs ******");
// console.log("Refined address: " + TAMUcontent.InputAddress.StreetAddress);
// console.log("Latitude: " + TAMUcontent.OutputGeocodes[0].OutputGeocode.Latitude);
// console.log("Longitude: " + TAMUcontent.OutputGeocodes[0].OutputGeocode.Longitude);
// console.log("ResultType: " + TAMUcontent.FeatureMatchingResultType);
// console.log("ResultType: " + TAMUcontent.FeatureMatchingResultType);
// console.log("Statuscode: " + TAMUcontent.QueryStatusCodeValue);
// console.log("Matchscore: " + TAMUcontent.OutputGeocodes[0].OutputGeocode.MatchScore + " %");

// var first = true; //use this for testing code; loop just once



// Geocode addresses for zone (loop through each meeting in the zone)
// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(meetingContent, function(value, callback) {
    var apiRequest = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?';
    apiRequest += 'streetAddress=' + value.streetAddress.split(' ').join('%20');
    apiRequest += '&city=New%20York&state=NY&zip=' + value.zipcode + '&apikey=' + apiKey;
    apiRequest += '&format=json&version=4.01';

    count++;
    console.log("Request no. " + count + ": " + apiRequest);

    // if (first) {

    console.log(apiRequest);


// Do API request to TAMU
    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        else {
            var tamuGeo = JSON.parse(body);
            console.log(tamuGeo['FeatureMatchingResultType']);
    TAMUraw.push(tamuGeo);
    TAMUcontent = tamuGeo;  //this is redundant, but used for testing code without API call...
    
    
// Construct new object with only necessary fields
    TAMUnew = {
        lat: TAMUcontent.OutputGeocodes[0].OutputGeocode.Latitude,
        long: TAMUcontent.OutputGeocodes[0].OutputGeocode.Longitude,
        TAMUaddress: TAMUcontent.InputAddress.StreetAddress,
        MatchType: TAMUcontent.FeatureMatchingResultType,
        StatusCode: TAMUcontent.QueryStatusCodeValue,
        MatchScore: TAMUcontent.OutputGeocodes[0].OutputGeocode.MatchScore
    };
    // console.log(TAMUnew);
    // meetingsData.push(TAMUnew);
    value.GeoInfo = TAMUnew;        //add Geo Info to main dataset
    console.log(value);             //Log to console as a check
        }
    });
    setTimeout(callback, 2000);

    //     first = false;       // Use only when debugging code withou API call
    // } //end first iteration // Use only when debugging code withou API call

// Write out the files; a raw output and a refined output in meeting data
}, function() {
    fs.writeFileSync('./data/TAMUraw.json', JSON.stringify(TAMUraw, null, '\t'));
    fs.writeFileSync(zoneFileName + 'Geo.json', JSON.stringify(meetingContent, null, '\t'));
    console.log('*** *** *** *** ***');
    console.log('Number of meetings in this zone: ');
    console.log(meetingContent.length);
});
