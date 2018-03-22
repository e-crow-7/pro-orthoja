// Basic middleware function for processing batch requests.
export default (store) => (next) => (action) => {
    if(action.type === 'Batch/REQUEST_FULFILLED') {
        next(action);

        const responses = action.payload.data.responses;
        if(typeof(responses) === 'object') {
            responses.forEach((value) => {
                next(value);
            });
        }
        return;
    }

    next(action);
}