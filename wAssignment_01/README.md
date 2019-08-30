## MSDV PGDV5110 Weekly assignment 01 
(due 08/30/2019 6pm)

### Summary:

This assignment uses Node.js to `request()` .html pages from an online location 
and then writes the html file body sections as text files to the local drive using `fs()`.

The code in this repo can theoretically be run on a local machine, 
but for various reasons Cloud9 services are used in this course.
Hence for assignment execution the "local" environment is implemented on 
Amazon Web Services (AWS) Cloud9.

The assignment serves as an introduction to using AWS, Node.js and Github
and forms the initial building block for use in a visualization tool.

### Documentation:

#### Introduction and Inputs:

The assignment is detailed in the [course github page](https://github.com/visualizedata/data-structures/blob/master/weekly_assignment_01.md).

Node.js requests are made using the Node.js "request" and "fs" modules to obtain Manhattan (New York) Alcholics Anonymous meeting Agendas from a web location.
The main input information is the web URL's for ten .html files that contain details of AA meetings; such as place names, days, times and addresses.

Sample code to do the request has been provided in the assignment [instructions](https://github.com/visualizedata/data-structures/blob/master/weekly_assignment_01.md).
The main value added by the student is to initialize inputs, loop the function and specify the output.

#### Description of function loop:

A key aspect of the solution is that the request to obtain the html files runs asynchronously in Javascript. 
Hence, running the sample code directly in a for loop would create issues when writing out the text files,
because the array index supplied to the request would not necessarily match file requests, 
which creates unexpected results.

Subsequently the use of function scope was chosen as the solution to solve the asynchronous callback.

The request(), which also includes the writeFileSync(), is therefore located in a separate function which is called from the for loop.
For each for loop iteration the request is made to the web location and the text file is written to the "local" disk.

Although function scope might not be the most elegant coding solution, it works well enough for a small dataset.
It is recommended to investigate solving the asynchronous callback issue in future using the [Async](https://www.npmjs.com/package/async) module. 
(See also [here](https://caolan.github.io/async/v3/docs.html)). 


#### Output:

The folder contains three main sets of files:
* The wAssignment_01.js code that makes the requests to obtain ten .html files.
* Ten meetinglist##.txt files that contain the body part of the .html meeting agendas.
* This README.md file



#### Notes and dependencies

The code in this folder can likely be used by external users, 
but is intented to be run on Cloud9 where all dependencies for development is already available.
If [async](https://www.npmjs.com/package/async) is used in future it would have to be made available as well.


