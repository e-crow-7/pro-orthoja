// Node.js utilities.
const util = require('util');

/**
 * Common error class structure for defining other error types.
 */
export class CommonError extends Error {
    /**
     * Creates and formats an error message.
     * Example: `new CommonError('My message with values: %d, and %s.', 123, 'mystring')`
     * @param {string} message The error message
     * @param {...*} parameters Other types for formatting into the message.
     */
    constructor(message, ...parameters) {
        super(message);
        this.name = CommonError.name;
        this.message = util.format(message, ...parameters);
    }
}

export const CODE = {
    BAD_MESSAGE_FORMAT: 0,
    BAD_MESSAGE_TYPE: 1,
    BAD_MESSAGE_FORM: 2,
    BAD_MESSAGE_PAYLOAD: 3,
    INVALID: 4,
    NO_HANDLER: 5,

    // Document
    DOCUMENT_FAILED: 400,
    DOCUMENT_INVALID: 401,
    DOCUMENT_NOT_FOUND: 402
}