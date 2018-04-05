import Handler from './Handler';
import { DatabaseManager, OrthojaDatabase } from '../database';
import { SessionManager } from '../session';
import { Logger } from '../logger';

const LOG = Logger.get();

/**
 * Class for handling doctor requests for deleting patients.
 * @memberof module:Handler
 */
class DoctorDeletePatientsHandler extends Handler {

    response(payload) {
        return ({
            type: 'Doctor_Delete_Patients',
            form: 'RESPONSE',
            payload: payload
        })
    }

    successResponse(code) {
        return this.response({
            type: 'success',
            code: code
        })
    }

    failResponse(code) {
        return this.response({
            type: 'fail',
            code: code
        })
    }

    deleteFromDoctor(doctorCollection, doctorId, patientIds) {
        return new Promise((resolve, reject) => {
            doctorCollection.updateDocument(
                { "_id": doctorId },
                {
                    "$pull": {
                        "patientIds": {
                            "$in": patientIds
                        }
                    }
                }
            ).then(resolve, reject);
        });
    }

    deletePatients(patientCollection, patientUsernames) {
        return new Promise((resolve, reject) => {
            patientCollection.deleteDocuments(
                {
                    "username": {
                        "$in": patientUsernames
                    }
                }
            ).then(resolve, reject);
        });
    }

    process(parcel) {
        return new Promise((resolve) => {

            // Extract data from the parcel.
            const sessionId = parcel.message.payload.session;
            // Get the session information.
            const session = SessionManager.get(sessionId);

            if (!session) {
                resolve(this.response(this.failResponse('account.session')));
                return;
            }

            // Get database instance
            const orthojaDatabase = DatabaseManager.get(OrthojaDatabase.name);
            const patientCollection = orthojaDatabase.collection('patients');
            const doctorCollection = orthojaDatabase.collection('doctors');

            // Extract usernames to delete from payload.
            const patientUsernames = parcel.message.payload.usernames;

            // First, find the patients to delete and collect their Ids.
            patientCollection.findDocuments({
                "username": {
                    "$in": patientUsernames
                }
            }).then(
                (documents) => {
                    // Get the paitent ids form the documents.
                    const patientIds = documents.map((document) => {
                        return document["_id"];
                    });

                    console.log('PATIENTS:', patientIds);

                    // Delete the patients from the doctor and the actual patient documents.
                    Promise.all([
                        this.deleteFromDoctor(
                            doctorCollection,
                            session.accountId,
                            patientIds
                        ),
                        this.deletePatients(
                            patientCollection,
                            patientIds
                        )
                    ]).then(
                        () => {
                            resolve(this.response(this.successResponse('account.delete')));
                        },
                        () => {
                            resolve(this.response(this.failResponse('account.delete')));
                        }
                    );
                },
                (error) => {
                    resolve(this.response(this.failResponse('account.find')));
                }
            )



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
export default DoctorDeletePatientsHandler;