import { CommonError, CODE } from '../error';

const response = function (type, payload) {
    return ({
        type: type,
        form: 'RESPONSE',
        payload: payload
    });
}
/**
 * A static class for routing Orthoja message types to specific functions.
 * 
 * @class OrthojaRouter
 * @memberof module:Routing
 */
const OrthojaRouter = (function () {

    // Contains a key to value reference for the routes.
    const _routes = {};
    // The message validation function.
    var _validator = () => { return true; };

    return ({
        /**
         * Add a routing entry to call a method when a message type is passed
         * into the routing process.
         * @function route
         * @memberof module:Routing.OrthojaRouter
         * @access public
         * @param {Object} message
         * @throws {OrthojaRouterError}
         * @return {Promise.<Object, Error>} Promise resolves with a message object.
         */
        route: function (message) {
            return new Promise((resolve, reject) => {

                if (typeof (message) !== 'object') {
                    resolve(
                        response('Status', {
                            type: 'fail',
                            code: CODE.BAD_MESSAGE_FORMAT
                        })
                    );
                    return;
                }

                // Validate the CORE Response message.
                _validator({ "CORE": message }).then(
                    (data) => {
                        const message = data["CORE"];
                        resolve(
                            // Resolve with the hanlder's returned response object.
                            _routes[message.type](message.type, message.payload)
                        );
                    },
                    // MESSAGE INVALID
                    (error) => {
                        resolve(
                            response('Status', {
                                type: 'fail',
                                code: CODE.BAD_MESSAGE_FORMAT
                            })
                        );
                    }
                );

            });

        },

        /**
         * Add a routing entry to call a method when a message type is passed
         * into the routing process.
         * @function add
         * @memberof module:Routing.OrthojaRouter
         * @access public
         * @param {string} messageType The name of the message.
         * @param {function} method The method to call.
         * @throws {OrthojaRouterError}
         */
        add: function (messageType, method) {
            if (typeof (messageType) !== 'string') {
                throw new OrthojaRouterError('Failed to add. Message type is not a string.');
                return;
            }

            if (typeof (method) !== 'function') {
                throw new OrthojaRouterError('Failed to add. Method is not a function.');
                return;
            }

            // Assign the message type of as key, and the method as a value.
            _routes[messageType] = method;
        },

        /**
         * Sets the validator function to allow the checking of each routed messages.
         * @function setValidator
         * @memberof module:Routing.OrthojaRouter
         * @access public
         * @param {function} validator The AJV validator function.
         * @throws {OrthojaRouterError}
         */
        setValidator: function (validator) {
            if (typeof (validator) !== 'function') {
                throw new OrthojaRouterError('Failed to set validator. The validator is not a function.');
                return;
            }

            _validator = validator;
        }
    })

})();

// ================================================================================
// ERROR TYPES
// ------------------------------------------------------------
/**
 * @typedef {OrthojaRouterError}
 */
class OrthojaRouterError extends CommonError {
    constructor(...parameters) {
        super(...parameters);
        this.name = DatabaseManagerError.name;
    }
}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default OrthojaRouter;