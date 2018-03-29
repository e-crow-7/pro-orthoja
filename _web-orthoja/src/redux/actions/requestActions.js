// Application configuration.
import axios from 'axios';

// Dispatch Types
export const REQUEST = 'REQUEST';

export const ENUM_STATUS = {
    IDLE: 0,
    PENDING: 1,
    FULFILLED: 2,
    REJECTED: 3
}

// Action functions
/**
 * Sends a request.
 * @param {Object} request The request object to send to the server.
 */
export function sendRequest(request, key, forward) {

    return ({
        type: REQUEST,
        key: key || null,
        forward: forward || null,
        payload: axios({
            method: 'post',
            url: 'http://localhost:3100',
            data: request,
            timeout: 10000
        })
    });

}