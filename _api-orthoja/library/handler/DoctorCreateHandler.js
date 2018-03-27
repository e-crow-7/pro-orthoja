import Handler from './Handler';
import { DatabaseManager, OrthojaDatabase } from '../database';
import { DoctorResponses } from "../messages";

import { hashPasswordSync } from '../common';

/**
 * Class for handling doctor creation requests.
 * @memberof module:Handler
 */
class DoctorCreateHandler extends Handler {

    _generateUsername(firstname, lastname) {
        return ('Dr.' + firstname.charAt(0) + lastname);
    }

    response(payload) {
        return ({
            type: 'Doctor_Create',
            form: 'RESPONSE',
            payload: payload
        })
    }

    document(parcel) {

        // Declare return document object.
        var document = {};
        // Extract payload data.
        // (Message Requirement), (Database Requirement).
        const { 
            firstname, // Required, Required
            lastname, // Required, Required
            username, // Optional, Required
            password, // Required, Required
            email // Required, Required
        } = parcel.message.payload;

        // Most required fields in both the message and database can be directly thrown in.
        document = {...document, firstname, lastname, email};

        // Password needs to be hased before insertion.
        document["password"] = hashPasswordSync(password);

        // Check optional fields that are required by the database.
        document["username"] = username || this._generateUsername(firstname, lastname);

        // Set the creation date.
        document["createdDate"] = new Date().toISOString();

        // Return the database document (hopefully valid).
        return(document);
    }

    /**
     * 
     * @param {Parcel} parcel The object containing 
     */
    process(parcel) {
        return new Promise((resolve) => {
            const orthojaDatabase = DatabaseManager.get(OrthojaDatabase.name);
            const doctorsCollection = orthojaDatabase.collection('doctors');

            doctorsCollection.createDocument(this.document(parcel)).then(
                () => {
                    resolve(
                        this.response({ type: 'success' })
                    );
                },
                () => {
                    resolve(
                        this.response({ type: 'fail', code: 'account.create' })
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

            // Resolve this promise when the resolve of the process promise.
            this.process(parcel).then(resolve);

        });
    }

}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default DoctorCreateHandler;