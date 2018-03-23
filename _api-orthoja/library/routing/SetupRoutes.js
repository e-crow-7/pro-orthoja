import * as Handlers from "../handler";

/**
 * Adds necessary routes for Doctor operations.
 * Connecting handlers for new message types should be done in this function.
 * @function SetupDoctorRoutes
 * @memberof module:Routing
 * @param {Object} router The router class to add the routes to.
 */
const SetupDoctorRoutes = function(router) {
    router.add('Batch', Handlers.BatchHandler);
    router.add('Doctor_Login', Handlers.DoctorLoginHandler);
}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default { 
    SetupDoctorRoutes: SetupDoctorRoutes
};