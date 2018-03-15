// Basic middleware function for processing batch requests.
export const batchMiddleware = (store) => (next) => (action) => {
    if(action.type === 'Batch/REQUEST_FULFILLED') {
        next(action);

        const responses = action.payload.data.responses;
        if(typeof(responses) === 'object') {
            responses.map((value) => {
                next(value);
            });
        }
        return;
    }

    next(action);
}