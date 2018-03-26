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

    // Key to value for sessions.
    // This time, the key is the accountId.
    // This value contains an array of sessions for a single account.
    const _accountSessions = {};

    // Private methods.
    var _createSessionDetailsObject = function (id, generaterIp, accountId, accountType, deviceId) {
        return ({
            _id: id,
            generaterIp: generaterIp,
            accountId: accountId,
            accountType: accountType,
            deviceId: deviceId
        })
    }

    // Public methods.
    return ({
        create(generaterIp, accountId, accountType, deviceId) {
            // Setup the account session indexing if it doesn't exist.
            if(!_accountSessions[accountId]) {
                _accountSessions[accountId] = [];
            }
            // See if this account already has a session for this accountId and deviceId
            var sessionFromAccountAndDevice = null;
            _accountSessions[accountId].forEach((session) => {
                if(session.deviceId === deviceId) {
                    sessionFromAccountAndDevice = session;
                }
            });
            // If a session already exists, return that id and don't bother making a new one.
            if(sessionFromAccountAndDevice != null) {
                return sessionFromAccountAndDevice;
            }

            // User mongodb to generate the unique id.
            const id = new ObjectID();
            // Generate a new session entry using MongoDB's ObjectID generation.
            _sessions[id] = _createSessionDetailsObject(id, generaterIp, accountId, accountType, deviceId);
            // Store the pointer to the session based on the accountId.
            _accountSessions[accountId].push(_sessions[id]);
            // Return with the session when completed.
            return _sessions[id];
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