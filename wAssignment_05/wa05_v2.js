
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

// blogEntries.push(new BlogEntry('Thoughts', '09-25-2019 08:00:00', 
// "Yesterday one of the topics covered in class was the information lens. An example used was the google AI drum machine. https://experiments.withgoogle.com/ai/drum-machine/view/. Then on the subway a guy played drums on the train using buckets, the handrail and a harmonica. Something worth visualizing…", 
// ["InfoLens", "Percussion"],
// "20190925_drums.png",
// ["Subway"]));


// blogEntries.push(new BlogEntry('AAmeetings', '09-26-2019', 
// "After a week of viz I discovered that SQL queries and R subsets of dataframes have something in common.", 
// ["InfoLens", "Percussion"],
// "20190926_R.png",
// ["Subway"]))


// blogEntries.push(new BlogEntry('IoT', '09-27-2019', 
// "It seems like pharmacies don't like to sell data loggers without doctor's orders *sigh… Luckily there is some reflection that can be done.", 
// ["datalogging"],
// "20190927_reflections.jpg",
// ["CVS","Central Park"]));

// blogEntries.push(new BlogEntry('Thoughts', '09-28-2019', 
// "National Geographic visualizing the top dogs. I wonder if this is stored in a relational database.", 
// ["dogs", "relationalDB"],
// "20190928_natgeo.jpg",
// ["Subway"]));

// blogEntries.push(new BlogEntry('Thoughts', '09-29-2019', 
// "The medieval faire at the Cloisters is some good research to bolster MET Qualitative data viz research. What is the quality of the armour?", 
// ["Qualitative"],
// "20190929_medieval.jpg",
// ["Cloisters"]));

// blogEntries.push(new BlogEntry('Thoughts', '09-30-2019', 
// "This is not a horizontal data structure.", 
// ["structure"],
// "20190930_structure.jpg",
// ["Columbus Circle"]));


// blogEntries.push(new BlogEntry('Processblog', '10-01-2019', 
// "Today was mostly spent figuring out the nuances of using the dynamoDB primary keys, which are basically split into the partition key and the sort key. It seems like Amazon defined the sort key as an extension of their logic of making composite keys from various bits of information; user email addresses, transaction ID's etc. These paramaters are then concatenated into one big string which can again be broken up by queries. For example, a primary key could have been made up by userid-transactionid-date, which ensures a unique primary key. The query would then search on the primary key by looking at the start or end of the string using ENDWITH or STARTWITH commands (syntax to be confirmed). Hence, the logic of adding a sort key basically just extends this method of making composite primary keys.", 
// ["primary key","composite key","sort key"],
// 'NULL',
// ["Central Park"]));






// blogEntries.push(new BlogEntry('Thoughts', '10-04-2019', 
// "Today I went to the UN building. It makes me think that even despite humanity's best intentions and great technical knowledge, we are still unable to solve some of the simplest of issues; loving thy neighbour.", 
// ["Peace"],
// "20191004_211908.jpg",
// ["The UN building"]));



// blogEntries.push(new BlogEntry('Processblog', '10-04-2019', 
// "Georgia Lupi had a talk today at the Newschool as part of Creative mornings. What struck me about her project of \"Dear data\" is the idea that almost everything can be made into data; e.g. what you ate today, how many times you smiled, things that made you feel an emotion. It got me wondering if there isn't some level of value to record all these things; what patterns we will discover about ourselves. In the movie of The Matrix, there is an inscription above the doorway at the Oracle's kitchen door; -Temet Nosce-, which means -Know thyself-. Socrates said that the unexamined life is not worth living. With data recording becoming more personal, these notions are indeed more attainable on some levels, however would it necessarily be good if we recorded everything about ourselves? I am intrigued to know how Georgia Lupi felt sharing such personal information to the public. If our whole lives were shown as a movie on a DVD, would we really want others to watch it?", 
// ["personal data"],
// "20191004_091414.jpg",
// ["Newschool centennial"]));


// blogEntries.push(new BlogEntry('Thoughts', '10-06-2019', 
// "The Newschool centennial talk at Ellis Island was eye-opening. It was interesting to note the peopling of America and the focus on narratives, so afterward on the Ferry I told a story to the Professor. Once I attended a group discussion where people had to share their most challenging experience. One guy shared on his personal difficulties about his girlfriend not replying to his messages. Another guy from the Congo told the story of how his mother was killed in an attack on their convoy. Sometimes all you need is a bit of perspective.", 
// ["Immigration"],
// "20191006_203742.jpg",
// ["Ellis Island"]));


// blogEntries.push(new BlogEntry('Thoughts', '10-07-2019', 
// "There opened an exhibition on the Last Knight at the MET. The armour is exquisite.", 
// ["Armour"],
// "20191007_170946.jpg",
// ["The MET"]));


