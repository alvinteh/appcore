define(function(require) {
    "use strict";

    var Ac = require("../../../appcore");

    var Xhr = require("./models/xhr");

    /*
        @class Ajax

        @classdesc Ajax module.
    */

    return Ac.Module.create("Ajax", {
        Xhr: Xhr
    });
});
