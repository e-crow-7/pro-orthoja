import Handler from './Handler';
import { DatabaseManager, OrthojaDatabase } from '../database';
import { SessionManager } from '../session';
import { Logger } from '../logger';
import { Session } from 'inspector';
import { ObjectID } from 'mongodb';

const LOG = Logger.get();

/**
 * Class for handling doctor account information requests.
 * @memberof module:Handler
 */
class DoctorAccountInformationHandler extends Handler {

    response(payload) {
        return ({
            type: 'Doctor_Account_Information',
            form: 'RESPONSE',
            payload: payload
        })
    }

    failResponse(code) {
        return this.response({
            information: null,
            status: {
                type: 'fail',
                code: code
            }
        });
    }

    successResponse(information) {
        return this.response({
            information: information,
            status: {
                type: 'success'
            }
        });
    }

    getInformation(accountId) {
        return new Promise((resolve, reject) => {
            const orthoja = DatabaseManager.get(OrthojaDatabase.name);
            const collection = orthoja.collection('doctors');

            collection.findDocument({ _id: accountId }).then(
                (document) => {
                    if (document._id) {
                        resolve(document);
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

            this.getInformation(session.accountId).then(
                (document) => {
                    resolve(
                        this.successResponse({
                            firstname: document.firstname,
                            lastname: document.lastname,
                            username: document.username,
                            email: document.email,
                            createdDate: document.createdDate
                        })
                    );
                },
                () => {
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
export default DoctorAccountInformationHandler;