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
         * @param {Object} parcel The parcel object containing the message.
         * @throws {OrthojaRouterError}
         * @return {Promise.<Object, Error>} Promise resolves with a message object.
         */
        route: function (parcel) {
            return new Promise((resolve, reject) => {

                if (typeof (parcel.message) !== 'object') {
                    resolve(
                        response('Status', {
                            type: 'fail',
                            code: 'message.format'
                        })
                    );
                    return;
                }

                // Validate the CORE Response message.
                _validator({ "CORE": parcel.message }).then(
                    (data) => {
                        const message = data["CORE"];
                        // Resolve with the hanlder's returned resolved promise.
                        _routes[message.type].start(parcel, _validator).then(resolve);
                    },
                    // MESSAGE INVALID
                    (error) => {
                        resolve(
                            response('Status', {
                                type: 'fail',
                                code: 'message.format'
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
         * @param {function} handler The handler to use.
         * @throws {OrthojaRouterError}
         */
        add: function (messageType, handler) {
            if (typeof (messageType) !== 'string') {
                throw new OrthojaRouterError('Failed to add. Message type is not a string.');
                return;
            }

            // Assign the message type of as key, and the method as a value.
            _routes[messageType] = handler.instance();
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
        this.name = OrthojaRouterError.name;
    }
}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default OrthojaRouter;