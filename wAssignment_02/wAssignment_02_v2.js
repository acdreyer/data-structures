/* MSDV PGDV5110 Weekly Assignment 02

Created by A.C. Dreyer;  09/09/2019
Updated 10/21/2019

This update adds additional parsing to the original assignment in order
to prepare for the final "product" by adding more fields to the json file;
i.e. parsing the meeting times as well
*/



// npm install cheerio


//--------------------Initialize---------------
// Initialize modules
var fs = require('fs'); //get required code module
var cheerio = require('cheerio'); //get required code module
var logstring = [];
// For parsing all 10 zones, do it manually by changing zone no.
// This isn't very elegant; a forEach could have been used, but since each file needs
// to be cleaning anyhow, we might as well do it file by file to make the task manageable

var zoneNo = '10';  //change this value for each zone...

if (zoneNo == 10){ 
    var zoneStr = '10';
} else {
    var zoneStr = '0' + zoneNo.toString(10);
};


// Initialize variables
// access directly from local environment (folder created in previous week's assignment)
var fNameInput = '../wAssignment_01/data/meetinglist' + zoneStr + '.txt' ;//filename
var counti = 0; //Table rows
var countj = 0; //Table columns
var thisAddress = ''; // Address
var thisZipCode = ''; // Zipcode
var addressCell = 'Address,City/State,Zipcode \n'; // Holding variable
var addressCelldebug = ''; // Holding variable
var timesColumn = ''; // To hold the lines of text
var thisDescr1 = ''; // To hold description 1
var thisDescr2 = ''; // To hold description 2



// Create an object constructor function for meeting data (not needed any more...)

// function meeting(address, building, meetingName, zip, zone, timesNtypes, descr1, descr2) {
//     this.streetAddress = address;
//     this.buildingName = building;
//     this.meetingName = meetingName;
//     this.zipcode = zip;
//     this.zone = zone;
//     this.timesNtypes = timesNtypes;
//     this.descr1 = descr1;
//     this.descr2 = descr2;
// }

var meeting = {};
var allMeetings = []; // Array array of meetings will be array of objects
//--------------------Initialize---------------






//--------------------User defined functions---------------
// Function to handle capitalization of meeting names
// Use of regexp to find words from 
// https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript/196991#196991
String.prototype.capitalize = function() {
    var chartemp = this;
    var chartemp =  chartemp.replace ( /\w\S*/g,
        function(txt) { 
            return txt.charAt(0).toUpperCase() + txt. substr(1).toLocaleLowerCase();
        });
            // chartemp.charAt(0).toUpperCase() + this.slice(1);
    chartemp = chartemp.replace('a.','A.');
    chartemp = chartemp.replace('(i)','(I)');
    chartemp = chartemp.replace('(ii)','(II)');
    chartemp = chartemp.replace('(iii)','(III)');
    chartemp = chartemp.replace('(Ii)','(II)');
    chartemp = chartemp.replace(/\s{2,}/,' ');    //whitespace
    chartemp = chartemp.replace('A.r.t.','A.R.T.');
    chartemp = chartemp.replace('o.b.e.r.','O.B.E.R.');
    chartemp = chartemp.replace('Y.e.s.','Y.E.S.');
    chartemp = chartemp.replace('T&a','T&A');
    return chartemp;
}



