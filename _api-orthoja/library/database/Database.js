import Mongo from 'mongodb';
import { CommonError } from '../error';

const databaseFilesPath = '../..';

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
                ].join('/')
            }
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