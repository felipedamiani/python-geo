# python-geo
A simple python api to find places into a radius from a lat/lng point. This project shows how can navigate on google maps and showing the points previously added on mongo db according the center of the map.

To run this project completely, make sure you have installed the latest module of PyMongo, Bottle and the db MongoDB 3+.

In the project, there is a file named data.mongo in the root directory, it's a plain text file and has some documents to add to the mongodb.

Last, after you have created the database "mydb" and the collection "places", you should create a "2DSPHERE" index to the mongo works perfectly.

Create it as: db.places.createIndex( { loc : "2dsphere" } )




