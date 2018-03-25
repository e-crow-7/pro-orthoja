import Mongo from 'mongodb';
import { CommonError } from '../error';
import { Logger } from "../logger";

import fileSystem from 'fs';

const LOG = Logger.get();

const databaseFilesPath = './database';

/**
 * Abstract definition of a database wrapper for Mongo `Db` objects.
 * Instances extended from this classes should be contained within a [DatabaseManager]{@link DatabaseManager}
 * @memberof module:Database
 */
class Database {

    /**
     * Getter for the database name.
     * This should be overridden by the extending class.
     * @return {string} The name of the database.
     */
    static get name() {
        return 'abstract';
    }

    /**
     * Getter for the database collections.
     * This should be overridden by the extending class.
     * @return {string[]} Array of collection names.
     */
    static get collections() {
        return [];
    }

    /**
     * Compiles the details about the instance.
     */
    _compileDetails() {

        // Possibly overridden name getter
        const databaseName = this.constructor.name;
        // Possibly overridden collections getter
        const databaseCollections = this.constructor.collections;

        this.details = {};
        this.details["name"] = databaseName;
        this.details["collections"] = databaseCollections.map((collectionName) => {
            return {
                name: collectionName,
                validatorFile: [
                    databaseFilesPath, 
                    databaseName, 
                    collectionName, 
                    'validator.json'
                ].join('/'),
                indexingFile: [
                    databaseFilesPath, 
                    databaseName, 
                    collectionName, 
                    'indexing.json'
                ].join('/')
            }
        });

    }

    /**
     * Updates the database to ensure the collections exist, and are up to date.
     */
    _update() {
        return new Promise((resolve, reject) => {

            // Array of promises to create or update the collection in the database.
            const collectionPromises = [];

            // Interate through the collections to ensure they exist.
            this.details["collections"].forEach((collectionDetails) => {

                var validator = {};

                try {
                    // Load the validation JSON file.
                    validator = JSON.parse(fileSystem.readFileSync(collectionDetails.validatorFile));
                    // Load the indexing JSON file.
                    //const indexing = JSON.parse(fileSystem.readFileSync(collectionDetails.indexFile));
                } catch(error) {
                    LOG.error(
                        'Failed to load files for collection "%s" in database "%s".\n\rFileSytemError: %s.\n\rSkipping collection\'s integrity check.',
                        collectionDetails.name,
                        this.details.name,
                        error.message
                    );
                    return;
                }

                // Attempts to get a collection from the database.
                this.mongoDb.collection(collectionDetails.name, { strict: true }, (error, collection) =>{
                    // If the collection is null, create it.
                    if(!collection) {
                        collectionPromises.push(
                            this.mongoDb.createCollection(collectionDetails.name, {
                                "validator" : {
                                    "$jsonSchema": validator
                                }
                            })
                        );
                    }
                    // If the collection exists, update the options.
                    else {
                        collectionPromises.push(
                            this.mongoDb.command({
                                "collMod": collectionDetails.name,
                                "validator" : {
                                    "$jsonSchema": validator
                                }
                            })
                        );
                    }
                });
            });

            // Finally, get the resolves/rejects from the array of collection promises.
            Promise.all(collectionPromises).then(
                (resolveValues) => {
                    LOG.debug('Resolved!');
                },
                (rejectValues) => {
                    LOG.debug('Rejected...');
                }
            ).then(() => {
                resolve(this);
            });

        });
    }
    
    /**
     * Creates a wrapper of a Mongo Db instance.
     * @param {Object} client The MongoClient instance.
     * @param {string} name The name of the database.
     * @throws {DatabaseError}
     */
    constructor(client, name) {
        if(!(client instanceof Mongo.MongoClient)) {
            throw new DatabaseError('Database must be constructed with a MongoClient instance.');
        }
        this.mongoDb = client.db(name);

        // populate the this.details property of the instance.
        this._compileDetails();
    }
}

// ================================================================================
// ERROR TYPES
// ------------------------------------------------------------
/**
 * @typedef {DatabaseError}
 */
class DatabaseError extends CommonError {
    constructor(...parameters) {
        super(...parameters);
        this.name = DatabaseError.name;
    }
}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default Database