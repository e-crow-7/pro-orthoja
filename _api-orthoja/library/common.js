/**
 * Sleep for a certain amount of time.
 * @param {number} milliseconds Amount of time to sleep in milliseconds.
 * @return {Promise} Promises to wait for the set time.
 */
export function sleep(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}