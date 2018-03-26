import Mongo from 'mongodb';
import { CommonError } from '../error';
import { Logger } from "../logger";
import Collection from './Collection';

import utility from 'util';
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

            // Array of promises to retrive the collection from the database.
            const retrivalPromises = [];
            // Array of promises to create or update the collection in the database.
            const collectionPromises = [];

            // Interate through the collections to ensure they exist.
            this.details["collections"].forEach((collectionDetails) => {

                var validator = null;
                var indexing = null;

                try {
                    // Load the validation JSON file.
                    validator = JSON.parse(fileSystem.readFileSync(collectionDetails.validatorFile));
                    // Load the indexing JSON file.
                    indexing = JSON.parse(fileSystem.readFileSync(collectionDetails.indexingFile));
                } catch (error) {
                    LOG.error(
                        'Failed to load files for collection "%s" in database "%s".\n\rFileSytemError: %s.\n\rSkipping collection\'s integrity check.',
                        collectionDetails.name,
                        this.details.name,
                        error.message
                    );
                    return;
                }

                // Generates a collection instance for the database.
                // This doesn't mean the collection exists in the database yet.
                var collection = this.mongoDb.collection(collectionDetails.name);

                // Collection the promise resolutions.
                collectionPromises.push(
                    // Attempt to update the Collection.
                    // Resolves if the collection exists.
                    // Rejects if the collection does not exist.
                    this.mongoDb.command({
                        "collMod": collectionDetails.name,
                        "validator": {
                            "$jsonSchema": validator
                        }
                    }).then(
                        // Success! The Collection existed and was modified.
                        (result) => {
                            return new Promise((resolve) => {
                                resolve(collection);
                            });
                        },
                        // Failure! The Collection did not exist in the actual database.
                        (error) => {
                            return new Promise((resolve) => {
                                const buildIndexPromises = [];

                                this.mongoDb.createCollection(collectionDetails.name, {
                                    "validator": {
                                        "$jsonSchema": validator
                                    }
                                }).then((newcollection) => {
                                    collection = newcollection;
                                    indexing.forEach((collectionIndex) => {
                                        buildIndexPromises.push(
                                            newcollection.createIndex(collectionIndex.keys, collectionIndex.options)
                                        );
                                    });
                                    Promise.all(buildIndexPromises).then(
                                        (result) => {
                                            resolve(collection);
                                        }
                                    );
                                });

                            });
                        }
                    )
                );
            });

            Promise.all(collectionPromises).then(
                (resolveValues) => {
                    resolveValues.forEach((collection) => {
                        this.mongoCollections[collection.s.name] = collection;
                    });
                    resolve(this);
                },
                (rejectValues) => {
                    LOG.error('MongoDB Collection errors... \n\r%o', rejectValues);
                    reject();
                }
            );

        });
    }

    /**
     * Handler for collection retrival.
     * @param {Object} error MongoDb error
     * @param {Mongo.Collection} collection Collection object for the database.
     * @param {function} callback
     */
    _initializeCollectionHandler(error, collection, callback) {

    }

    /**
     * Creates a wrapper of a Mongo Db instance.
     * @param {Object} client The MongoClient instance.
     * @param {string} name The name of the database.
     * @throws {DatabaseError}
     */
    constructor(client, name) {
        if (!(client instanceof Mongo.MongoClient)) {
            throw new DatabaseError('Database must be constructed with a MongoClient instance.');
        }
        this.mongoDb = client.db(name);
        this.mongoCollections = {};
        this.collectionInstances = {};

        // populate the this.details property of the instance.
        this._compileDetails();
    }

    /**
     * Returns the instance of a collection wrapper.
     * @param {string} name Name of the collection.
     * @return {module:Database.Database.Collection|null} Returns a Collection instance if the collection exists.
     */
    collection(name) {
        if (!this.mongoCollections[name]) {
            return null;
        }

        if (!this.collectionInstances[name]) {
            this.collectionInstances[name] = new Collection(this.mongoCollections[name]);
        }

        return this.collectionInstances[name];
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