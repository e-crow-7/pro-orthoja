/**
 * Adds necessary routes for Doctor operations.
 * Connecting handlers for new message types should be done in this function.
 * @function SetupDoctorRoutes
 * @memberof module:Routing
 * @param {Object} router The router class to add the routes to.
 */
const SetupDoctorRoutes = function(router) {
    router.add('Batch', (type, payload) => {
        return({
            message: "Not a valid Batch response.",
            payload: payload
        })
    })

    router.add('Doctor_Login', (type, payload) => {
        console.log('Handling a Doctor_Login request!!');
    })
}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default { 
    SetupDoctorRoutes: SetupDoctorRoutes
};