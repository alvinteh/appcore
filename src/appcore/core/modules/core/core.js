define(function(require) {
    "use strict";

    var CoreModel = require("./core.model");
    var CoreView = require("./core.view");

    var _singleton = null;

    /*
        @abstract
        @class Core

        @classdesc Core class.
    */
    var Core = (function() {
        //Private instance members
        var Core = {};
        var data = {
            views: []
        };

        Core.Model = new CoreModel(Core, data);
        Core.View = new CoreView(Core, data);

        //Public instance members
        return Core;
    })();

    return (function() {
        if (_singleton === null || _singleton === undefined) {
            _singleton = Core;
        }

        return _singleton;
    })();
});