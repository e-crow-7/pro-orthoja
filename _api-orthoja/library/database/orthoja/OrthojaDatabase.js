import { CommonError } from '../../error';
import Database from '../Database';

import DoctorsCollection from './DoctorsCollection';

import { Logger } from '../../logger';

const LOG = Logger.get();

/**
 * Creates a wrapper for the Orthoja database.
 * @class OrthojaDatabase
 * @memberof module:Database
 */
class OrthojaDatabase extends Database {

    /**
     * Getter for the database name.
     * @return {string} The name of the database.
     */
    static get name() {
        return 'orthoja';
    }

    /**
     * Getter for the database collections.
     * @return {string[]} Array of collection names.
     */
    static get collections() {
        return [
            'doctors',
            'patients',
            'sessions'
        ];
    }

    /**
     * Creates a new OrthojaDatabase instance
     * @param {MongoDB.MongoClient} client Mongo database client.
     */
    constructor(client) {
        super(client, OrthojaDatabase.name);

        this._collectionClasses = {
            doctors: DoctorsCollection,
            patients: null,
            sessions: null
        }

        this._collectionInstances = {};
    }
    
}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default OrthojaDatabase;