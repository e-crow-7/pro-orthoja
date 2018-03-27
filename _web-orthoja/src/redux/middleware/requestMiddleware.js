import { REQUEST } from '../actions/requestActions';
import { FULFILLED } from 'redux-promise-middleware';

// Basic middleware function for processing batch requests.
export default (store) => (next) => (action) => {
    if(
        action.type === `${REQUEST}_${FULFILLED}`
    ) {
        next(action);

        const response = action.payload.data;

        if(response.type && response.form) {
            next({
                type: `${response.type}/${action.type}`,
                payload: response.payload
             });
        }
        return;
    }

    next(action);
}