// Function to handle cleaning street names. 
// These are the simple corrections that are contained to a single field.
// Where data are moved across fields, it is done in the code and logged in logfile.
String.prototype.cleanstreet = function() {
    var chartemp = this;
    chartemp = chartemp.replace('E.','East');
    chartemp = chartemp.replace('E ','East ');
    chartemp = chartemp.replace('W.','West');
    chartemp = chartemp.replace('W ','West ');
    chartemp = chartemp.replace('west ','West ');
    chartemp = chartemp.replace('St.','Street');
    chartemp = chartemp.replace('Strert','Street');
    chartemp = chartemp.replace('STREET','Street');
    chartemp = chartemp.replace('street','Street');
    chartemp = chartemp.replace('Eastr','East');
    if (chartemp == '331 East 70th St'){ chartemp = '331 East 70th Street'
        logstring.push('Corrected data: ' + chartemp + '\n')
    };
    if (chartemp == '80 Street Mark&apos;s Place'){ chartemp = '80 St. Mark&apos;s Place'
        logstring.push('Corrected data: ' + chartemp + '\n')
    };
    if (chartemp == '521 West 126th St'){ chartemp = '521 West 126th Street'
        logstring.push('Corrected data: ' + chartemp + '\n')
    };
    if (chartemp == '502 West165th Street'){ chartemp = '502 West 165th Street'
        logstring.push('Corrected data: ' + chartemp + '\n')
    };
    if (chartemp == '189th Street &amp; Bennett Avenue'){ chartemp = '178 Bennett Avenue'
        logstring.push('Corrected data: ' + chartemp + '\n')
    };
    return chartemp;
}


String.prototype.cleanzip = function(){
    var chartemp = this;
    if (chartemp == "Y" && zoneNo == 1){ 
        chartemp = 10007
        logstring.push('Cleaned data add zip: ' + chartemp + '\n')
    }
        if (chartemp == "h" && zoneNo == 2){ 
        chartemp = 10014
        logstring.push('Cleaned data add zip: ' + chartemp + '\n')
    }
    if (chartemp == ")" && zoneNo == 6){ 
        chartemp = 10023
        logstring.push('Cleaned data add zip: ' + chartemp + '\n')
    }
    return chartemp;
}

String.prototype.cleanbuildingname = function(){
    var chartemp = this;
    chartemp = chartemp.replace('Cernter','Center');
    return chartemp;
}
String.prototype.cleanCellstring = function(){
    var chartemp = this;
    // logstring.push('Cleaned data: ' + chartemp + '\n')
    chartemp = chartemp.replace('206-208 East 11th Street','206 East 11th Street'); //zone 3
    chartemp = chartemp.replace('303 West 42nd St Rm 306','303 West 42nd Street -Room 306'); //zone 4
    chartemp = chartemp.replace('4 West 76th Street. Meeting in the gym.','4 West 76th Street -Meeting in the gym'); //zone 6
    chartemp = chartemp.replace('Central Park West &amp; 76th Street','160 Central Park West'); //zone 6
    chartemp = chartemp.replace('58-66 West 135th Street','58 West 135th Street'); //zone 8
    chartemp = chartemp.replace('701 West 168th Street @ Fort Washington Avenue','701 West 168th Street -@ Fort Washington Avenue'); //zone 8
    return chartemp;
}
//--------------------User defined functions---------------






// Load the meeting text file into a variable, `content` and cheerio object
var content = fs.readFileSync(fNameInput);
// console.log(content);
var $ = cheerio.load(content);


