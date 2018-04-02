import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware';

// Basic middleware function for processing batch requests.
export default (ref) => {

    const { dispatch } = ref;

    return (next) => (action) => {
        if (action.payload instanceof Promise) {

            const nextAction = {
                ...action,
                type: `${action.type}_${PENDING}`,
                payload: null
            }

            next(nextAction);

            return action.payload.then(
                (resolveValue) => {
                    const nextAction = {
                        ...action,
                        type: `${action.type}_${FULFILLED}`,
                        payload: resolveValue
                    }
                    dispatch(nextAction);
                },
                (rejectValue) => {
                    const nextAction = {
                        ...action,
                        type: `${action.type}_${REJECTED}`,
                        payload: rejectValue
                    }
                    dispatch(nextAction);
                }
            );
        }

        return next(action);
    };
};