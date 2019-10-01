
/* MSDV PGDV5110 Weekly Assignment 05

Created by A.C. Dreyer;  09/30/2019 */
// Note: much of the interface code comes from assignment supplied sample code.


// npm install aws-sdk

var blogEntries = [];
var async = require('async');

// Specify the structure of the Blog Entry
class BlogEntry {
  constructor(category, date, content, tags, imageurl, iwentto) {
    this.category = {};
    this.category.S = category.toString();
    this.date = {}; 
    this.date.S = new Date(date).toDateString();
    this.content = {};
    this.content.S = content;
    if (tags != null) {
      this.tags = {};
      this.tags.SS = tags; 
    }
    this.imageurl = {};
    this.imageurl.S = imageurl; 
    if (iwentto != null) {
      this.iwentto = {};
      this.iwentto.SS = iwentto; 
    }
    this.month = {};
    this.month.N = new Date(date).getMonth().toString();
  }
}


blogEntries.push(new BlogEntry('Thoughts', '09-25-2019'));


// Create the entries manually *this might have be automated in future...

blogEntries.push(new BlogEntry('Thoughts', '09-25-2019', 
"Yesterday one of the topics covered in class was the information lens. An example used was the google AI drum machine. https://experiments.withgoogle.com/ai/drum-machine/view/. Then on the subway a guy played drums on the train using buckets, the handrail and a harmonica. Something worth visualizing…", 
["InfoLens", "Percussion"],
"https://github.com/acdreyer/data-structures/blob/master/wAssignment_05/images/20190925_drums.png",
["Subway"]));


blogEntries.push(new BlogEntry('AAmeetings', '09-26-2019', 
"After a week of viz I discovered that SQL queries and R subsets of dataframes have something in common.", 
["InfoLens", "Percussion"],
"https://github.com/acdreyer/data-structures/blob/master/wAssignment_05/images/20190926_R.png",
["Subway"]));

blogEntries.push(new BlogEntry('IoT', '09-27-2019', 
"It seems like pharmacies don’t like to sell data loggers without doctor’s orders *sigh… Luckily there is some reflection that can be done.", 
["datalogging"],
"https://github.com/acdreyer/data-structures/blob/master/wAssignment_05/images/20190927_reflections.png",
["CVS","Central Park"]));

blogEntries.push(new BlogEntry('Thoughts', '09-28-2019', 
"National Geographic visualizing the top dogs. I wonder if this is stored in a relational database.", 
["dogs", "relationalDB"],
"https://github.com/acdreyer/data-structures/blob/master/wAssignment_05/images/20190928_natgeo.png",
["Subway"]));

blogEntries.push(new BlogEntry('Thoughts', '09-29-2019', 
"The medieval faire at the Cloisters is some good research to bolster MET Qualitative data viz research. What is the quality of the armour?", 
["Qualitative"],
"https://github.com/acdreyer/data-structures/blob/master/wAssignment_05/images/20190929_medieval.png",
["Cloisters"]));

blogEntries.push(new BlogEntry('Thoughts', '09-30-2019', 
"This is not a horizontal data structure.", 
["structure"],
"https://github.com/acdreyer/data-structures/blob/master/wAssignment_05/images/20190930_structure.png",
["Columbus Circle"]));

// Check that it is correct
console.log(blogEntries);


// // // ---------------------------------------------------------


var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();


// Use async to loop through the dataset
async.eachSeries(blogEntries, function(value, callback) {
    
var params = {};
params.Item =value; 
params.TableName = "processblog";

console.log( params.Item);

dynamodb.putItem(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
    setTimeout(callback, 1000); 
}); 



