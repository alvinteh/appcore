define(function(require) {
    "use strict";

    var Am = require("../../../ampedjs");

    var Collection = require("./models/collection");
    var CollectionGroup = require("./models/collection-group");

    /*
        @class Collections

        @classdesc Collections module.
    */

    return Am.Module.create("Collections", {
        Collection: Collection,
        CollectionGroup: CollectionGroup
    });
});
