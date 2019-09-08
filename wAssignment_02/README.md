## MSDV PGDV5110 Weekly assignment 02 
(due 09/09/2019 6pm)

### Summary:

This task builds on the previous week's assignment whereby previous
retrieved .html files are parsed using node.js and [cheerio](https://www.npmjs.com/package/cheerio).

The assignment serves to navigate the html DOM in order to extract information from 
"messy" html data. 

The code is intended to run on Amazon Web Services (AWS) Cloud9, with cheerio installed.

### Documentation:

#### Introduction and Inputs:

The assignment is detailed in the [data structures course github page](https://github.com/visualizedata/data-structures/blob/master/weekly_assignment_02.md).

Local copies of Manhattan (New York) Alcholics Anonymous meeting Agenda web pages are used, 
with pages (area zones) assigned to each student according to student number.
Hence **Zone 7** was used for this code (i.e. a single .html file).

The .html file elements has various deficiencies, including inline formatting without proper classes or id's assigned to element tags.
Furthermore; some fields are incomplete and/or inconsistent. This makes data more difficult to process. 

Manual manipulation of the source file was not allowed.

#### Description of details:

Sample code was again supplied in the [data structures course github page](https://github.com/visualizedata/data-structures/blob/master/weekly_assignment_02.md)
with explanation of using cheerio. The code was modified and various functionality added.
The cheerio module could not be used optimally due to lack of the .html structure and element identifiers.
Subsequently .html tags of `'tr'` were used to a level as close to the data set as cheerio could go.
It became apparent that `'td'` table cells could not be accessed directly using cheerio commands. This seems to be a limitation of cheerio.

It was decided to use the `$().html()` method to extract the relevant data cells.
The table .html was identified using three levels of `'tr'` tags using the cheerio `.find(tr)` method.
A search was done by iterating through the table rows and then the columns.
Strictly speaking the table iteration was not necessary, since one could just as well 
have split up the strings alone, however it was deemed useful and tidy to have the data 
from each cell in a separate block.

The data is extracted using a combination of `.search()`, `.slice()`, `.trim()` 
and `.split()` string methods using Javascript regular expressions (RegExp) and string identifiers.
The `/[\t\n,-]+/` expression was used to split strings along tabs, newline and ',' characters.
Note that the `+` RegExp allowed consecutive characters to be merged.

Furthermore, since the .html was extracted from cheerio, the element tag strings
`<b>`, `<br>`, `<div>` and `<span>` was also used to "manually" parse .html code.

#### Output:

The output was an ordered data set including the major aspects of the meeting 
information. Data was stored in an array of objects, each including the following
(according to the object template):

``` 
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
```

The meeting time and type fields are currently not populated, since only addresses
are required at this moment. 
The "descr1" and "descr2" fields are used for informal location instructions
that were present in the original .html file.

The street address data was then stored in a CSV text file, as well as a JSON
file.

The folder contains four files:
* This README.md file
* The wAssignment_02.js code that does the parsing.
* One zone7meetingsCSV.txt files in the ./data subfolder.
* One zone7meetings.json files in the ./data subfolder. 




#### Notes and dependencies

The code in this folder can likely be used by external users, 
but is intented to be run on Cloud9 where all dependencies for development is already available.
[Cheerio](https://www.npmjs.com/package/cheerio) is required.

