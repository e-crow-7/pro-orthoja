const DoctorResponses = {};

const message = function(type, payload) {
    return({
        type: type,
        form: 'RESPONSE',
        payload: payload
    })
}

/**
 * Response message to a Doctor_Create request.
 * @memberof module:Messages
 * @param {string} type The status type of the creation. "success" or "fail".
 * @param {number} code The code number for the type describing the type of success or failure.
 */
DoctorResponses.create = function(type, code) {
    return(message('Doctor_Create', {
        type: type,
        code: code
    }));
}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default DoctorResponses;