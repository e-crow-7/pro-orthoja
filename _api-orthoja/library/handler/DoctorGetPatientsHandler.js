import Handler from './Handler';
import { DatabaseManager, OrthojaDatabase } from '../database';
import { SessionManager } from '../session';
import { Logger } from '../logger';
import { ObjectID } from 'mongodb';

const LOG = Logger.get();

/**
 * Class for handling doctor patient retrieval requests.
 * @memberof module:Handler
 */
class DoctorGetPatientsHandler extends Handler {

    response(payload) {
        return ({
            type: 'Doctor_Get_Patients',
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

    successResponse(patients) {
        return this.response({
            patients: patients,
            status: {
                type: 'success'
            }
        });
    }

    getPatientIds(accountId) {
        return new Promise((resolve, reject) => {
            const orthoja = DatabaseManager.get(OrthojaDatabase.name);
            const collection = orthoja.collection('doctors');

            collection.findDocument({ _id: accountId }).then(
                (document) => {
                    if (document.patientIds) {
                        resolve(document.patientIds);
                    } else {
                        reject();
                    }
                },
                (error) => {
                    reject();
                }
            );
        });
    }

    getPatientsInformation(patientIds) {
        return new Promise((resolve, reject) => {
            const orthoja = DatabaseManager.get(OrthojaDatabase.name);
            const collection = orthoja.collection('patients');

            const query = {
                "_id": {
                    "$in": patientIds
                }
            }

            collection.findDocuments(query).then(
                (documents) => {
                    if (Array.isArray(documents)) {
                        const patientDocuments = documents.map((document) => {
                            return ({
                                username: document.username,
                                nickname: document.nickname || null,
                                birthdate: document.birthdate || null,
                                sex: document.sex || null,
                                race: document.race || null,
                                country: document.country || null,
                                region: document.region || null
                            })
                        });
                        resolve(patientDocuments);
                    } else {
                        reject();
                    }
                },
                (error) => {
                    reject();
                }
            );
        });
    }

    process(parcel) {
        return new Promise((resolve) => {

            // Extract data from the parcel.
            const sessionId = parcel.message.payload.session;

            // Get the session information.
            const session = SessionManager.get(sessionId);

            // If no session data is found, send a failed response.
            if (!session) {
                resolve(this.failResponse('account.session'));
                return;
            }

            this.getPatientIds(session.accountId).then(
                this.getPatientsInformation,
                () => {
                    resolve(this.failResponse('account.find'));
                }
            ).then(
                (patientDocuments) => {
                    resolve(this.successResponse(patientDocuments));
                },
                () => {
                    resolve(this.failResponse('patients.find'));
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
export default DoctorGetPatientsHandler;