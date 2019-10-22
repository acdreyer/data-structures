var fs = require('fs'); //get required code module



var zoneNo = '9';  //change this value for each zone...

if (zoneNo == 10){ 
    var zoneStr = '10';
} else {
    var zoneStr = '0' + zoneNo.toString(10);
};


var meetings = require('../wAssignment_03/data/zone' + zoneStr + 'AAmeetingsGeo.json');
var meetingflat =[];
// var newObj = {};


meetings.forEach(function(val,indx){
    
    Object.keys(val.timesNtypes).forEach(function (key) {
        var newObj = {};
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
        newObj.buildingName = val.buildingName;
        newObj.wheelchair = val.wheelchairacc;    
        newObj.descr1 = val.descr1; 
        newObj.descr2 = val.descr2; 
        meetingflat.push(newObj)
        // console.log(newObj);
    });

});
console.log(meetingflat)




fs.writeFile("./data/zone" + zoneStr + "AAmeetings.json", JSON.stringify(meetingflat, null, 4), (err) => {
    if (err) {
        console.error(err);
        return;
    };
});