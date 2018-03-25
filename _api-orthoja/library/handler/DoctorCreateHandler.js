import Handler from './Handler';
import { DoctorResponses } from "../messages";

/**
 * Class for handling doctor creation requests.
 * @memberof module:Handler
 */
class DoctorCreateHandler extends Handler {

    response(payload) {
        return({
            type: 'Doctor_Create',
            form: 'RESPONSE',
            payload: payload
        })
    }

    process(parcel) {
        return this.response({type: 'fail', code: 0});
    }

    /**
     * Handles the given parcel data and returns a response message.
     * @param {Object} parcel The object containing details of the recieved request package.
     * @return {Promise<message>} Resolve: message object.
     */
    handle(parcel) {
        return new Promise((resolve) => {

            this.process(parcel);

            resolve({
                message: "Hit the doctor create handler."
            });

        });
    }

}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default DoctorCreateHandler;