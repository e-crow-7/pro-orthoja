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
     * Ensures that one instance of this class, or any extended class is created.
     */
    static instance() {
        if(!Handler._instances) { 
            Handler._instances = {};
        }

        if(!Handler._instances[this.name]) {
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
     * @return {Object} The message object.
     */
    start(parcel) {
        LOG.debug('Handling message %s.', parcel.message.type);

        return this.handle(parcel);
    }

    /**
     * Handles the given parcel data and returns a response message.
     * @param {Object} parcel The object containing details of the recieved request package.
     * @return {Object} The message object.
     */
    handle(parcel) {
        return ({
            type: 'Status',
            form: ' RESPONSE',
            payload: {
                type: 'fail',
                code: CODE.NO_HANDLER
            }
        });
    }

}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default Handler;