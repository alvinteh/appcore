define(function(require) {
    "use strict";

    var CoreConfig = require("./core.config");
    var CoreController = require("./core.controller");
    var CoreDI = require("./core.di");
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

            Core.Event = new CoreEvent();
            Core.Helper = new CoreHelper();
            Core.Model = new CoreModel(Core);
            Core.Module = new CoreModule();
            Core.View = new CoreView(Core.Config);
            Core.Route = new CoreRoute(Core.Config);

            Core.DI = new CoreDI(Core.Config, Core.Route);
            Core.Controller = new CoreController(Core);

            //Additional convenience bindings
            Core.go = Core.Route.go;
            Core.Config.getBaseUrl = Core.Route.getBaseUrl;
            Core.Config.setBaseUrl = Core.Route.setBaseUrl;
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
