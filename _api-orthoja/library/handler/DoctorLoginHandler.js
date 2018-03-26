import Handler from './Handler';
import { CODE } from '../error';

/**
 * Class for handling doctor login requests.
 * @memberof module:Handler
 */
class DoctorLoginHandler extends Handler {

    response(payload) {
        /**
         * Payload example:
         * {
         *    session: <string>
         *    type: <'success'|'fail'>
         *    code: <number>
         * }
         */
        return ({
            type: 'Doctor_Login',
            form: 'RESPONSE',
            payload: payload
        })
    }

    process(parcel) {
        return new Promise((resolve) => {
            resolve(
                this.response({
                    type: 'fail',
                    code: CODE.DOCUMENT_NOT_FOUND,
                })
            );
        });
    }

    /**
     * Handles the given parcel data and returns a response message.
     * @param {Object} parcel The object containing details of the recieved request package.
     * @return {Promise<message>} Resolve: message object.
     */
    handle(parcel) {
        return new Promise((resolve) => {

            this.process(parcel).then(resolve);

        });
    }

}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default DoctorLoginHandler;