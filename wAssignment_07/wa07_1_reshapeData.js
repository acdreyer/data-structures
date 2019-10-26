// This script reshapes the individual AA meeting zone files and objects for
// entry into the database. A flat object structure is made and pooled into one
// one .json file. The location table will be shaped when adding into PostgreSQL



var fs = require('fs'); //get required code module
const async = require('async');

var zonecount = 0;
var locationcount = 0;
var meetcount = 0;
var lockeyCount = 0;
var zones = [1,2,3,4,5,6,7,8,9,10];
// var zones = [10];
var meetingflatAll =[];
var locationsAll = [];

// for (let zoneNo = 1; zoneNo <= 10; zoneNo++) { //change this value for each zone...


// Loop through the chosen zones
async.forEachOf(zones,function(thiszone,key,callback){

    zonecount++;
    var meetings;
    var meetingflat = [];
    
    // setup the string for files
    if (thiszone == 10) { var zoneStr = '10';  }
    else {  var zoneStr = '0' + thiszone.toString(10);    };


    try {
     meetings = require('../wAssignment_03/data/zone' + zoneStr + 'AAmeetingsGeo.json');
    }
    catch (err){console.log(err)}
    finally {

    meetings.forEach(function(val, indx) {

        locationcount++;

        Object.keys(val.timesNtypes).forEach(function(key) {
            var newObj = {};
            var newLoc ={};
            newObj.zone = val.zone;
            newObj.streetAddress = val.streetAddress;
            newObj.lat = val.GeoInfo.lat;
            newObj.long = val.GeoInfo.long;
            newObj.zipcode = val.zipcode;
            newObj.meetingName = val.meetingName;
            newObj.timestart = val.timesNtypes[key].timestart;
            newObj.timeend = val.timesNtypes[key].timeend;
            newObj.datemeet = val.timesNtypes[key].datemeet;
            newObj.meettype = val.timesNtypes[key].meettype;
            newObj.meetspecial = val.timesNtypes[key].meetspecial;

            if (val.buildingName != undefined && val.buildingName != '') {
                newObj.buildingName = val.buildingName;
            }
            else { newObj.buildingName = "null" }
            newObj.wheelchair = val.wheelchairacc;
            if (val.descr1 != undefined && val.descr1 != '') {
                newObj.descr1 = val.descr1;
            }
            else {
                newObj.descr1 = "null";
            };
            if (val.descr2 != undefined && val.descr2 != '') { newObj.descr2 = val.descr2; }
            else {
                newObj.descr2 = "null";
            };
            
            
            // setup the locations as well by adding ones that have't been added
            // filter the list to check if the latitude and longitude already exists
            var result = locationsAll.filter(e => (e.lat == val.GeoInfo.lat && e.long == val.GeoInfo.long));
            if (result == ''){ 
                lockeyCount ++; // count the locations for location primary key
                newObj.fn_key = lockeyCount;    // add the foreign key to meetings
                
                locationsAll.push({
                    id:lockeyCount,
                    streetAddress:val.streetAddress,
                    lat:val.GeoInfo.lat,
                    long:val.GeoInfo.long}) 
            }
            else {
                newObj.fn_key = result[0].id;     // add foreign key to meetings
            } 
            
            meetingflat.push(newObj);
            meetingflatAll.push(newObj);
            // console.log(newObj);
            meetcount++;
        }); //timesNtypes loop

    }); //meetings.forEach loop
    console.log(meetingflat)
    




    // Write files for individual zones
    fs.writeFile("./data/zone" + zoneStr + "AAmeetings.json", JSON.stringify(meetingflat, null, 4), (err) => {
        if (err) {
            console.error(err);
            return;
        };
    });
    // fs.writeFile("./data/zone" + zoneStr + "AAlocations.json", JSON.stringify(locationsAll, null, 4), (err) => {
    //     if (err) {
    //         console.error(err);
    //         return;
    //     };
    // });
    
    };  //finally
    

}); //async forEach

    // Write files for all zones
    fs.writeFile("./data/AAmeetingsAllZones.json", JSON.stringify(meetingflatAll, null, 4), (err) => {
        if (err) {
            console.error(err);
            return;
        };
    });
    fs.writeFile("./data/AAlocationsAllZones.json", JSON.stringify(locationsAll, null, 4), (err) => {
        if (err) {
            console.error(err);
            return;
        };
    });

console.log('Total amount of zones: ' + zonecount)
console.log('Total amount of locations: ' + locationcount)
console.log('Total amount of meetings: ' + meetcount)





