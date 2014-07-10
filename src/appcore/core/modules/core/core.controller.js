define(function(require) {
    "use strict";

    var Controller = require("./models/controller");

    var _singleton = null;

    var ControllerModule = function() {
        //Private instance members
        var controllers = [];

        var ControllerModule = {
            /*
                @function add

                Adds the specified controller to the internal records.

                @param {Controller} controller        The desired controller
            */
            add: function(controller) {
                //Ignore views which already exist in the internal records
                if (controllers.indexOf(controller) !== -1) {
                    return;
                }

                controllers.push(controller);
            },

            /*
                @function remove

                Removes the specified controller from the internal records.

                @param {Controller} controller        The desired controller
            */
            remove: function(controller) {
                var index = controllers.indexOf(controller);

                if (index !== -1) {
                    controllers.splice(index, 1);
                }
            },

            /*
                @function has

                Checks whether the specified controller exists in the internal records.

                @param {Controller} controller        The desired controller
            */
            has: function(controller) {
                return controllers.indexOf(controller) !== -1;
            },

            /*
                @function create

                Creates a Controller instance and adds it to the internal records.

                @param [{Model[]}] models       The controller's associated model(s)
            */
            create: function(models) {
                var controller = new Controller(models);

                controllers.push(controller);

                return controller;
            },

            Controller: Controller
        };

        //Public instance members
        return ControllerModule;
    };

    return (function() {
        if (_singleton === null || typeof _singleton === "undefined") {
            _singleton = ControllerModule;
        }

        return _singleton;
    })();
});