// blogEntries.push(new BlogEntry('AAmeetings', '10-09-2019', 
// "Some additional parsing needs to be done on the AA meeting data in order to get it database friendly. Originally the table was extracted, but the days and times weren't parsed. In order to make the tables and queries good, these were now added. Luckily today is a good day to catch up on data structures. Real coding weather and no class.", 
// ["Rainy"],
// "20191009_115414.jpg",
// ["Stayed home"]));


// blogEntries.push(new BlogEntry('Processblog', '10-09-2019', 
// "For the assignment to query the processblog some changes might be required to the initial data format. The times could be added. Also today is a good day to catch up on some blogging.", 
// ["Rainy"],
// '20191009_115414.jpg',
// ["Stayed home"]));

// // ---------------------------------------lull
// // ---------------------------------------lull

// blogEntries.push(new BlogEntry('Thoughts', '10-10-2019', 
// "A thought-provoking presentation on the use of data-viz in Major studio today.\
// The morphing effect between africa and USA was striking.", 
// ["Data Viz"],
// '20191010_124006.jpg',
// ["Class"]));



// blogEntries.push(new BlogEntry('Thoughts', '10-12-2019', 
// "Today was my birthday.\
// It gave me time to stroll in the park and reflect on my life journey so far.\
// I'm grateful to be doing what I'm doing now.", 
// ["Reflection"],
// '20191012_175416.jpg',
// ["Central Park"]));


// blogEntries.push(new BlogEntry('Thoughts', '10-13-2019', 
// "This bad boy was parked in the street.\
// Having a motorbike in the city might be useful for parking spaces.\
// However, I don't know how dangerous it would be. Would be interesting to find out.", 
// ["Vehicles"],
// '20191013_121804.jpg',
// ["Shopping"]));



// blogEntries.push(new BlogEntry('Thoughts', '10-15-2019', 
// "The O'Nassis reservoir never stops supplying beautiful sights.\
// The calm fall weather gives still water with beautiful reflections.", 
// ["Sunsets"],
// '20191015_184102.jpg',
// ["Central Park"]));



// blogEntries.push(new BlogEntry('Thoughts', '10-19-2019', 
// "Today I went to a talk by Julie Andrews; she presented her new book on her Hollywood years. \
// I did not know she was still alive, but she is a real lady. Very diplomatic and conscientious. \
// When someone asked her if she preferred musicals over other movies, she said that all types of \
// movies are nice...although she must say there is something extra special about musicals. \
// Another person asked who'd she recommend playing her in a movie of her life, to which she replied \
// that she couldn't say, because there are so many good upcoming actresses that might not have been \
// discovered yet.", 
// ["Events", "Julie Andrews"],
// '20191019_191841.jpg',
// ["A talk"]));


// blogEntries.push(new BlogEntry('Thoughts', '10-23-2019', 
// "The Subway is an interesting place. Today coming late from class there were only a few \
// people on the station and I caught some perspective. ", 
// ["Subway"],
// '20191023_223214.jpg',
// ["Class"]));


// blogEntries.push(new BlogEntry('IoT', '10-24-2019', 
// "The IoT project is one of my favourites. I built the starter circuit so long \
// before I got time to solder the temperature sensor. The breadboard makes it easy. ", 
// ["IoT stuff"],
// '20191024_093307.jpg',
// ["Class"]));


// blogEntries.push(new BlogEntry('IoT', '10-24-2019 08:00:00', 
// "I soldered the temperature sensor yesterday. When the solder is shiny you know it is good. \
// I also researched on what the pins mean. It uses a digital serail I2C protocol on the SCL and SDA \
// pins, with the address hardwired on some of the other by adding a voltage (or not). \
// If done correctly you can string a few of these on the same input lines to the Particle Photon.", 
// ["IoT stuff"],
// '20191024_093331.jpg',
// ["Class"]));

// blogEntries.push(new BlogEntry('IoT', '10-24-2019 09:00:00', 
// "This is the board all wired up.", 
// ["IoT stuff"],
// 'https://github.com/acdreyer/data-structures/blob/master/wAssignment_05/images/20191024_093428.jpg',
// ["Class"]));

// blogEntries.push(new BlogEntry('IoT', '10-24-2019 10:00:00', 
// "Connection success when the LED is breathing Cyan!", 
// ["IoT stuff"],
// '20191024_100123.jpg',
// ["Class"]));

// blogEntries.push(new BlogEntry('Thoughts', '10-24-2019 17:00:00', 
// "The first flashing of the code. Done from the library to the device in my room. \
// Did I mention I love this type of stuff?", 
// ["Events"],
// '20191024_110417.jpg',
// ["Class"]));


