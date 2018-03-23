import { CommonError } from '../error';
import AbstractDatabase from './AbstractDatabase';

/**
 * Creates a wrapper for the Orthoja database.
 * The instance of this class should be contained within a [DatabaseManager]{@link DatabaseManager}.
 * @class OrthojaDatabase
 * @memberof module:Database
 */
class OrthojaDatabase extends AbstractDatabase {

    constructor(database) {
        super(database);
    }
    
}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default OrthojaDatabase