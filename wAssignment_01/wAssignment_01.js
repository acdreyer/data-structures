/* MSDV PGDV5110 Weekly Assignment 01

Created by A.C. Dreyer;  08/30/2019 */


// npm install request      
// mkdir data                 

var request = require('request'); //include the request node.js module
var fs = require('fs'); //include the fs node.js module


// Initialize input url names of AA meetings
var urls = ['https://parsons.nyc/aa/m01.html',
    'https://parsons.nyc/aa/m02.html',
    'https://parsons.nyc/aa/m03.html',
    'https://parsons.nyc/aa/m04.html',
    'https://parsons.nyc/aa/m05.html',
    'https://parsons.nyc/aa/m06.html',
    'https://parsons.nyc/aa/m07.html',
    'https://parsons.nyc/aa/m08.html',
    'https://parsons.nyc/aa/m09.html',
    'https://parsons.nyc/aa/m10.html'
];

//Define Output text filenames
var fnamesTxtStart = './data/meetinglist';

//Define a function that reads html files online and write txt files to local disk
//Functionality is added to handle single or double digit filenames. 
//It is recommended to handle any amount of digits in future...
var readwritehtmls = function(j) {
    request(urls[j], function(error, response, body) { //request from sample code
        if (!error && response.statusCode == 200) {
            var nameext = j + 1         //counting file numbers
            if (nameext < 10) {         //check for single digit filename
                fs.writeFileSync(fnamesTxtStart + '0' +
                    nameext + '.txt', body); //write file with single digit name
            }
            else {                      //filename more than single digits
                fs.writeFileSync(fnamesTxtStart +
                    nameext + '.txt', body); //write file with double digit name
            };

        }
        else { console.log("Request failed!"); }
    });
};

// Loop through all the html files and call the readwrite function each time
for (var i = 0; i < (urls.length); i++) {
    var j = i;
    readwritehtmls(j);
};