// blogEntries.push(new BlogEntry('IoT', '10-26-2019 23:00:00', 
// "The light breathing cyan is nice, but very bright. \
// I have to cover it sometimes to not keep me awake at night. \
// I'm ok with that...", 
// ["IoT stuff"],
// '20191026_193800.jpg',
// ["Sleep"]));


// blogEntries.push(new BlogEntry('Thoughts', '10-26-2019 19:30:00', 
// "This was the 18th Century Scandanavia Nordic Accord Chamber orchestra. \
// Suberb music from Telemann and others. The Norwegian Cornetto player was especially good. \
// (Not to mention the huge organ Aerophone behind them...wished I could hear how it sounds. \
// The building had a very high ceiling and good acoustics. \
// The event inspired me to delve into Aerophones for the Major Studio project...", 
// ["Events","Musical"],
// '20191026_011855.jpg',
// ["A show"]));



// blogEntries.push(new BlogEntry('Thoughts', '10-28-2019 17:30:00', 
// "The skies are cloudy today and winter is coming. \
// Nice to see how the different patterns emerge. ", 
// ["Clouds"],
// '20191028_180712.jpg',
// ["Central Park"]));



// blogEntries.push(new BlogEntry('IoT', '10-30-2019 10:00:00', 
// "Although this isn't strictly a requirement for the course, I bought a lot of extra stuff. \
// For the IoT project from Sparkfun.com. If there is time I want to see how many sensor I can add. \
// In order not to break the primary project, I bought another photon to run in parallel. \
// Hope I can make it work. ", 
// ["Sensors"],
// '20191030_102740.jpg',
// ["Class"]));

// // ---------------------------------------lull
// // ---------------------------------------lull


// blogEntries.push(new BlogEntry('Processblog', '10-11-2019', 
// "Caught up on some blogging today. I like to write into google docs and only merge onto DynamoDB when there are enough entries to make it worthwhile.", 
// ["blogging"],
// "NULL",
// ["Subway"]));

// blogEntries.push(new BlogEntry('Processblog', '10-31-2019', 
// "Caught up again on some blogging yesterday. Today we had Advanced Quant class during the Halloween parade. It was right on 6th Ave. and we could barely hear the lecturer. Got free chocolate though. We used chocolates to simulated user review data. Interesting stuff.", 
// ["blogging"],
// "NULL",
// ["Class"]));

// blogEntries.push(new BlogEntry('AAmeetings', '10-21-2019', 
// "We had to re-do parsing on the AA meeting data in order to populate the rest of our database; i.e. not just the Address & geolocation data, but also meeting days and times. Fortunately my previous data cleaning was relatively thorough, so I had minimum to do this time. However the bigger issue was that we now also have to do all 10 zones. Watch this space...", 
// ["All Zones"],
// "NULL",
// ["Central park"]));

// blogEntries.push(new BlogEntry('AAmeetings', '10-25-2019', 
// "Parsing all the ten zones are significantly more challenging than just the one zone. There are much more ideosyncracies that need to be accounted for. It is interesting though how my perception was change on the type of data we are dealing with when going from just one zone to all ten. There are much more locations with multiple meetings at a specific address than before, which might imply that more though has to be given on the relational database structure. I might end up doing both a flat database structure and a relational one. ", 
// ["All Zones"],
// "wa07_query.PNG",
// ["Central park"]));

// blogEntries.push(new BlogEntry('AAmeetings', '10-27-2019', 
// "I ended up creating another relational table just to make sure that I have the locations separate from the meeting details in case I need it. There were an average of approx. 6 meetings per location when considering all the zones; a ratio that is different from what I saw looking just at zone 7. It also became clear that it might be worthwhile to add meeting days as enumerated lists, which might help database search performance. I would assume that databases are optimized for searching enumerated lists more than strings. I decided to also make meeting types an enumerated list. I will see if I need it though; there aren't so many meeting types.", 
// ["All Zones"],
// "wa07_relational.PNG",
// ["Central park"]));

// // ---------------------------------------lull
// // ---------------------------------------lull

// blogEntries.push(new BlogEntry('IoT', '11-04-2019 10:00:00', 
// "I realized I spent more time on the IoT project than required, although I think it will be worth it. \
// I decided to also start up the Particle Electron so that I can log data on the go using cellular data.\
// Even though signal will be lost on the subway, missing data might tell its own story. ", 
// ["Sensors"],
// '20191104_094140.jpg',
// ["Class"]));

// blogEntries.push(new BlogEntry('Thoughts', '11-07-2019 17:30:00', 
// "One of the perks of being at a design school is to always get interesting photograph opportunities. \
// There is something about symmetry and perspective that always seems alluring.", 
// ["Perspective"],
// '20191107_110205.jpg',
// ["The 16th street library"]));

