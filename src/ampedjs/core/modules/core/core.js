define(function(require) {
    "use strict";

    var CoreConfig = require("./core.config");
    var CoreController = require("./core.controller");
    var CoreEvent = require("./core.event");
    var CoreHelper = require("./core.helper");
    var CoreModel = require("./core.model");
    var CoreModule = require("./core.module");
    var CoreRoute = require("./core.route");
    var CoreView = require("./core.view");

    /*
        @abstract
        @class Core

        @classdesc Core class.
    */
    var Core = function(config) {
        //Private instance members
        var Core = {};

        Core.Config = new CoreConfig();
        Core.Config.set(config || null);

        Core.init = function() {
            //Initialize core framework
            Core.Controller = new CoreController();
            Core.Event = new CoreEvent();
            Core.Helper = new CoreHelper();
            Core.Model = new CoreModel(Core);
            Core.Module = new CoreModule();
            Core.Route = new CoreRoute(Core.Config);
            Core.View = new CoreView(Core.Config);

            //Additional convenience bindings
            Core.go = Core.Route.go;
        };

        //Initialize automatically unless configuration specifies otherwise
        if (Core.Config.get("Am.Core.AutoInit") !== false) {
            Core.init();
        }

        //Public instance members
        return Core;
    };

    return Core;
});
