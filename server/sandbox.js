/* eslint-disable no-console, no-process-exit */
const imdb = require('./imdb');
const DENZEL_IMDB_ID = 'nm0000243';
const METASCORE = 77;
const dbName = "data";
const collectionName = "movies";
const db = require('./populate');

async function start (actor = DENZEL_IMDB_ID, metascore = METASCORE) {
  try {
    console.log(`📽️  fetching filmography of ${actor}...`);
    const movies = await imdb(actor);
    console.log(movies)
    const awesome = movies.filter(movie => movie.metascore >= metascore);

    //console.log(`🍿 ${movies.length} movies found.`);
    //console.log(JSON.stringify(movies, null, 2));
    //console.log(`🥇 ${awesome.length} awesome movies found.`);
    //console.log(JSON.stringify(awesome, null, 2));
  db.initialize(dbName, collectionName, function(dbCollection) { // successCallback

  var myobj = movies;
  myobj.forEach(item =>{
  dbCollection.find({"synopsis":item.synopsis}).toArray(function(err, result) {

  if (err) throw err;
  console.log(result.length)
  if(result.length == 0){
  dbCollection.insertOne(item,function(err,res){
  console.log("inserted");
  })};
  })
  });
}, function(err) { // failureCallback
    throw (err);
});
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [, , id, metascore] = process.argv;

start(id, metascore)

