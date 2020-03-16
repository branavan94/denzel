const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const {PORT} = require('./constants');
const nodemon = require('nodemon');
const db = require("./populate");
const dbName = "data";
const collectionName = "movies";
const app = express();
const url = require('url')
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
const imdb = require('./imdb');
const DENZEL_IMDB_ID = 'nm0000243';
const METASCORE = 77;

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

  db.initialize(dbName, collectionName, function(dbCollection) { // successCallback
//REST API
//************************* POPULATE AND UPDATE
  app.get("/movies/populate/nm0000243",async (request, response) => {
  	actor = DENZEL_IMDB_ID
  	metascore = METASCORE
    console.log(`📽️  fetching filmography of ${actor}...`);
    const movies = await imdb(actor);
    const awesome = movies.filter(movie => movie.metascore >= metascore);
  var myobj = movies;
  console.log("Checking for new updates...")
  myobj.forEach(item =>{
  dbCollection.find({"synopsis":item.synopsis}).toArray(function(err, result) {
  if (err) throw err;
  if(result.length == 0){
  dbCollection.insertOne(item,function(err,res){
  console.log("inserted");
  					  })}
  });
  });
  response.json({"total":movies.length});

});
//**************************** End of GET 
//************************* GET A MUST WATCH MOVIE
  app.get("/movies", (request, response) => {
  	  var query = {
    metascore: {
        $gte: 70
    }
};
      dbCollection.find({ $query: query }).toArray((error, result) => {
         if (error) throw error;
         var rnd = getRandomInt(0,result.length-1)
         // return item
         response.json(result[rnd]);
      });
   });

//**************************** End of GET 


//************************* POST 
    app.post("/movies/:id", (request, response) => {
    	
      dbCollection.update({"id" : request.params.id} ,{'$set': {"review":request.body.review, "date":request.body.date}} , (error, result) => {
         if (error) console.log(error);
         // return item
         response.json(result);
      });
   });
//**************************** End of POST

//************************* FETCH A SPECIFIC MOVIE
  app.get("/movies/:id", (request, response) => {
  	  const itemId = request.params.id;
  	  var query = {
    id: itemId
};
      dbCollection.findOne({ $query: query }, (error, result) => {
         if (error) throw error;
         // return item
         response.json(result);
      });
   });
//**************************** End of GET 

//************************* GET A MUST WATCH MOVIE
  app.get('/search', (request, response) => {
  	  var urlParams = new url.URLSearchParams(request.query);
  	  const Idlimit = parseInt(request.query.limit);
  	  const Idmeta = parseInt(request.query.metascore);
  	  var query = {
    metascore: {
        $gte: Idmeta
    }
};
      dbCollection.aggregate([{ $match: {metascore: {$gte: Idmeta}}},{ $sort: { metascore: -1}},{ $limit: Idlimit }]).toArray(function(error, result){
         if (error) throw error;
         // return item
         response.json({"limit": Idlimit, "total":result.length, "results":result});
      });
   });

//**************************** End of GET
//END OF REST API

//GRAPHQL API

// GraphQL schema
var schema = buildSchema(`
    type Query {
        message: String
    }
`);
// END 

// Root resolver
var root = {
    message: () => 'Hello World!'
};
//END 
//SERVER 
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
//END 

//END OF GRAPHQL API

}, function(err) { // failureCallback
    throw (err);
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

app.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`);
});
