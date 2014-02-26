define(function(require) {
    "use strict";

    var Core = require("./core/modules/core/core");

    var _singleton = null;

    /*
        @abstract
        @class Ac

        @classdesc Ac class.
    */
    var AppCore = (function() {
        //Private instance members
        var AppCore = Core;

        //Public instance members
        return AppCore;
    })();

    return (function() {
        if (_singleton === null || _singleton === undefined) {
            _singleton = AppCore;
        }

        return _singleton;
    })();
});