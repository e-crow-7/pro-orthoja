import Mongo, { MongoClient } from 'mongodb';
import { CommonError } from '../error';

import { Logger } from '../logger';

const LOG = Logger.get();

/**
 * An "static class" for managing databases asycronously.
 * It manages [AbstractDatabase]{@link AbstractDatabase} instances.
 * The `connect()` method must be used first before any other operation can be performed.
 * 
 * @class DatabaseManager
 * @memberof module:Database
 */
const DatabaseManager = (function () {

    var _client = null;
    var _databases = {};

    /**
     * Fetches the instance of the client.
     * @function _clientInstance
     * @memberof module:Database.DatabaseManager
     * @access private
     * @return {MongoClient} The MongoDB Client instance.
     * @throws {DatabaseManagerError}
     */
    function _clientInstance() {
        if (!_client) {
            throw new DatabaseManagerError('MongoClient has not been initialized.');
            return;
        }
        if (!(_client instanceof MongoClient)) {
            throw new DatabaseManagerError('Client is not an instance of MongoClient.');
            return;
        }
        return _client;
    }

    return ({
        /**
         * Asycronously establishes a MongoClient instance.
         * @function connect
         * @memberof module:Database.DatabaseManager
         * @access public
         * @param {string} url A reference name for the database.
         * @return {Promise.<Object, Object>} Promise object.
         */
        connect: function (url) {
            return new Promise(function (resolve, reject) {
                MongoClient.connect(url, (error, client) => {
                    if (error != null) {
                        reject(new DatabaseManagerError('Failed to connect to database server using URL \'%s\'.', url));
                        return;
                    }
                    _client = client;
                    resolve();
                });
            });
        },
        /**
         * Adds a new database to the manager.
         * @function add
         * @memberof module:Database.DatabaseManager
         * @access public
         * @param {module:Database.Database} database The database class (not an instance, the class only)
         * @return {Promise.<Database, Error>} Promises to add a database.
         */
        add: function (database) {
            return new Promise((resolve, reject) => {
                if (!_client) {
                    throw new DatabaseManagerError('Cannot add databases before connecting.');
                    return;
                }
                // Add the database to the manager's database key: value map.
                _databases[database.name] = new database(_client);

                LOG.debug('Added new "%s" database.', database.name);

                // Ensures the settings for the database is updated when added.
                _databases[database.name]._update().then(
                    (database) => {
                        resolve(database);
                    },
                    (error) => {
                        reject(error);
                    }
                );
            });
        },
        /**
         * Get a reference to a database from the manager.
         * @function get
         * @memberof module:Database.DatabaseManager
         * @access public
         * @param {string} name Name of the Database inserted. Can be retrived using static getter "Database.name".
         * @return {module:Database.Database} Reference to the database instance.
         */
        get: function (name) {
            if(!_databases[name]) {
                return null;
            }
            return _databases[name];
        }
    });
})();

// ================================================================================
// ERROR TYPES
// ------------------------------------------------------------
/**
 * @typedef {DatabaseManagerError}
 */
class DatabaseManagerError extends CommonError {
    constructor(...parameters) {
        super(...parameters);
        this.name = DatabaseManagerError.name;
    }
}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default DatabaseManager;