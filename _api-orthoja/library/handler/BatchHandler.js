import Handler from './Handler';
import OrthojaRouter from '../routing/OrthojaRouter';

/**
 * Class for handling batch requests.
 * @memberof module:Handler
 */
class BatchHandler extends Handler {

    /**
     * Formats a Batch response message.
     * @param {Object} payload The payload for the response message.
     * @return {Object} The message with the payload.
     */
    responseMessage(payload) {
        return ({
            type: 'Batch',
            form: 'RESPONSE',
            payload: payload
        })
    }

    /**
     * Compiles the response message based on the received parcel.
     * @param {Object} parcel The parcel object.
     */
    compile(parcel) {
        return new Promise((resolve) => {
            // Get the payload out of the parcel's message.
            const { payload } = parcel.message;
            // Get the details from the payload.
            const { timing, requests } = payload;
            // Declare an array to store the promises.
            const promises = [];
            // The payload of a batch message contains an array of OTHER messages.
            requests.forEach((request) => {
                // Wrap the request back into a parcel, so it can be routed again.
                const newParcel = { ...parcel, message: request };
                // We need to resend these messages through the router. and get their responses.
                promises.push(OrthojaRouter.route(newParcel));
            });
            // Get the resolves for all the promises once they finished.
            Promise.all(promises).then((values) => {
                resolve(this.responseMessage(values));
            });
        });
    }

    /**
     * Handles the given parcel data and returns a response message.
     * @param {Object} parcel The object containing details of the recieved request package.
     * @return {Promise<message>} Resolve: message object.
     */
    handle(parcel) {
        return new Promise((resolve) => {
            this.compile(parcel).then(resolve);
        });
    }

}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default BatchHandler;