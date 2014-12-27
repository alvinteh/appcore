define(function(require) {
    "use strict";


    var Controller = require("./models/controller");
    var Promise = require("./models/promise");
    var StringHelper = require("./helpers/string-helper");

    var _singleton = null;

    var ControllerModule = function(Core) {
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

                @return {boolean}
            */
            has: function(controller) {
                return controllers.indexOf(controller) !== -1;
            },

            /*
                @function create

                Creates a Controller instance and adds it to the internal records.

                @param [{Model[]}] models       The controller's associated model(s)

                @return {Controller}
            */
            create: function(models) {
                var ret;

                var autoBindController = function(controller) {
                    if (Core.Config.get("Am.Controller.AutoRoute") !== false) {
                        var models = controller.getModels();
                        var modelNames = [];

                        for (var i = 0, length = models.length; i < length; i++) {
                            modelNames.push(StringHelper.pluralize(models[i].getModelName().toLowerCase()));
                        }

                        Core.Route.bind("/" + modelNames.join("_"), controller);
                    }
                };

                if (typeof models === "string") {
                    ret = new Promise();

                    Core.DI.getModel(models).then(
                        function(model) {
                            var controller = new Controller(model);

                            controllers.push(controller);
                            autoBindController(controller);

                            ret.resolve(controller);
                        },
                        function(error) {
                            //The following code must be tested manually
                            //blanketjs:ignore true
                            ret.reject(error);
                            //blanketjs:ignore false
                        }
                    );

                    return ret;
                }
                else if (Array.isArray(models) && typeof models[0] === "string") {
                    var loadedModels = [];

                    ret = new Promise();

                    var resolveFunction = function(model) {
                        //jshint undef:false
                        loadedModels.push(model);

                        if (loadedModels.length === models.length) {
                            var controller = new Controller(loadedModels);

                            controllers.push(controller);
                            autoBindController(controller);

                            ret.resolve(controller);
                        }
                        //jshint undef:true
                    };

                    var rejectFunction = function(error) {
                        //The following code must be tested manually
                        //blanketjs:ignore true
                        ret.reject(error);
                        //blanketjs:ignore false
                    };

                    for (var i = 0, length = models.length; i < length; i++) {
                        Core.DI.getModel(models[i]).then(resolveFunction, rejectFunction);
                    }

                    return ret;
                }
                else {
                    var controller = new Controller(models);

                    controllers.push(controller);
                    autoBindController(controller);

                    return controller;
                }
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
