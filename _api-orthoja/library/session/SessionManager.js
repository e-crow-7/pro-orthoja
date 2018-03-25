import Mongo, { ObjectID } from 'mongodb';
import { CommonError } from '../error';

/**
 * An "static class" for managing account sessions.
 * 
 * @class SessionManager
 * @memberof module:Session
 */
const SessionManager = (function () {

    // Key to value type of session.
    // SessionID: { Details object}
    const _sessions = {};

    // Private methods.
    var _createSessionDetailsObject = function (generaterIp, accountId, accountType, deviceId) {
        return ({
            generaterIp: generaterIp,
            accountId: accountId,
            accountType: accountType,
            deviceId: deviceId
        })
    }

    // Public methods.
    return ({
        create(generaterIp, accountId, accountType, deviceId) {
            return new Promise((resolve) => {
                // User mongodb to generate the unique id.
                const id = new ObjectID();
                // Generate a new session entry using MongoDB's ObjectID generation.
                _sessions[id] = _createSessionDetailsObject(generaterIp, accountId, accountType, deviceId);
                // Resolve with the session details when completed.
                resolve(_sessions[id]);
            });
        },
        get(id) {
            return _sessions[id];
        }
    });

})();

// ================================================================================
// ERROR TYPES
// ------------------------------------------------------------
/**
 * @typedef {SessionManagerError}
 */
class SessionManagerError extends CommonError {
    constructor(...parameters) {
        super(...parameters);
        this.name = SessionManagerError.name;
    }
}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default SessionManager;