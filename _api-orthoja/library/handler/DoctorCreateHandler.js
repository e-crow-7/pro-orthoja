import Handler from './Handler';

/**
 * Class for handling doctor creation requests.
 * @memberof module:Handler
 */
class DoctorCreateHandler extends Handler {

    process(parcel) {

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