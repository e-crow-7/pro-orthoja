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