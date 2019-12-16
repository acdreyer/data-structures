## MSDV PGDV5110 Final assignments 1,2 and 3 
(due: 12/16/2019 6pm)


### Summary:
------------------------------


This readme page describes details of a Web application that was constructed on Amazon Web Services
using Node Express, PostgreSQL, DynamoDB, Javascript, Html and CSS.
The three final assignments are based on work that was done throughout the Fall 2019 semester.
The assignments are briefly summarized herein. More details are given in each subsection:

* [Assignment 1](https://github.com/visualizedata/data-structures/blob/master/final_assignment_1.md):
Use Alcoholics Anonymous (AA) meeting website data to construct a web application,
that runs with a server-side PostgreSQL database coupled to a front-end html website with an interactive map
that contain the meeting details.

* [Assignment 2](https://github.com/visualizedata/data-structures/blob/master/final_assignment_2.md):
Construct a basic blog website that uses AWS DynamoDB to store details of the blog posts.

* [Assignment 3](https://github.com/visualizedata/data-structures/blob/master/final_assignment_3.md):
Record at least a month's Internet of Things sensor data, store it in a PostgreSQL database and 
build a website that retrieves and plots the data.

Note that the course focuses on the back-end server side data structures rather than the front-end webpage design.





### Web application main page:
--------------------------


The main web page is a plain interface to facilitate user navigation.
This page is the `index.html` page hosted in the application public folder.

![Landing Page](./images_docs/mainlandingpage.png)


-------------------------------

## Assignment 1: AA meetings


The AA meeting project weekly assignments are spread over various weeks
and are briefly summarized below for reference:

* [Week 1](https://github.com/acdreyer/data-structures/tree/master/wAssignment_01):
Extract the body html from online webpages.
* [Week 2](https://github.com/acdreyer/data-structures/tree/master/wAssignment_02):
Parse through one of the pages to extract meeting address data.
* [Week 3](https://github.com/acdreyer/data-structures/tree/master/wAssignment_03):
Geocode each address and store in a JSON file.
* [Week 4](https://github.com/acdreyer/data-structures/tree/master/wAssignment_04):
Create an AWS PostgreSQL database and store AA meeting data therein.
* [Week 6](https://github.com/acdreyer/data-structures/tree/master/wAssignment_06):
Query data from the database.
* [Week 7](https://github.com/acdreyer/data-structures/tree/master/wAssignment_07):
Go back to the original AA meeting html files and now exctract all data from
all the AA meeting pages (previously it was done only for one).
* [Week 10](https://github.com/acdreyer/data-structures/tree/master/wAssignment_10):
Create a web application to connect server-side responses from client-side requests.
* [Week 11](https://github.com/acdreyer/data-structures/tree/master/wAssignment_11):
Do the visual framework design for the final webpage.


Some questions that may arise as you bind the data to the end-user interface:
What information does the end user need? How? Why?
From the data on AA's meeting list, which data is relevant for display in this project? How should it be displayed?
What does a map marker represent? A meeting group? A meeting? A location?
What is the minimum amount of data that can be queried to provide the necessary data for the visual representation?


Your work will be assessed on:
The integrity of the data
The integrity of the database
The efficiency of the queries and page load
The choices of data structures
The inclusion of relevant data
The coherence and organization of your code and repository
The method for binding the data to the visual representation

![AAmeetings Page](./images_docs/AAmeetingspage.png)






----------------------------

## Assignment 2: Process blog


#### 1. Process Blog Introduction:

The Process Blog weekly assignments are briefly introduced, after which the final 
assignment details are supplied:

The weekly assignment details are found in:

* [Week 5](https://github.com/acdreyer/data-structures/tree/master/wAssignment_05):
Create an AWS DynamoDB NoSQL database and start storing process blog data.
* [Week 6](https://github.com/acdreyer/data-structures/tree/master/wAssignment_06):
Query data from the database.
* [Week 10](https://github.com/acdreyer/data-structures/tree/master/wAssignment_10):
Create a web application to connect server-side responses from client-side requests.
* [Week 11](https://github.com/acdreyer/data-structures/tree/master/wAssignment_11):
Do the visual framework design for the final webpage.



#### 2. Process Blog User Interface

Two main types of information is required by the user:
- information to navigate the blog entries 
- the blog entries themselves

Abovementioned implied splitting the browser window into two sections; a main 
window showing the article/blog information and a sidebar that includes navigation
elements (and possible future additional information; depending on future page growth.)


![Process Blog Page](./images_docs/Processblogpage.png)


#### 3. Process Blog Navigation and Query



DynamoDB allows only sorting and searching through the primary and sort keys, 
hence these are the only navigable interfaces available to the user.
The front-end navigation is therefore based on the
chosen primary key of `Category` and the associated sort key of `Date`. 
Using these keys the user is given access to filter the blog entries
using "category" and "date" drop-down menus.


![Process Blog Page](./images_docs/ProcessblogSelect.png)


Whereas it might theoretically be possible for the user to filter blogs with individual days, 
the amount of blog entries and data make longer term ranges for a more user friendly implementation.
Subsquently of date ranges of the
`Past 30 days`, `3 months`, `6 months` and `1 year` were chosen, with the default view
being `Past 30 days` and the category `Thoughts`. This view is to facilitate quick loading
that will have at least one blog entry. The category was also chosen to be "thoughts"
and not directly focused on any of the projects to make it more clear that the user is 
indeed on a blog and not on any of the other "project websites".

User input is obtained from the drop-down menus using JQuery with an 
event listener that calls a function as follows:

```
$(document.body).on('change', "#categoryDropdown", function() {
    keepCat = this.value;
    populatedoc(keepCat, keepRange);
});

```

This sends a `get` request to the server using AJAX as follows, with the
query parameters of `category` and `dtrange` in the query string:

```
$.get('/processblog', { category: keepCat, dtrange: keepRange }, function(data) {
    var htmlposts = small_template(data);
    $('#maincontentarea').html(htmlposts)
});
```
The server employs if statements to assign a DynamoDB query start and end date with the Javascript `moment.js`
library; with `endDate = moment();` and `startDate = moment().subtract(1, 'months')`.


#### 4. Process Blog Response and Content Display

Since the user will likely want to read latest content first,
the blog entries are sorted and returned in *descending order* by including the `ScanIndexForward: false`
parameter in the DynamoDB query object. This allows the user to see the latest entry first
and scroll down toward older entries.


The data is sent from the server to the client as an object that includes and array of objects.
Hence no additional html is sent to the client, but only the filtered list of blog posts. 
The data is then compiled on the client side using a `handlebar` template. 
Sending only the data from the server without additional html is deemed more efficient 
than compiling the html and data on the server and sending the full html, since 
a lot of the html text with div tags are repeated information. Although, it should 
be mentioned that a further future improvement could include
precompiling handlebar templates save the client-side from having to 
compile the template and merge the data, in which case it would only have to merge the data.


```
{{#blogpost}}
  <div class="col-xs-4">
    <div class='post'>
      <h5>Category: {{category}}</h5> <h5>Date: {{date}}</h5>
      <p>{{content}}</p>  
<div class="blogimage">
<img class="rounded mx-auto d-block" src="./imagesBlog/{{filename}}" >
</div>
    </div>
  </div>
{{/blogpost}}
```
The resulting html is as follows:

![Process Blog Page](./images_docs/ProcessblogHtml.png)


Images were also included in all the blog posts, but these were not sent from the server
as part of the blog entry data. Low resolution images are served from the public folder
and only image file names are sent as part of the database query. 
As the user loads a set of blog posts, 
the browser automatically downloads these from the public folder. The blog post 
are then displayed each in its own content `<div>` element as follows:

![Process Blog Page](./images_docs/ProcessblogEntry.png)



#### 5. Progress Blog Conclusion:

The process blog was likely the least challenging of the three assignments due to 
the flexible nature of the DynamoDB database. Managing changes in the database
was significantly easier than the PostgreSQL database and it was found to be
especially useful to have the AWS GUI web interface to manually delete and/or
update individual records. However, the added flexibility did come
at a price, because only the primary key (and associated sort key) can be used
to query data.


<!--Your work will be assessed on:-->
<!--The integrity of the data-->
<!--The integrity of the database-->
<!--The efficiency of the queries and page load-->
<!--The choices of data structures-->
<!--The inclusion of relevant data-->
<!--The coherence and organization of your code and repository-->
<!--The method for binding the data to the visual representation-->




--------------------------------------

## Assignment 3: IoT Temperature Sensor


#### 1. IoT Sensor Introduction

The IoT temperature sensor project builds on the following weeks' work:

<!--https://github.com/acdreyer/data-structures/tree/master/wAssignment_08-->

* Week 8: Build an Internet of Things circuit board to record ambient temperature data
and uploaded to the Particle.io cloud through wifi.
* [Week 9](https://github.com/acdreyer/data-structures/tree/master/wAssignment_06):
Store temperature data in an AWS PostgreSQL database.
* [Week 10](https://github.com/acdreyer/data-structures/tree/master/wAssignment_10):
Create a web application to connect server-side responses from client-side requests.
* [Week 11](https://github.com/acdreyer/data-structures/tree/master/wAssignment_11):
Do the visual framework design for the final webpage.


#### 2. IoT Sensor User Interface
#### 3. IoT Sensor Navigation and Query
#### 4. IoT Sensor Response and Content Display
#### 5. IoT Sensor Conclusion:



Your submission should consist of:

the URL where the visualization is running
the URL of your (well-documented!) GitHub repository for this project, which should include:
detailed written and visual documentation to provide context for your work, including specifics on how your endpoint data connects to each of the elements of your final interface design
Your work will be assessed on:
The integrity of the data (and successful gathering of at least four weeks of good data)
The integrity of the database
The efficiency of the queries and page load
The choices of data structures
The inclusion of relevant data
The coherence and organization of your code and repository
The strategy for binding the data to the visual representation
Reliability, scalability, maintainability, and sustainability


![Sensor Page](./images_docs/IoTsensorpage.png)








