
const {MongoClient} = require('mongodb')

require('dotenv').config();

let dbConnection;
let uri = process.env.ATLAS_URI


module.exports = {
    connectToDB: (cb) => {
        MongoClient.connect(uri)
        .then(client => {
            dbConnection = client.db("Family_Tree");
            return cb();
        })
        .catch(err => {
            console.log(err);
            return cb(err);
        })
    },
    getDB: () => dbConnection
}

