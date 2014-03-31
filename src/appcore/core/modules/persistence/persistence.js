define(function(require) {
    "use strict";

    var Ac = require("../../appcore");
    var Syncer = require("./models/syncer");
    var RestSyncer = require("./models/rest-syncer");

    /*
        @class Collections

        @classdesc Collections module.
    */

    return Ac.Module.create("Collections", {
        Syncer: Syncer,
        RestSyncer: RestSyncer
    });
});