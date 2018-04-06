import Handler from './Handler';
import { DatabaseManager, OrthojaDatabase } from '../database';
import { SessionManager } from '../session';
import { Logger } from '../logger';
import { ObjectID } from 'mongodb';

const LOG = Logger.get();

/**
 * Class for handling creating a doctor's patient dailies.
 * @memberof module:Handler
 */
class DoctorCreatePatientDailyHandler extends Handler {

    response(payload) {
        return ({
            type: 'Doctor_Create_Patient_Daily',
            form: 'RESPONSE',
            payload: payload
        })
    }

    failResponse(code) {
        return this.response({
            status: {
                type: 'fail',
                code: code
            }
        });
    }

    successResponse(code) {
        return this.response({
            status: {
                type: 'success',
                code: code
            }
        });
    }

    process(parcel) {
        return new Promise((resolve) => {

            const orthoja = DatabaseManager.get(OrthojaDatabase.name);
            const collection = orthoja.collection('patients');

            resolve(this.failResponse('implementation'));

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
export default DoctorCreatePatientDailyHandler;