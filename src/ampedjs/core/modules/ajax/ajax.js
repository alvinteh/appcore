define(function(require) {
    "use strict";

    var Am = require("../../../ampedjs");

    var Xhr = require("./models/xhr");

    /*
        @class Ajax

        @classdesc Ajax module.
    */

    return Am.Module.create("Ajax", {
        Xhr: Xhr
    });
});
