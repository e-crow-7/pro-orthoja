import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware';

// Basic middleware function for processing batch requests.
export default (store) => (next) => (action) => {
    if(action.payload instanceof Promise) {

        const nextAction = {
            ...action,
            type: `${action.type}_${PENDING}`,
            payload: null
        }

        next(nextAction);

        action.payload.then(
            (resolveValue) => {
                const nextAction = {
                    ...action,
                    type: `${action.type}_${FULFILLED}`,
                    payload: resolveValue
                }
                next(nextAction);
            },
            (rejectValue) => {
                const nextAction = {
                    ...action,
                    type: `${action.type}_${REJECTED}`,
                    payload: rejectValue
                }
                next(nextAction);
            }
        )

        return;
    }

    next(action);
}