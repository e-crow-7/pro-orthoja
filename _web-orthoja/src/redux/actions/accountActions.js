import * as requestActions from './requestActions';

export const ACCOUNT_SET = 'Account/SET'
export const DOCTOR_LOGIN = 'Doctor_Login';
export const DOCTOR_LOGOUT = 'Doctor_Logout';
/**
 * Sets the account information to authenticate the account.
 * @param {string} session Session ID.
 * @param {string} type Type of session.
 * @return {Object} The dispatcher object.
 */
export function set(session, type) {
    // Batch a single user request.
    const dispatchObject = {
        type: ACCOUNT_SET,
        payload: {
            session,
            type
        }
    }

    return dispatchObject;
}

/**
 * Redux action to request a Doctor Account Login.
 * @param {string} username Account username.
 * @param {string} password Account password.
 * @return {Object} The dispatcher object.
 */
export function doctorLoginRequest(username, password) {
    // Batch a single user request.
    const request = {
        type: DOCTOR_LOGIN,
        form: 'REQUEST',
        payload: {
            username: username,
            password: password
        }
    }

    return requestActions.sendRequest(request, 'login');
}

/**
 * Redux action to request a Doctor Account Logout.
 * @param {string} session The session ID to logout with.
 * @return {Object} The dispatcher object.
 */
export function doctorLogoutRequest(session) {
    // Batch a single user request.
    const request = {
        type: DOCTOR_LOGOUT,
        form: 'REQUEST',
        payload: {
            session: session
        }
    }

    return requestActions.sendRequest(request, 'logout');
}