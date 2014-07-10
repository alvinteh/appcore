define(function() {
    "use strict";

    var _singleton = null;

    var RouteModule = function() {
        //Private instance members
        var routes = [];

        //Public instance members
        var RouteModule = {
            /*
                @function bind

                Adds the specified controller to the internal records.

                @param {string} route               The desired route
                @param {Controller} controller      The desired controller
                @param [{string}] action            The desired controller's action
            */
            bind: function(route, controller, action) {
                routes.push(controller);
            }
        };

        return RouteModule;
    };

    return (function() {
        if (_singleton === null || typeof _singleton === "undefined") {
            _singleton = RouteModule;
        }

        return _singleton;
    })();
});
