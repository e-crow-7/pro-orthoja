import Handler from './Handler';
import { DatabaseManager, OrthojaDatabase } from '../database';
import { SessionManager } from '../session';
import { Logger } from '../logger';
import { ObjectID } from 'mongodb';

const LOG = Logger.get();

/**
 * Class for handling getting a doctor's patient's inputs for a daily.
 * @memberof module:Handler
 */
class DoctorGetPatientDailyInputsHandler extends Handler {

    response(payload) {
        return ({
            type: 'Doctor_Get_Patient_Daily_Inputs',
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

    successResponse(inputs) {
        return this.response({
            inputs: inputs || [],
            status: {
                type: 'success'
            }
        });
    }

    process(parcel) {
        return new Promise((resolve) => {

            const orthoja = DatabaseManager.get(OrthojaDatabase.name);
            const collection = orthoja.collection('patients');

            // Exptract information from the payload
            const { username, dailyId } = parcel.message.payload;

            collection.findDocument({
                "username": username,
                "dailies": {
                    "$elemMatch" : {
                        "_id": ObjectID(dailyId)
                    }
                }
            },
            {
                "dailies.$": true
            }
            ).then(
                (document) => {
                    if(!document) {
                        resolve(this.failResponse('patient.daily.find'));
                        return;
                    }
                    resolve(this.successResponse(document.dailies[0].inputs));
                },
                (error) => {
                    resolve(this.failResponse('patient.daily.find'));
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
export default DoctorGetPatientDailyInputsHandler;