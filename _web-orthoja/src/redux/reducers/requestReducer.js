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
    statusKey: {},
    error: {
        code: null
    }
};

// ====================================================================================================
// ACTION FUNCTIONS
// --------------------------------------------------------------------------------
function requestPending(state, action) {

    const newState = {
        ...state,
        status: ENUM_STATUS.PENDING
    };

    if(action.key) {
        newState.statusKey[action.key] = ENUM_STATUS.PENDING;
    }

    return (newState);
}

function requestFulfilled(state, action) {

    const newState = {
        ...state,
        status: ENUM_STATUS.FULFILLED
    };

    if(action.key) {
        newState.statusKey[action.key] = ENUM_STATUS.FULFILLED;
    }

    return (newState);
}

function requestRejected(state, action) {

    const newState = {
        ...state,
        status: ENUM_STATUS.REJECTED,
        error: {
            code: 'server.connection'
        }
    };

    if(action.key) {
        newState.statusKey[action.key] = ENUM_STATUS.REJECTED;
    }

    return (newState);
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