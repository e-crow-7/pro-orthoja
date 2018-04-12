import Handler from './Handler';
import { DatabaseManager, OrthojaDatabase } from '../database';
import { CODE } from '../error';
import { comparePasswordSync } from '../common';
import { SessionManager } from '../session';
import { Logger } from '../logger';

const LOG = Logger.get();

/**
 * Class for handling doctor login requests.
 * @memberof module:Handler
 */
class DoctorLoginHandler extends Handler {

    response(payload) {
        /**
         * Payload example:
         * {
         *    session: <string>
         *    type: <'success'|'fail'>
         *    code: <number>
         * }
         */
        return ({
            type: 'Doctor_Login',
            form: 'RESPONSE',
            payload: payload
        })
    }

    findAccount(username) {

        const orthoja = DatabaseManager.get(OrthojaDatabase.name);
        const collection = orthoja.collection('doctors');

        return (
            collection.findDocument({
                username: username
            })
        );
    }

    process(parcel) {
        return new Promise((resolve) => {

            // Get the username and password from the message.
            const { username, password } = parcel.message.payload;

            this.findAccount(username).then(
                (document) => {
                    if(!document) {
                        this.response({
                            type: 'fail',
                            code: 'account.credentials',
                        });
                        return;
                    }
                    const isMatch = comparePasswordSync(password, document.password);
                    if (isMatch) {
                        // Create a session entry.
                        const session = SessionManager.create(
                            parcel.ip,
                            document._id,
                            'doctor',
                            parcel.agent
                        );
                        resolve(
                            this.response({
                                session: session._id,
                                type: 'success'
                            })
                        );
                        LOG.info('Successful login for Doctor Account "%s". Session ID: %s.', username, session._id);
                    } else {
                        resolve(
                            this.response({
                                type: 'fail',
                                code: 'account.credentials',
                            })
                        );
                    }
                },
                (error) => {
                    resolve(
                        this.response({
                            type: 'fail',
                            code: 'account.credentials',
                        })
                    );
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
export default DoctorLoginHandler;