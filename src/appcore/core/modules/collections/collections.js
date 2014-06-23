define(function(require) {
    "use strict";

    var Ac = require("../../../appcore");

    var Collection = require("./models/collection");
    var CollectionGroup = require("./models/collection-group");

    /*
        @class Collections

        @classdesc Collections module.
    */

    return Ac.Module.create("Collections", {
        Collection: Collection,
        CollectionGroup: CollectionGroup
    });
});
