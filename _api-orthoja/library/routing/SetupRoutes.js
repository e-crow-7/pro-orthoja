import * as Handlers from "../handler";

/**
 * Adds necessary routes for message types and their corresponding handler.
 * Connecting handlers for new message types should be done in this function.
 * @function SetupRoutes
 * @memberof module:Routing
 * @param {Object} router The router class to add the routes to.
 */
const SetupRoutes = function(router) {
    router.add('Batch', Handlers.BatchHandler);

    // Doctor request routes
    router.add('Doctor_Create', Handlers.DoctorCreateHandler);
    router.add('Doctor_Login', Handlers.DoctorLoginHandler);
    router.add('Doctor_Logout', Handlers.DoctorLogoutHandler);
}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default { 
    SetupRoutes: SetupRoutes
};