/**
 * @description Redux reducer for handling Requests
 *
 * @author Eric Crowell
 * @version 0.0.0
 */
import { REQUEST, ENUM_STATUS } from '../actions/requestActions';
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware';

// ====================================================================================================
// INITIAL REDUCER STATE
// --------------------------------------------------------------------------------
const initialState = {
    status: ENUM_STATUS.IDLE,
    error: {
        code: null
    }
};

// ====================================================================================================
// ACTION FUNCTIONS
// --------------------------------------------------------------------------------
function requestPending(state, action) {
    return ({
        ...state,
        status: ENUM_STATUS.PENDING
    })
}

function requestFulfilled(state, action) {
    return ({
        ...state,
        status: ENUM_STATUS.FULFILLED
    })
}

function requestRejected(state, action) {
    return ({
        ...state,
        status: ENUM_STATUS.REJECTED,
        error: {
            code: 'server.connection'
        }
    })
}

// ====================================================================================================
// REDUCER
// --------------------------------------------------------------------------------
export default (state = initialState, action) => {

    switch (action.type) {

        case `${REQUEST}_${PENDING}`:
            return requestPending(state, action);

        case `${REQUEST}_${FULFILLED}`:
            return requestFulfilled(state, action);

        case `${REQUEST}_${REJECTED}`:
            return requestRejected(state, action);

        default:
            if (state.error.code) {
                return { ...state, error: { code: null } };
            }
    }

    return state;

}