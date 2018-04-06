import Handler from './Handler';
import { DatabaseManager, OrthojaDatabase } from '../database';
import { SessionManager } from '../session';
import { Logger } from '../logger';
import { ObjectID } from 'mongodb';

const LOG = Logger.get();

/**
 * Class for handling getting a doctor's patient dailies.
 * @memberof module:Handler
 */
class DoctorGetPatientDailiesHandler extends Handler {

    response(payload) {
        return ({
            type: 'Doctor_Get_Patient_Dailies',
            form: 'RESPONSE',
            payload: payload
        })
    }

    failResponse(code) {
        return this.response({
            patients: null,
            status: {
                type: 'fail',
                code: code
            }
        });
    }

    successResponse(dailies) {
        return this.response({
            dailies: dailies || [],
            status: {
                type: 'success'
            }
        });
    }

    process(parcel) {
        return new Promise((resolve) => {

            const orthoja = DatabaseManager.get(OrthojaDatabase.name);
            const collection = orthoja.collection('patients');

            const username = parcel.message.payload.username;

            collection.findDocument({ username: username }).then(
                (document) => {
                    resolve(this.successResponse(document.dailies));
                },
                (error) => {
                    resolve(this.failResponse('account.find'));
                }
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
export default DoctorGetPatientDailiesHandler;