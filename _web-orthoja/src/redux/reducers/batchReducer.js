/**
 * @description Redux reducer for handling User data.
 *
 * @author Eric Crowell
 * @version 0.0.0
 */
import { BATCH_REQUEST, ENUM_STATUS } from '../actions/batchActions';
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware';

// ====================================================================================================
// INITIAL REDUCER STATE
// --------------------------------------------------------------------------------
const initialState = {
    status: ENUM_STATUS.IDLE,
    error: {
        code: 0
    }
};

// ====================================================================================================
// ACTION FUNCTIONS
// --------------------------------------------------------------------------------
function batchRequestPending(state, action) {
    return ({
        ...state,
        status: ENUM_STATUS.PENDING
    })
}

function batchRequestFulfilled(state, action) {
    return ({
        ...state,
        status: ENUM_STATUS.FULFILLED
    })
}

function batchRequestRejected(state, action) {
    return ({
        ...state,
        status: ENUM_STATUS.REJECTED,
        error: {
            code: 1001
        }
    })
}

// ====================================================================================================
// REDUCER
// --------------------------------------------------------------------------------
export default (state = initialState, action) => {

    switch (action.type) {

        case `${BATCH_REQUEST}_${PENDING}`:
            return batchRequestPending(state, action);

        case `${BATCH_REQUEST}_${FULFILLED}`:
            return batchRequestFulfilled(state, action);

        case `${BATCH_REQUEST}_${REJECTED}`:
            return batchRequestRejected(state, action);

        default:
            if (state.error.code !== 0) {
                return { ...state, error: { code: 0 } };
            }
            break;

    }

    return state;

}