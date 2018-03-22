import * as batchActions from './batchActions';

export const TYPE = {
    DOCTOR_LOGIN: 'Doctor_Login'
}

/**
 * Redux action to request a Doctor Account Login.
 * @param {string} username Account username.
 * @param {string} password Account password.
 * @return {Object} The dispatcher object.
 */
export function doctorLoginRequest(username, password) {
     // Batch a single user request.
     const requests = [
        {
            type: TYPE.DOCTOR_LOGIN,
            form: 'REQUEST',
            payload: {
                username: username,
                password: password
            }
        }
    ];

    return batchActions.sendBatchRequests(requests);
}