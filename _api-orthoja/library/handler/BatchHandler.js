import Handler from './Handler';

/**
 * Class for handling batch requests.
 * @memberof module:Handler
 */
class BatchHandler extends Handler {

    /**
     * Handles the given parcel data and returns a response message.
     * @param {Object} parcel The object containing details of the recieved request package.
     * @return {Object} The message object.
     */
    handle(parcel) {
        // Get the payload out of the parcel's message.
        const { payload } = parcel.message;

        return {
            message: "Hit the batch handler."
        };
    }

}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default BatchHandler;