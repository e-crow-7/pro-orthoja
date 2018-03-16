/**
 * Configures a mongo database for Orthoja
 * Example: npm run database initialize.js localhost:27017
 */

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Get arguments
const url = 'mongodb://' + process.argv[2];

// Collection name constants.
const COLLECTION_PATIENTS = 'patients';

// Setup the database.
function setupDatabase(client) {
    const db = client.db('orthoja');

    db.createCollection(COLLECTION_PATIENTS, {
        "validator" : {
            "$jsonSchema": require('./patients/validator.json')
        }
    }, (error, collection) => {
        assert.equal(null, error);

        client.close();
    });

}

function setupCollections(collections) {
    console.log(collections);
    collections.forEach((value) => {
        console.log(value.name)
    });
}

// Connect to the database.
MongoClient.connect(url, function (error, client) {
    assert.equal(null, error);
    console.log("Connected successfully to server.");

    setupDatabase(client);
});