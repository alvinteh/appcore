define(function(require) {
    "use strict";

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
    var Core = (function() {
        //Private instance members
        var Core = {};

        Core.Controller = new CoreController();
        Core.Event = new CoreEvent();
        Core.Helper = new CoreHelper();
        Core.Model = new CoreModel(Core);
        Core.Module = new CoreModule();
        Core.Route = new CoreRoute();
        Core.View = new CoreView();

        //Additional convenience bindings
        Core.go = Core.Route.go;

        //Public instance members
        return Core;
    })();

    return Core;
});
