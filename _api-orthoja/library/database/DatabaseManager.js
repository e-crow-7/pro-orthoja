import Mongo, { MongoClient } from 'mongodb';
import { CommonError } from '../error';

/**
 * An "static class" for managing databases asycronously.
 * It manages [AbstractDatabase]{@link AbstractDatabase} instances.
 * The `connect()` method must be used first before any other operation can be performed.
 * 
 * @class DatabaseManager
 * @memberof module:Database
 */
const DatabaseManager = (function () {

    var clientInstance = null;
    var databases = {};

    function _clientInstance() {
        if(!client) {
            throw new DatabaseManagerError('MongoClient has not been initialized.');
            return;
        }
        if(!(client instanceof MongoClient)) {
            throw new DatabaseManagerError('Client is not an instance of MongoClient.');
            return;
        }
        return client;
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
        connect: function(url) {
            return new Promise(function(resolve, reject) {
                MongoClient.connect(url, (error, client) => {
                    if(error != null) {
                        reject(new DatabaseManagerError('Failed to connect to database server using URL \'%s\'.', url));
                        return;
                    }
                    clientInstance = client;
                    resolve();
                });
            });
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
module.exports.default = DatabaseManager;