// blogEntries.push(new BlogEntry('IoT', '11-08-2019 10:00:00', 
// "I built up a lot of sensors, but some don't really work that well. The microphone saturated after a few days.\
// The microphone registered envelope, gate and signal, but kept flickering even though it was quiet. I think that \
// electromagnetic interferece from the module wifi antennae might be to blame. Using Ardunio I2C comms libraries to make \
// more digital sensor available is also something that takes up a lot of time. I might abandon some of the extra sensors...", 
// ["Sensors"],
// '20191108_113857.jpg',
// ["Central Park"]));

// blogEntries.push(new BlogEntry('Thoughts', '11-11-2019 17:30:00', 
// "I never get tired of looking at the sunset over the Onassis reservoir. \
// The calm water makes for good reflection.", 
// ["Perspective"],
// '20191111_162208.jpg',
// ["Central Park"]));

// blogEntries.push(new BlogEntry('IoT', '11-12-2019 10:00:00', 
// "I spent some extra time today to build up analogue temperature sensors. Went through all the trouble of isolating \
// with heatshrink so that I could use them outside or in the fridge if I want. Their performance is disappointing. \
// Even after I added the capacitors indicated on the datasheet, temperature readings were still inconsistent. \
// I thought it might be due to the cables that are'nt shielded/twisted pairs. However, even though I used very \
// short leads it still didn't give reliable readings. Some internet forums blame the Particle Photon switching microcontroller \
// switching impedance. The documentation states that you need a delay after analogue sampling, which I added. Still no success. \
// I'll have to order additional digital temperature sensors if I seriously want to measure more temperatures.\
// The analogue photoresistor at least gives some believable results. It might not necessarily give accurate Lux readings  \
// (who would be able to tell without calibration equipment), but it will at least show night, day and direct sunlight. \
// Possibly one would be able to say if it was cloudy or not.\
// ", 
// ["Sensors"],
// '20191112_171414.jpg',
// ["Class"]));

// blogEntries.push(new BlogEntry('IoT', '11-12-2019 10:00:00', 
// "Ok so at least I got the Hall sensor working. This means it is possible to measure if the window is fully closed or not. \
// If one wanted to make better conclusions on window opening one would need some distance sensor or add multiple hall sensors. \
// For now I think one Hall sensor would suffice to indicate if the window wasn't fully closed.\
// ", 
// ["Sensors"],
// '20191113_212831.jpg',
// ["Class"]));








// blogEntries.push(new BlogEntry('Thoughts', '11-15-2019 17:30:00', 
// "I was surprized to see a Vuvuzela at the MET. It is undeniably a cultural phenomenon and one would expect a serious \
// collector of aerophones to be in possession of one, but I guess I was surprized to see that they actually exhibit it!", 
// ["Aerophones"],
// '20191115_130719.jpg',
// ["The MET"]));

// blogEntries.push(new BlogEntry('Thoughts', '11-22-2019 20:00:00', 
// "This is chocolate in the shape of rusty metal tools. \
// What a novel concept.", 
// ["Perspective"],
// '20191122_170358.jpg',
// ["Union square market"]));

// blogEntries.push(new BlogEntry('Thoughts', '11-27-2019 20:00:00', 
// "On the eve of Thanksgiving the streets of New York are eerily quiet. \
// The steps of the MET are usually buzzing with people and tonight there are nobody to be found anywhere close by. \
// That was quite a sight. ", 
// ["Perspective"],
// '20191127_215525.jpg',
// ["Central Park"]));

// blogEntries.push(new BlogEntry('Processblog', '10-02-2019', 
// "Today was submit date for assignment 5, luckily I complete it last night. Nice car parked outside class today.", 
// ["assignment"],
// "20191002_144309.jpg",
// ["Central Park"]));

// blogEntries.push(new BlogEntry('Processblog', '11-28-2019', 
// "Caught up on some blogging again today. At least I got a proper keyboard and laptop stand for better posture. \
// Black Friday at least gave me affordable stuff I actually need.", 
// ["blogging"],
// "20191128_235910.jpg",
// ["Macys Day parade"]));



// blogEntries.push(new BlogEntry('AAmeetings', '12-15-2019', 
// "The AA meetings page is finally done... and just in time. I'm pretty happy how it turned out.", 
// ["Assignment"],
// "aameetings_final.png",
// ["Stayed home"]));


blogEntries.push(new BlogEntry('IoT', '12-15-2019 20:00:00', 
"I decided to add the window sensor data on a buttonclick just to show additional scalability.\
Realistically it is not the best way to plot the Hall sensor and Light sensor data on one axis system,\
although it is more used to illustrate the point of adding more sensors than showing exact lux levels.\
I'm very happy how the brushing tool turned out, but I wished I had more time to do a proper multi-graph \
visualization that is portfolio ready.", 
["Sensors"],
'IoTfinal.png',
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



