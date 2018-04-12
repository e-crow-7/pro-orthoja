import Handler from './Handler';
import { DatabaseManager, OrthojaDatabase } from '../database';
import { SessionManager } from '../session';
import { Logger } from '../logger';
import { ObjectID, Double } from 'mongodb';

const LOG = Logger.get();

/**
 * Class for handling creating a doctor's patient daily input
 * @memberof module:Handler
 */
class DoctorCreatePatientDailyInputHandler extends Handler {

    response(payload) {
        return ({
            type: 'Doctor_Create_Patient_Daily_Input',
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

    patientDailyFilter(username, dailyId) {
        return({
            "username": username,
            "dailies": {
                "$elemMatch" : {
                    "_id": ObjectID(dailyId)
                }
            }
        })
    }

    patientDailyUpdate(input) {
        return({
            "$push": {
                "dailies.$.inputs": {
                    "_id": ObjectID(),
                    "name": input["name"],
                    "type": input["type"],
                    "unit": input["unit"],
                    "increment": Double(input["increment"]),
                    "min": Double(input["min"]),
                    "max": Double(input["max"]),
                    "default": Double(input["default"])
                }
            }
        })
    }

    process(parcel) {
        return new Promise((resolve) => {

            const orthoja = DatabaseManager.get(OrthojaDatabase.name);
            const collection = orthoja.collection('patients');

            // Extract the patient's username and daily from the payload.
            const { username, dailyId, input }  = parcel.message.payload;

            collection.updateDocument(
                this.patientDailyFilter(username, dailyId),
                this.patientDailyUpdate(input)
            ).then(
                () => {
                    resolve(this.successResponse('account.update'));
                },
                () => {
                    resolve(this.failResponse('account.update'));
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
export default DoctorCreatePatientDailyInputHandler;