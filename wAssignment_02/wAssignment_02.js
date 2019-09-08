/* MSDV PGDV5110 Weekly Assignment 02

Created by A.C. Dreyer;  09/09/2019 */



// npm install cheerio


//--------------------Initialize---------------
// Initialize modules
var fs = require('fs'); //get required code module
var cheerio = require('cheerio'); //get required code module

// Initialize variables
// access directly from local environment (folder created in previous week's assignment)
var fNameInput = '../wAssignment_01/data/meetinglist07.txt' //filename
var counti = 0; //Table rows
var countj = 0; //Table columns
var thisAddress = '';   // Address
var thisZipCode = '';   // Zipcode
var addressCell = 'Address,City/State,Zipcode \n';   // Holding variable
var addressCelldebug = ''; // Holding variable
var timesColumn = '';   // To hold the lines of text
var thisDescr1 = '';    // To hold description 1
var thisDescr2 = '';    // To hold description 2

// Create an object constructor function for meeting data
// Technically an object constructor is overkill for this excercise
// but it helps to give structure for future...
function meeting(address, building, meetingName, zip, zone, time, type, descr1, descr2) {
    this.streetAddress = address;
    this.buildingName = building;
    this.meetingName = meetingName;
    this.zipcode = zip;
    this.zone = zone;
    this.time = time;
    this.meetingType = type;
    this.descr1 = descr1;
    this.descr2 = descr2;
}

var allMeetings = []; // Array array of meetings will be array of objects
//--------------------Initialize---------------




// Load the meeting text file into a variable, `content` and cheerio object
var content = fs.readFileSync(fNameInput);
// console.log(content);
var $ = cheerio.load(content);


// Split the tables into rows and columns
// First rows
$('tr').find('tr').find('tr').each(function(i, elem) { //Loop through the rows
    counti++; // row counter
    console.log(counti); // row counter
    allMeetings[counti] = new meeting(); // construct object in array


    countj = 0; //  column counter
    // console.log($(elem).find('td').length);

    $(elem).find('td').each(function(j, insideElem) { //Loop through the columns
        countj++; // column counter
        console.log(j);

        if (countj == 1) { //First column which contains location info

            //Extract each field in its own way by parsing the text...

            //Extract address
            var thisCellString = ($(insideElem).html()); //extract element html
            addressCelldebug += thisCellString + '\n' //append string for monitoring

            // Split the string in various ways to simplify parsing

            // Extract the location text (address and other text)
            var adressStart = thisCellString.search('</b><br'); //start of location text
            var adressEnd = thisCellString.search(/(<div)|(<span)/); //end of location text
            thisCellString = thisCellString.slice(adressStart, adressEnd).trim();

            // Split location text into address and other descriptions using regexp
            // Split the text into manageable chunks first 
            // trat (subsequent delimiters as single using /[]+/ )
            thisCellString = thisCellString.split('<br>').join(',').split(/[\t\n,-]+/);

            // Remove unnecessary whitespace and junky characters/fields
            thisCellString.forEach((k, n) => {
                if (k == ' ' | k == '</b>') {
                    thisCellString[n] = ''
                    console.log('Row: ' + i + ' deleted array entry ' + k);
                }
                else if (k.startsWith('Church')) { //Special case datapoint
                    thisCellString[n] = ''
                    allMeetings[counti].buildingName = k;
                    console.log('Row: ' + i + ' deleted array entry ->' + k + ' <- moved to bulding name');
                }
                else {
                    thisCellString[n] = k.trim() //Remove whitespace
                }
            });
            
            // Remove empty cells
            thisCellString = thisCellString.filter(Boolean);
            
            // Assign strings to "final" holding variables 
            thisAddress = thisCellString[0];
            thisDescr1 = thisCellString[1];
            thisDescr2 = thisCellString[2];
            // console.log(thisAddress);
            // console.log(thisDescr1);
            // console.log(thisDescr2);
            
            // Extract zip code
            thisZipCode = thisCellString[thisCellString.length-1]
            thisZipCode = thisZipCode.slice(thisZipCode.search(/\d{5}/));
            if (thisDescr1){thisDescr1=thisDescr1.replace(/\d{5}/,'')};
            if (thisDescr2){thisDescr2=thisDescr2.replace(/\d{5}/,'')};
            // Remove city/state 'NY'
            if (thisDescr1){thisDescr1=thisDescr1.replace('NY','')};
            if (thisDescr2){thisDescr2=thisDescr2.replace('NY','')};
            // console.log(thisDescr2);
            
            //append address and zip to text string for writing csv file
            // Hardcode the city NY...
            addressCell += [thisAddress + ',NY,' + thisZipCode + '\n']

            // Add all info to object
            allMeetings[counti].streetAddress = thisAddress;
            // console.log($(insideElem).html().indexOf('<br>'));
            allMeetings[counti].zipcode = thisZipCode;
            allMeetings[counti].buildingName = $(insideElem).find('h4').text();
            // console.log($(insideElem).find('h4').text());
            allMeetings[counti].meetingName = $(insideElem).find('b').text();
            // console.log($(insideElem).find('b').text());
            allMeetings[counti].zone = 7;
            allMeetings[counti].descr1 = thisDescr1;
            allMeetings[counti].descr2 = thisDescr2;
            
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
        // this.time = time;         //To be added later
        // this.meetingType = type;     //To be added later
        // this.descr1 = descr1;


        if (countj == 2) { //Second column
            timesColumn += ($(insideElem).html()) + '\n'
        };
    });

});

// Do final checks
console.log('Total amount of meetings: ' + (allMeetings.length-1));
console.log(allMeetings);

// Write out files
// fs.writeFileSync('./data/timesColumn.txt', timesColumn);   // do later
fs.writeFileSync('./data/zone7meetingsCSV.txt', addressCell);
// fs.writeFileSync('./data/addressCelldebug.txt', addressCelldebug); //only for debugging


// Write the array of objects to a json file.
// The following section of code is modifed from https://gyandeeps.com/json-file-write/
fs.writeFile("./data/zone7AAmeetings.json", JSON.stringify(allMeetings, null, 4), (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log("File has been created");
});



