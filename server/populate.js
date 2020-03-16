const imdb = require('./imdb');
const DENZEL_IMDB_ID = 'nm0000243';
const METASCORE = 77;
const MongoClient = require('mongodb').MongoClient;
const dbConnectionUrl = "mongodb+srv://denzelUser:denzelaspi-rox@cluster0-2fmcw.mongodb.net/test?retryWrites=true&w=majority";
function initialize(
    dbName,
    dbCollectionName,
    successCallback,
    failureCallback
) {
    MongoClient.connect(dbConnectionUrl, function(err, dbInstance) {
        if (err) {
            console.log(`[MongoDB connection] ERROR: ${err}`);
            failureCallback(err); // this should be "caught" by the calling function
        } else {
            const dbObject = dbInstance.db(dbName);
            const dbCollection = dbObject.collection(dbCollectionName);
            console.log("[MongoDB connection] SUCCESS");

            successCallback(dbCollection);
        }
    });
}

module.exports = {initialize};


/*

const uri = "mongodb+srv://denzeluser:denzelaspi-rox@cluster0-2fmcw.mongodb.net/data?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });



client.connect(err => {
  const collection = client.db("data").collection("movies");
  var myobj = { name: "Company Inc", address: "Highway 37" };
  collection.insertOne(myobj,function(err,res){
  	console.log("inserted");
  });
  collection.find(function(err, result) {
        console.log("ok2")
        console.log(result);
    });
  // perform actions on the collection object
  console.log("ok")
  client.close();
});*/