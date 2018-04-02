import { REQUEST } from '../actions/requestActions';
import { FULFILLED, PENDING, REJECTED } from 'redux-promise-middleware';

// Basic middleware function for processing batch requests.
export default (store) => (next) => (action) => {
    if(
        action.type === `${REQUEST}_${FULFILLED}`
    ) {
        const response = action.payload.data;

        if(response.type && response.form) {
            next(action);
            return next({
                type: `${response.type}/${action.type}`,
                payload: response.payload
             });
        }
    }

    if(
        action.type === `${REQUEST}_${PENDING}`
    ) {
        if(action.forward) {
            next(action);
            return next({
                type: `${action.forward}/${action.type}`,
                payload: action.payload
            });
        }
    }

    return next(action);
}