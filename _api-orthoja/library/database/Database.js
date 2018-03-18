import { CommonError } from '../error';

/**
 * Abstract definition of a database wrapper for Mongo `Db` objects.
 * The instance of derived classes should be contained within a [DatabaseManager]{@link DatabaseManager}.
 */
export default class Database {
    /**
     * Creates a wrapper of a Mongo Db instance.
     * @constructor
     * @param {Object} database The Mongo Db instance.
     * @throws {DatabaseError}
     */
    constructor(database) {
        if(!(database instanceof Mongo.Db)) {
            throw new DatabaseError('Database must be constructed with a Mongo `Db` object.');
        }
        this.database = database;
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