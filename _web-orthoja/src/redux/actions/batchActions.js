// Application configuration.
import axios from 'axios';

// Dispatch Types
export const BATCH_REQUEST = 'Batch/REQUEST';

export const ENUM_STATUS = {
    IDLE: 0,
    PENDING: 1,
    FULFILLED: 2,
    REJECTED: 3
}

// Action functions
/**
 * Sends a batch request.
 * @param {array} requests Array of requests to send to the server.
 */
export function sendBatchRequests(requests) {

    // Ensure the requests is an array.
    if(!Array.isArray(requests)) {
        console.log('Batched requests not an array type.');
        return;
    }

    // Batch a single user request.
    const requestBody = {
        type: 'Batch',
        form: 'REQUEST',
        payload: {
            timing: 'sync',
            requests: requests
        }
    };

    return ({
        type: BATCH_REQUEST,
        payload: axios({
            method: 'post',
            url: 'http://localhost:3100',
            data: requestBody,
            timeout: 10000
        })
    });
}