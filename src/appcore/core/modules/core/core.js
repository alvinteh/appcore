define(function(require) {
    "use strict";

    var CoreController = require("./core.controller");
    var CoreEvent = require("./core.event");
    var CoreHelper = require("./core.helper");
    var CoreModel = require("./core.model");
    var CoreModule = require("./core.module");
    var CoreView = require("./core.view");

    /*
        @abstract
        @class Core

        @classdesc Core class.
    */
    var Core = (function() {
        //Private instance members
        var Core = {};
        var data = {
            controllers: [],
            views: []
        };

        Core.Controller = new CoreController(Core, data);
        Core.Event = new CoreEvent();
        Core.Helper = new CoreHelper();
        Core.Model = new CoreModel(Core);
        Core.Module = new CoreModule();
        Core.View = new CoreView(Core, data);

        //Public instance members
        return Core;
    })();

    return Core;
});
