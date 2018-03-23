import Handler from './Handler';

/**
 * Class for handling doctor login requests.
 * @memberof module:Handler
 */
class DoctorLoginHandler extends Handler {

    /**
     * Handles the given parcel data and returns a response message.
     * @param {Object} parcel The object containing details of the recieved request package.
     * @return {Promise<message>} Resolve: message object.
     */
    handle(parcel) {
        return new Promise((resolve) => {

            resolve({
                message: "Hit the doctor login handler."
            });

        });
    }

}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default DoctorLoginHandler;