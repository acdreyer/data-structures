
/* MSDV PGDV5110 Weekly Assignment 05

Created by A.C. Dreyer;  09/30/2019 */
// Note: much of the interface code comes from assignment supplied sample code.


// npm install aws-sdk

var blogEntries = [];
var async = require('async');

// Specify the structure of the Blog Entry
class BlogEntry {
  constructor(category, dt, content, tags, imageurl, iwentto) {
    this.category = {};
    this.category.S = category.toString();
    this.dt = {}; 
    this.dt.N = new Date(dt).valueOf().toString();
    this.dtstring = {}; 
    this.dtstring.S = new Date(dt).toDateString();
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
    this.month.N = new Date(dt).getMonth().toString();
  }
}


// blogEntries.push(new BlogEntry('Thoughts', '09-25-2019'));


// Create the entries manually *this might have be automated in future...

blogEntries.push(new BlogEntry('Thoughts', '09-25-2019 08:00:00', 
"Yesterday one of the topics covered in class was the information lens. An example used was the google AI drum machine. https://experiments.withgoogle.com/ai/drum-machine/view/. Then on the subway a guy played drums on the train using buckets, the handrail and a harmonica. Something worth visualizing…", 
["InfoLens", "Percussion"],
"https://github.com/acdreyer/data-structures/blob/master/wAssignment_05/images/20190925_drums.png",
["Subway"]));


blogEntries.push(new BlogEntry('AAmeetings', '09-26-2019', 
"After a week of viz I discovered that SQL queries and R subsets of dataframes have something in common.", 
["InfoLens", "Percussion"],
"https://github.com/acdreyer/data-structures/blob/master/wAssignment_05/images/20190926_R.png",
["Subway"]))


blogEntries.push(new BlogEntry('IoT', '09-27-2019', 
"It seems like pharmacies don't like to sell data loggers without doctor's orders *sigh… Luckily there is some reflection that can be done.", 
["datalogging"],
"https://github.com/acdreyer/data-structures/blob/master/wAssignment_05/images/20190927_reflections.jpg",
["CVS","Central Park"]));

blogEntries.push(new BlogEntry('Thoughts', '09-28-2019', 
"National Geographic visualizing the top dogs. I wonder if this is stored in a relational database.", 
["dogs", "relationalDB"],
"https://github.com/acdreyer/data-structures/blob/master/wAssignment_05/images/20190928_natgeo.jpg",
["Subway"]));

blogEntries.push(new BlogEntry('Thoughts', '09-29-2019', 
"The medieval faire at the Cloisters is some good research to bolster MET Qualitative data viz research. What is the quality of the armour?", 
["Qualitative"],
"https://github.com/acdreyer/data-structures/blob/master/wAssignment_05/images/20190929_medieval.jpg",
["Cloisters"]));

blogEntries.push(new BlogEntry('Thoughts', '09-30-2019', 
"This is not a horizontal data structure.", 
["structure"],
"https://github.com/acdreyer/data-structures/blob/master/wAssignment_05/images/20190930_structure.jpg",
["Columbus Circle"]));


blogEntries.push(new BlogEntry('Processblog', '10-01-2019', 
"Today was mostly spent figuring out the nuances of using the dynamoDB primary keys, which are basically split into the partition key and the sort key. It seems like Amazon defined the sort key as an extension of their logic of making composite keys from various bits of information; user email addresses, transaction ID's etc. These paramaters are then concatenated into one big string which can again be broken up by queries. For example, a primary key could have been made up by userid-transactionid-date, which ensures a unique primary key. The query would then search on the primary key by looking at the start or end of the string using ENDWITH or STARTWITH commands (syntax to be confirmed). Hence, the logic of adding a sort key basically just extends this method of making composite primary keys.", 
["primary key","composite key","sort key"],
'NULL',
["Central Park"]));



blogEntries.push(new BlogEntry('Processblog', '10-02-2019', 
"Today was submit date for assignment 5, luckily I complete it last night. Nice car parked outside class today.", 
["assignment"],
"https://github.com/acdreyer/data-structures/blob/master/wAssignment_05/images/20191002_144309.jpg",
["Central Park"]));


blogEntries.push(new BlogEntry('Thoughts', '10-04-2019', 
"Today I went to the UN building. It makes me think that even despite humanity's best intentions and great technical knowledge, we are still unable to solve some of the simplest of issues; loving thy neighbour.", 
["Peace"],
"https://github.com/acdreyer/data-structures/blob/master/wAssignment_05/images/20191004_211908.jpg",
["The UN building"]));



blogEntries.push(new BlogEntry('Processblog', '10-04-2019', 
"Georgia Lupi had a talk today at the Newschool as part of Creative mornings. What struck me about her project of \"Dear data\" is the idea that almost everything can be made into data; e.g. what you ate today, how many times you smiled, things that made you feel an emotion. It got me wondering if there isn't some level of value to record all these things; what patterns we will discover about ourselves. In the movie of The Matrix, there is an inscription above the doorway at the Oracle's kitchen door; -Temet Nosce-, which means -Know thyself-. Socrates said that the unexamined life is not worth living. With data recording becoming more personal, these notions are indeed more attainable on some levels, however would it necessarily be good if we recorded everything about ourselves? I am intrigued to know how Georgia Lupi felt sharing such personal information to the public. If our whole lives were shown as a movie on a DVD, would we really want others to watch it?", 
["personal data"],
"https://github.com/acdreyer/data-structures/blob/master/wAssignment_05/images/20191004_091414.jpg",
["Newschool centennial"]));


blogEntries.push(new BlogEntry('Thoughts', '10-06-2019', 
"The Newschool centennial talk at Ellis Island was eye-opening. It was interesting to note the peopling of America and the focus on narratives, so afterward on the Ferry I told a story to the Professor. Once I attended a group discussion where people had to share their most challenging experience. One guy shared on his personal difficulties about his girlfriend not replying to his messages. Another guy from the Congo told the story of how his mother was killed in an attack on their convoy. Sometimes all you need is a bit of perspective.", 
["Immigration"],
"https://github.com/acdreyer/data-structures/blob/master/wAssignment_05/images/20191006_203742.jpg",
["Ellis Island"]));


blogEntries.push(new BlogEntry('Thoughts', '10-07-2019', 
"There opened an exhibition on the Last Knight at the MET. The armour is exquisite.", 
["Armour"],
"https://github.com/acdreyer/data-structures/blob/master/wAssignment_05/images/20191007_170946.jpg",
["The MET"]));


blogEntries.push(new BlogEntry('AAmeetings', '10-09-2019', 
"Some additional parsing needs to be done on the AA meeting data in order to get it database friendly. Originally the table was extracted, but the days and times weren't parsed. In order to make the tables and queries good, these were now added. Luckily today is a good day to catch up on data structures. Real coding weather and no class.", 
["Rainy"],
"https://github.com/acdreyer/data-structures/blob/master/wAssignment_05/images/20191009_115414.jpg",
["Stayed home"]));


blogEntries.push(new BlogEntry('Processblog', '10-09-2019', 
"For the assignment to query the processblog some changes might be required to the initial data format. The times could be added. Also today is a good day to catch up on some blogging.", 
["Rainy"],
'https://github.com/acdreyer/data-structures/blob/master/wAssignment_05/images/20191009_115414.jpg',
["Stayed home"]));














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



