import Handler from './Handler';
import { DatabaseManager, OrthojaDatabase } from '../database';
import { SessionManager } from '../session';
import { Logger } from '../logger';

const LOG = Logger.get();

/**
 * Class for handling doctor logout requests.
 * @memberof module:Handler
 */
class DoctorLogoutHandler extends Handler {

    response(payload) {
        return ({
            type: 'Doctor_Logout',
            form: 'RESPONSE',
            payload: payload
        })
    }

    process(parcel) {
        return new Promise((resolve) => {

            try {
                SessionManager.delete(parcel.message.payload.session);
            } catch(error) {
                LOG.error(error);
                resolve(
                    this.response({
                        type: 'fail',
                        code: 'account.session'
                    })
                )
                return;
            }

            LOG.info('Successful logout for session "%s".', parcel.message.payload.session);

            resolve(
                this.response({
                    type: 'success',
                })
            )
            return;

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
export default DoctorLogoutHandler;