// -----------------Split the tables into rows and columns---------
// -----------First rows
$('tr').find('tr').find('tr').each(function(i, elem) { //Loop through the rows
    counti++; // row counter
    console.log('****************' + 'Row' + counti); // row counter
    allMeetings[counti] = {}; //new meeting(); // construct object in array


    countj = 0; //  column counter
    // console.log($(elem).find('td').length);
    // console.log($(elem).html());
    var wheelchairaccess = false;


//Loop through the columns
    $(elem).find('td').each(function(j, insideElem) { 
        countj++; // column counter
        console.log(j);

        if (countj == 1) { //First column which contains location info

            //Extract each field in its own way by parsing the text...

            //Extract address
            var thisCellString = ($(insideElem).html()); //extract element html
            addressCelldebug += thisCellString + '\n' //append string for monitoring
            // console.log(addressCelldebug)
            
            if (thisCellString.search("Wheelchair") != -1){ wheelchairaccess = true};
            console.log('wheelchairaccess: ' + wheelchairaccess);
            

            // Split the string in various ways to simplify parsing

            // Extract the location text (address and other text)
            var adressStart = thisCellString.search('</b><br'); //start of location text
            var adressEnd = thisCellString.search(/(<div)|(<span)/); //end of location text
            thisCellString = thisCellString.slice(adressStart, adressEnd).trim();
            // console.log(thisCellString)


            
            
// -------------------------------------------------------------------------------
            // Split location text into address and other descriptions using regexp
            // Split the text into manageable chunks first 
            // treat (subsequent delimiters as single using /[]+/ )
            // Clean the data with special cases
            thisCellString = thisCellString.cleanCellstring();
            thisCellString = thisCellString.split('<br>').join(',').split(/[\t\n,-]+/);
            // console.log(thisCellString)
            // Remove unnecessary whitespace and junky characters/fields
            thisCellString.forEach((k, n) => {
                if (k == ' ' | k == '</b>') {
                    thisCellString[n] = ''
                    console.log('Row: ' + i + ' deleted array entry ' + k);
                    logstring.push('Row ' + i + ' excluded data: ' + k + '\n')
                }
                else if (k.startsWith('Church')) { //Special case datapoint
                    thisCellString[n] = ''
                    allMeetings[counti].buildingName = k;
                    console.log('Row: ' + i + ' deleted array entry ->' + k + ' <- moved to bulding name');
                    logstring.push('Row ' + i + 'moved data: ' + k + '\n')
                }
                else if (k.trim().endsWith('Street (Basement)')) { //Special case datapoint
                    thisCellString[n] = k.replace('(Basement)','').trim()
                    thisDescr2 = '(Basement)';
                    logstring.push('Split and Moved data: ' + k + '\n')
                }
                else if (k.endsWith('Street (Red Door')) { //Special case datapoint
                    thisCellString[n] = k.replace('(Red Door','').trim()
                    thisCellString[n+1]= '(Red Door' + thisCellString[n+1]; //add to beginning
                    logstring.push('Split and Moved data: ' + k + '\n')
                }
                else if (k == '206-208 East 11th Street') { //Special case datapoint
                    thisCellString[n] = k.replace('-208','').trim()
                    logstring.push('Split data to 206: ' + k + '\n')
                }
                else {
                    thisCellString[n] = k.trim() //Remove whitespace
                }
            });
// ------------------------------------------------------------------------





            // Remove empty cells
            thisCellString = thisCellString.filter(Boolean);
            console.log(thisCellString);
            
            // Assign strings to "final" holding variables 
            thisAddress = thisCellString[0].cleanstreet();
            thisDescr1 = thisCellString[1];
            if (thisCellString[2]) {
            thisDescr2 += thisCellString[2]};
            console.log(thisAddress);
            // console.log(thisDescr1);
            // console.log(thisDescr2);


            // Extract zip code
            thisZipCode = thisCellString[thisCellString.length - 1];
            thisZipCode = thisZipCode.slice(thisZipCode.search(/\d{5}/)).cleanzip();
            if (thisDescr1) { thisDescr1 = thisDescr1.replace(/\d{5}/, '') };
            if (thisDescr2) { thisDescr2 = thisDescr2.replace(/\d{5}/, '') };
            // Remove city/state 'NY'
            if (thisDescr1) { thisDescr1 = thisDescr1.replace('NY', '') };
            if (thisDescr2) { thisDescr2 = thisDescr2.replace('NY', '') };
            if (thisDescr1) { thisDescr1 = thisDescr1.replace('(','').replace(')','').trim() };
            if (thisDescr2) { thisDescr2 = thisDescr2.replace('(','').replace(')','').trim() };
            
            
            // console.log(thisDescr2);


            //append address and zip to text string for writing csv file
            // Hardcode the city NY...
            addressCell += [thisAddress + ',NY,' + thisZipCode + '\n']



            // Add all other info to object
            allMeetings[counti].streetAddress = thisAddress;
            // console.log($(insideElem).html().indexOf('<br>'));
            allMeetings[counti].zipcode = thisZipCode;
            allMeetings[counti].buildingName = $(insideElem).find('h4').text().cleanbuildingname();
            // console.log($(insideElem).find('h4').text());
            
            
            // Clean up the names
            var meetingnametemp = $(insideElem).find('b').text().toLowerCase();
            meetingnametemp = meetingnametemp.replace(':','');
            meetingnametemp = meetingnametemp.split('-')[0].trim().capitalize();
            allMeetings[counti].meetingName = meetingnametemp.split('-')[0].trim().capitalize();
            // console.log($(insideElem).find('b').text());
            allMeetings[counti].wheelchairacc = wheelchairaccess;
            
            allMeetings[counti].zone = zoneNo;
            allMeetings[counti].descr1 = thisDescr1;
            allMeetings[counti].descr2 = thisDescr2;
            allMeetings[counti].timesNtypes = {};


            // Reset all variables for in case next row is undefined
            thisAddress = '';
            thisZipCode = '';
            thisCellString = [];
            thisDescr1 = '';
            thisDescr2 = '';
        };

        // Recall that the object fields are as follows:
        // this.streetAddress = address;    //added
        // this.buildingName = building;    //added
        // this.meetingName = meetingName;    //added
        // this.zipcode = zip;      //added
        // this.zone = zone;        //added
        // this.timesNtypes = timeNtypes;         //added 
        // this.descr1 = descr1;


        if (countj == 2) { //Second column
            thisCellString = $(insideElem).text().split(/[\t\n]+/).filter(Boolean); 
            
            // note; in future try using the more concise method .map(item => item.trim()).filter(Boolean)
                        thisCellString.forEach((k, n) => {
                if (k == ' ' | k == '</b>') {
                    thisCellString[n] = ''
                    console.log('Row: ' + i + ' deleted array entry ' + k);
                    logstring.push('Row: ' + i + ' excluded data: ' + k +'\n');
                }
                else {
                    thisCellString[n] = k.trim() //Remove whitespace
                }
            });

            // Remove empty cells
            thisCellString = thisCellString.filter(Boolean);
            // console.log(thisCellString);
            
            // Loop through the meeting times&types
            thisCellString.forEach(function(elem,ii){
                
                // console.log(elem.split(' ').filter(Boolean));
                var tempstring = elem.split(' ').filter(Boolean);
                // console.log(tempstring[0]);
                // console.log(tempstring[2]);
                // console.log(tempstring[5]);
                // console.log(tempstring[9]);
                
                var tempobj = {};
                tempobj.datemeet = tempstring[0];
                allMeetings[counti].timesNtypes[ii] = tempobj;
                allMeetings[counti].timesNtypes[ii].timestart = tempstring[2] + ' ' + tempstring[3];
                allMeetings[counti].timesNtypes[ii].timeend = tempstring[5]+ ' ' + tempstring[6];
                
                
                if (elem.indexOf('Type') != -1){
                allMeetings[counti].timesNtypes[ii].meettype = elem.slice(elem.indexOf('Type')+4,elem.indexOf('=')).trim()}
                else { allMeetings[counti].timesNtypes[ii].meettype ='null'};
                
                if (elem.indexOf('Special Interest') != -1){
                allMeetings[counti].timesNtypes[ii].meetspecial = elem.slice(elem.indexOf('Special Interest')+16,elem.length).trim().replace(',','')}
                else { allMeetings[counti].timesNtypes[ii].meetspecial ='null'};
                
            //   console.log(elem.indexOf('Type'));
               
                
                
                
            });
            
            //  console.log(allMeetings[counti]);
            timesColumn += thisCellString + '\n';
            // console.log(thisCellString);




        };
    });

});

// Do final checks
console.log('Total amount of meetings: ' + (allMeetings.length - 1));
console.log(allMeetings);

// Write out files
fs.writeFileSync('./data/timesColumnZone' + zoneStr +'.txt', timesColumn);   // do later
fs.writeFileSync('./data/zone' + zoneStr + 'meetingsCSV.txt', addressCell);
// fs.writeFileSync('./data/addressCelldebug' + zoneStr + '.txt', addressCelldebug); //only for debugging
fs.writeFileSync('./data/logfileZone' + zoneStr +'.txt', logstring); 

// Write the array of objects to a json file.
// The following section of code is modifed from https://gyandeeps.com/json-file-write/
fs.writeFile("./data/zone" + zoneStr + "AAmeetings.json", JSON.stringify(allMeetings, null, 4), (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log("File for zone " + zoneNo.toString(10) + " has been created");
});


// console.log(logstring)