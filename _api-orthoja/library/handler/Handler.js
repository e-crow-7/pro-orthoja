import { CODE } from '../error';
import { Logger } from '../logger';
import { prototype } from 'module';

const LOG = Logger.get();

/**
 * Abstract definition of a handler class for specifying common interface and processing.
 * @memberof module:Handler
 */
class Handler {

    /**
     * Ensures that one instance of this class, or any extended class, is created.
     */
    static instance() {
        if (!Handler._instances) {
            Handler._instances = {};
        }

        if (!Handler._instances[this.name]) {
            Handler._instances[this.name] = new this;
        }

        return Handler._instances[this.name];
    }

    /**
     * Primary constructor for all handlers.
     */
    constructor() {
        LOG.debug('Created new "%s" handler', this.constructor.name);
    }

    /**
     * Begins handling the process. Calls [handle]{@link handle} function and returns
     * it's message object.
     * @param {Object} package An object containing details of the recieved request package.
     * @param {function}  validator
     * @return {Promise.<message>} Resolve: handled message.
     */
    start(parcel, validator) {
        return new Promise((resolve, reject) => {
            LOG.debug('Handling message %s.', parcel.message.type);

            // Validate the payload of the parcel being handled.
            this.validatePayload(parcel, validator).then(
                (payload) => {
                    this.handle(parcel).then(resolve);
                },
                (error) => {
                    LOG.debug(error);
                    resolve({
                        type: 'Status',
                        form: ' RESPONSE',
                        payload: {
                            type: 'fail',
                            code: CODE.BAD_MESSAGE_PAYLOAD
                        }
                    });
                }
            );

        });
    }

    /**
     * 
     * @param {Object} parcel The parcel object.
     * @param {function} validator The JSON validation function.
     * @return {Promise.<payload, error>} Resolve: valid payload. Reject: error object.
     */
    validatePayload(parcel, validator) {
        // Extract the type, form, and payload from the parcel's message.
        const { type, form, payload } = parcel.message;
        // Format the validator key for the payload.
        const validatorKey = new String(form + '/' + type);
        // Create the object to validate against.
        const validateObject = {};
        validateObject[validatorKey] = payload;
        // Validate the payload against the key.
        return validator(validateObject);
    }

    /**
     * Handles the given parcel data and returns a response message.
     * @param {Object} parcel The object containing details of the recieved request package.
     * @return {Promise<message>} Resolve: message object.
     */
    handle(parcel) {
        return new Promise((resolve) => {
            resolve({
                type: 'Status',
                form: ' RESPONSE',
                payload: {
                    type: 'fail',
                    code: CODE.NO_HANDLER
                }
            });
        });
    }

}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default Handler;