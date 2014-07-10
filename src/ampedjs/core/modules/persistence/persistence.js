define(function(require) {
    "use strict";

    var Am = require("../../../ampedjs");

    var Syncer = require("./models/syncer");
    var RestSyncer = require("./models/rest-syncer");

    /*
        @class Collections

        @classdesc Collections module.
    */

    return Am.Module.create("Persistence", {
        Syncer: Syncer,
        RestSyncer: RestSyncer
    });
});
